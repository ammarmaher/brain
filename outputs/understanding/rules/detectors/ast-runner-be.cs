// *** Falcon Rulebook — Backend AST Detector Engine (Roslyn) ***
// *** Reads rule frontmatter where detector.type=ast and scope is BE, ***
// *** walks Roslyn syntax tree across each .NET service, emits violations to JSONL ***
//
// Status: SCAFFOLD shipped Session 2. One working detector (R-BE-002 — app service can't call app service).
//         R-BE-001 / R-BE-004 / R-BE-008 are stubbed with TODO markers; Session 3 wires them.
//
// Build (one-time):
//   dotnet new console -n FalconAstRunnerBE -o build/
//   cd build/
//   dotnet add package Microsoft.CodeAnalysis.CSharp.Workspaces
//   dotnet add package Microsoft.Build.Locator
//   cp ../ast-runner-be.cs Program.cs
//   dotnet build
//
// Run:
//   dotnet run --project build/ -- \
//     --rules    "C:\Falcon\Brain Outputs\understanding\rules" \
//     --target   "C:\Falcon\falcon-core-commerce-svc" \
//     --output   "violations-ast-be.jsonl" \
//     --runId    "session-2-smoke"
//
// Requires .NET 8/9/10 SDK. Roslyn version follows the target's csproj.

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

class Program
{
    static string RulesFolder = "";
    static string TargetRepo  = "";
    static string OutputFile  = "";
    static string RunId       = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
    static string Now         = DateTime.UtcNow.ToString("o");

    static int Main(string[] args)
    {
        for (int i = 0; i < args.Length; i++)
        {
            switch (args[i])
            {
                case "--rules":  RulesFolder = args[++i]; break;
                case "--target": TargetRepo  = args[++i]; break;
                case "--output": OutputFile  = args[++i]; break;
                case "--runId":  RunId       = args[++i]; break;
            }
        }

        if (string.IsNullOrEmpty(RulesFolder) || string.IsNullOrEmpty(TargetRepo) || string.IsNullOrEmpty(OutputFile))
        {
            Console.Error.WriteLine("Usage: ast-runner-be --rules <path> --target <repo> --output <file> [--runId <id>]");
            return 1;
        }

        var rules = LoadBackendAstRules(RulesFolder);
        Console.WriteLine($"Loaded {rules.Count} BE-AST rules");

        using var writer = new StreamWriter(OutputFile, append: false);
        int scanned = 0, emitted = 0;

        var csFiles = Directory.EnumerateFiles(TargetRepo, "*.cs", SearchOption.AllDirectories)
            .Where(p => !p.Contains($"{Path.DirectorySeparatorChar}bin{Path.DirectorySeparatorChar}")
                     && !p.Contains($"{Path.DirectorySeparatorChar}obj{Path.DirectorySeparatorChar}"))
            .ToList();

        foreach (var file in csFiles)
        {
            string rel = Path.GetRelativePath(TargetRepo, file).Replace(Path.DirectorySeparatorChar, '/');
            string source;
            try { source = File.ReadAllText(file); } catch { continue; }
            var tree = CSharpSyntaxTree.ParseText(source, path: file);
            var root = tree.GetCompilationUnitRoot();
            scanned++;

            foreach (var rule in rules)
            {
                if (MatchesAnyGlob(rel, rule.ScopeExemptPaths)) continue;
                if (rule.ScopePaths.Count > 0 && !MatchesAnyGlob(rel, rule.ScopePaths)) continue;

                IEnumerable<Violation>? hits = rule.RuleId switch
                {
                    "R-BE-002" => DetectAppServiceToAppService(root, rule, rel, tree),
                    "R-BE-004" => DetectMissingServiceOperationResult(root, rule, rel, tree),
                    "R-BE-008" => DetectMissingAuthorizeAttribute(root, rule, rel, tree),
                    "R-BE-001" => DetectCleanArchLayerViolation(root, rule, rel, tree),
                    _ => null
                };

                if (hits == null) continue;
                foreach (var v in hits)
                {
                    writer.WriteLine(JsonSerializer.Serialize(v));
                    emitted++;
                }
            }
        }

        Console.WriteLine($"\n=== AST-BE run complete ===");
        Console.WriteLine($"Files scanned : {scanned}");
        Console.WriteLine($"Violations    : {emitted}");
        Console.WriteLine($"Output        : {OutputFile}");
        return 0;
    }

    // ----------------------------------------------------------------
    // R-BE-002 — Application Service constructor-injects another Application Service
    // ----------------------------------------------------------------
    static IEnumerable<Violation> DetectAppServiceToAppService(CompilationUnitSyntax root, RuleMeta rule, string relPath, SyntaxTree tree)
    {
        var classes = root.DescendantNodes().OfType<ClassDeclarationSyntax>()
            .Where(c => c.Identifier.Text.EndsWith("AppService") || c.Identifier.Text.EndsWith("ApplicationService"));

        foreach (var cls in classes)
        {
            var ctor = cls.Members.OfType<ConstructorDeclarationSyntax>().FirstOrDefault();
            if (ctor == null) continue;
            foreach (var param in ctor.ParameterList.Parameters)
            {
                var typeText = param.Type?.ToString() ?? "";
                if (typeText.EndsWith("AppService") || typeText.EndsWith("ApplicationService")
                    || typeText.EndsWith("AppService>") || typeText.EndsWith("ApplicationService>"))
                {
                    var span = param.GetLocation().GetLineSpan();
                    yield return BuildViolation(rule, relPath, span.StartLinePosition.Line + 1,
                        param.ToString().Trim(),
                        $"AppService injects {typeText}");
                }
            }
        }
    }

    // ----------------------------------------------------------------
    // R-BE-004 — Public Application Service method NOT returning ServiceOperationResult<T>  (STUB)
    // ----------------------------------------------------------------
    static IEnumerable<Violation> DetectMissingServiceOperationResult(CompilationUnitSyntax root, RuleMeta rule, string relPath, SyntaxTree tree)
    {
        var classes = root.DescendantNodes().OfType<ClassDeclarationSyntax>()
            .Where(c => c.Identifier.Text.EndsWith("AppService") || c.Identifier.Text.EndsWith("ApplicationService"));

        foreach (var cls in classes)
        {
            foreach (var m in cls.Members.OfType<MethodDeclarationSyntax>())
            {
                if (!m.Modifiers.Any(x => x.Text == "public")) continue;
                var rt = m.ReturnType?.ToString() ?? "";
                bool ok = rt.Contains("ServiceOperationResult");
                if (ok) continue;
                if (rt == "void" || rt == "Task") continue; // command-style with no return is acceptable in some patterns; Session 3 refines
                var span = m.Identifier.GetLocation().GetLineSpan();
                yield return BuildViolation(rule, relPath, span.StartLinePosition.Line + 1,
                    $"{rt} {m.Identifier.Text}(...)",
                    $"return type {rt} missing ServiceOperationResult");
            }
        }
    }

    // ----------------------------------------------------------------
    // R-BE-008 — Controller missing [Authorize] / [AllowAnonymous]
    // ----------------------------------------------------------------
    static IEnumerable<Violation> DetectMissingAuthorizeAttribute(CompilationUnitSyntax root, RuleMeta rule, string relPath, SyntaxTree tree)
    {
        var controllers = root.DescendantNodes().OfType<ClassDeclarationSyntax>()
            .Where(c => c.Identifier.Text.EndsWith("Controller"));

        foreach (var c in controllers)
        {
            var attrs = c.AttributeLists.SelectMany(al => al.Attributes).Select(a => a.Name.ToString()).ToList();
            bool hasAuth = attrs.Any(a => a == "Authorize" || a == "AuthorizeAttribute" || a == "AllowAnonymous" || a == "AllowAnonymousAttribute");
            if (hasAuth) continue;
            var span = c.Identifier.GetLocation().GetLineSpan();
            yield return BuildViolation(rule, relPath, span.StartLinePosition.Line + 1,
                $"class {c.Identifier.Text}",
                "controller lacks [Authorize] / [AllowAnonymous]");
        }
    }

    // ----------------------------------------------------------------
    // R-BE-001 — Clean Architecture layer violation  (STUB)
    // ----------------------------------------------------------------
    // TODO Session 3: implement layer-aware namespace check
    //   - Domain   namespace may NOT depend on Application / Infrastructure / Api
    //   - Application may NOT depend on Infrastructure / Api
    //   - Infrastructure may NOT depend on Api
    static IEnumerable<Violation> DetectCleanArchLayerViolation(CompilationUnitSyntax root, RuleMeta rule, string relPath, SyntaxTree tree)
    {
        yield break;
    }

    // ----------------------------------------------------------------
    // Plumbing
    // ----------------------------------------------------------------

    record RuleMeta(string RuleId, string RuleName, string Category, string Severity,
                   List<string> ScopePaths, List<string> ScopeExemptPaths, string PatchHint);

    record Violation(
        string ruleId, string ruleName, string ruleCategory, string severity,
        string detectorType, string targetRepo, string filePath, int lineNumber,
        string lineContent, string matchedPattern, bool exemptByRule, bool exemptByRegistry,
        string suggestedFix, string detectedAt, string runId);

    static Violation BuildViolation(RuleMeta rule, string filePath, int line, string snippet, string matched) =>
        new(rule.RuleId, rule.RuleName, rule.Category, rule.Severity, "ast", TargetRepo,
            filePath, line, snippet.Length > 200 ? snippet.Substring(0, 200) : snippet, matched,
            false, false, rule.PatchHint, Now, RunId);

    static List<RuleMeta> LoadBackendAstRules(string rulesFolder)
    {
        var rules = new List<RuleMeta>();
        foreach (var file in Directory.EnumerateFiles(rulesFolder, "R-BE-*.md", SearchOption.AllDirectories))
        {
            var raw = File.ReadAllText(file);
            var m = System.Text.RegularExpressions.Regex.Match(raw, @"^---\r?\n([\s\S]+?)\r?\n---");
            if (!m.Success) continue;
            var fm = m.Groups[1].Value;

            string Read(string key) =>
                System.Text.RegularExpressions.Regex.Match(fm, $@"^{key}:\s*(.+)$",
                    System.Text.RegularExpressions.RegexOptions.Multiline).Groups[1].Value.Trim().Trim('\'','"');

            // detector.type
            string detType = "";
            var dm = System.Text.RegularExpressions.Regex.Match(fm,
                @"^detector:\s*\r?\n([\s\S]+?)(?=^[A-Za-z]|\z)",
                System.Text.RegularExpressions.RegexOptions.Multiline);
            if (dm.Success)
            {
                var d2 = System.Text.RegularExpressions.Regex.Match(dm.Groups[1].Value, @"^[ \t]+type:\s*(.+)$",
                    System.Text.RegularExpressions.RegexOptions.Multiline);
                if (d2.Success) detType = d2.Groups[1].Value.Trim();
            }
            if (detType != "ast") continue;

            List<string> ReadList(string parent, string child)
            {
                var sm = System.Text.RegularExpressions.Regex.Match(fm,
                    $@"^{parent}:[\s\S]+?(?=^\S|\z)",
                    System.Text.RegularExpressions.RegexOptions.Multiline);
                if (!sm.Success) return new List<string>();
                var lr = System.Text.RegularExpressions.Regex.Match(sm.Value,
                    $@"^[ \t]+{child}:\s*\r?\n((?:[ \t]+-\s*['""].*['""]\r?\n)+)",
                    System.Text.RegularExpressions.RegexOptions.Multiline);
                if (!lr.Success) return new List<string>();
                var result = new List<string>();
                foreach (var line in lr.Groups[1].Value.Split('\n'))
                {
                    var x = System.Text.RegularExpressions.Regex.Match(line, @"^[ \t]+-\s*['""](.*)['""]\s*$");
                    if (x.Success) result.Add(x.Groups[1].Value);
                }
                return result;
            }

            rules.Add(new RuleMeta(
                Read("ruleId"), Read("name"), Read("category"), Read("severity"),
                ReadList("scope", "paths"), ReadList("scope", "exemptPaths"), ""));
        }
        return rules;
    }

    static bool MatchesAnyGlob(string relPath, List<string> globs)
    {
        if (globs == null || globs.Count == 0) return false;
        foreach (var g in globs)
        {
            var rx = "^" + System.Text.RegularExpressions.Regex.Escape(g)
                .Replace(@"\*\*", ".*")
                .Replace(@"\*", "[^/]*")
                .Replace(@"\?", ".") + "$";
            if (System.Text.RegularExpressions.Regex.IsMatch(relPath, rx)) return true;
        }
        return false;
    }
}
