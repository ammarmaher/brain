// src/Commerce.Domain/Orders/Order.cs
namespace Commerce.Domain.Orders;

public class Order
{
    public void Submit()
    {
        if (Items.Count == 0)
            throw new FalconException(FalconError.OrderHasNoItems);
    }
}
