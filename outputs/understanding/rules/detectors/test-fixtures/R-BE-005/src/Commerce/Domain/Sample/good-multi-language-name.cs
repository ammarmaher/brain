// src/Commerce.Domain/Accounts/Account.cs
namespace Commerce.Domain.Accounts;

public class Account
{
    public Guid Id { get; private set; }
    public MultiLanguageName Name { get; private set; }
    public MultiLanguageName Description { get; private set; }
    public string Slug { get; private set; }
}
