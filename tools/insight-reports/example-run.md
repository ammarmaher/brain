# Example run — Brain SK Insight Reports Tool

Brain SK routes here when Ammar asks for a boss-ready chart report. Example prompt:

```text
Create an executive boss report for Organization Hierarchy using charts and statistics.
```

Flow:

1. **Statistical Intelligence runs first** — produces KPIs, formulas, and chart-ready JSON with provenance.
2. Executive Insight Reports renders the report from those numbers.

Expected output folder:

```text
C:\Falcon\Brain Outputs\reports\executive-insights\organization-hierarchy-<YYYY-MM-DD-HHmm>\
  EXECUTIVE_REPORT.md
  EXECUTIVE_REPORT.html
  EXECUTIVE_REPORT.pdf           (only when the PDF toolchain works)
  EXECUTIVE_REPORT_DATA.json
  CHART_PROVENANCE.md            (mandatory — provenance of every chart/diagram)
  REPORT_GENERATION_TRACE.md     (mandatory — generation trace)
  charts\  diagrams\  screenshots\  evidence\
  README.md
```

> Setup-only note: tool dependencies are not yet installed. Run `npm install`
> inside this folder before the first real report. The Markdown report is always
> produced; HTML/PDF is optional. Charts never display invented numbers, and
> every chart carries a Chart Provenance block.
