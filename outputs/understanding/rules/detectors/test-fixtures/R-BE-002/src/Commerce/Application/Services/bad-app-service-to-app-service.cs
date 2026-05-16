// src/Commerce/Application/Services/bad-app-service-to-app-service.cs
// *** BAD — AppService constructor-injects another AppService ***
// *** This violates R-BE-002 — must use Domain Service / MediatR / coordinator ***
namespace Commerce.Application.Services;

public class OtherAppService
{
}

public class BadOrderAppService
{
    private readonly OtherAppService _other;

    public BadOrderAppService(OtherAppService other)
    {
        _other = other;
    }
}
