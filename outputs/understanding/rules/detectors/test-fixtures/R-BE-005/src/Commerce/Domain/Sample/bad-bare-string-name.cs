// src/Commerce.Domain/Accounts/Account.cs
namespace Commerce.Domain.Accounts;

public class Account
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
}
