// src/Commerce.Infrastructure/Auth/ZitadelTokenClient.cs
using Microsoft.Extensions.Options;

namespace Commerce.Infrastructure.Auth;

public class ZitadelTokenClient
{
    private readonly ZitadelOptions _options;

    public ZitadelTokenClient(IOptions<ZitadelOptions> options)
    {
        _options = options.Value;
    }
}
