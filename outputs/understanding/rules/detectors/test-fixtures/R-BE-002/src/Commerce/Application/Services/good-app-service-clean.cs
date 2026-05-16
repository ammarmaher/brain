// src/Commerce/Application/Services/good-app-service-clean.cs
// *** GOOD — AppService takes only repositories / domain services / MediatR ***
// *** No AppService->AppService injection ***
namespace Commerce.Application.Services;

public interface IAccountRepository {}
public interface IMediator {}

public class GoodOrderAppService
{
    private readonly IAccountRepository _repo;
    private readonly IMediator _mediator;

    public GoodOrderAppService(IAccountRepository repo, IMediator mediator)
    {
        _repo = repo;
        _mediator = mediator;
    }
}
