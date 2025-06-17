using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Ordering.Domain.Models;
using Ordering.Domain.ValueObjects;
using Ordering.Domain.Enums;

namespace Ordering.Infrastructure.Data.SeedData;

public static class OrderingSeedData
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        if (!await context.Orders.AnyAsync())
        {
            logger.LogInformation("🌱 Seeding orders...");
            await SeedOrders(context, logger);
            logger.LogInformation("✅ Orders seeding completed");
        }
    }

    private static async Task SeedOrders(ApplicationDbContext context, ILogger logger)
    {
        var orders = new List<Order>();

        // Sample customers from Identity service
        var customers = new[]
        {
            new { UserName = "swn", CustomerId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afa6") },
            new { UserName = "alice", CustomerId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afa7") },
            new { UserName = "bob", CustomerId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afa8") },
            new { UserName = "emily", CustomerId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afa9") },
            new { UserName = "michael", CustomerId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afaa") },
            new { UserName = "sarah", CustomerId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afab") },
            new { UserName = "david", CustomerId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afac") },
            new { UserName = "lisa", CustomerId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afad") },
            new { UserName = "john", CustomerId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afae") },
            new { UserName = "maria", CustomerId = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afaf") }
        };

        // Sample products (matching Catalog service toy products)
        var sampleProducts = new[]
        {
            new { Id = Guid.Parse("5334c996-8457-4cf0-815c-ed2b77c4ff61"), Name = "Squid Game 5 Taş Oyunu", Price = 149.99m },
            new { Id = Guid.Parse("c67d6323-e8b0-4bdd-a7e6-a593eb6068e8"), Name = "Smile Games Günün Sorusu Kutu Oyunu", Price = 274.99m },
            new { Id = Guid.Parse("4f136e07-cc90-4d8b-b847-68c0a3331d79"), Name = "Smile Games Matematik Oyunu", Price = 589.99m },
            new { Id = Guid.Parse("6ec1297b-ec0a-4aa1-be25-6726e3b51a27"), Name = "UNO Reverse Pack Eklenti Paketi", Price = 119.99m },
            new { Id = Guid.Parse("b786103d-c621-4f5a-b498-23312a3fa792"), Name = "UNO Stack Pack Eklenti Paketi", Price = 119.99m },
            new { Id = Guid.Parse("9c8d7e6f-5a4b-3c2d-1e0f-9a8b7c6d5e4f"), Name = "Bontempi Işıklı Mikrofonlu Elektronik Tabureli Org", Price = 2699.00m },
            new { Id = Guid.Parse("f24d3e2f-1a0b-9c8d-7e6f-5a4b3c2d1e0f"), Name = "Fisher Price Matematikçi Timsah", Price = 1399.99m },
            new { Id = Guid.Parse("2570a6b5-4c3d-2e1f-0a9b-8c7d6e5f4a3b"), Name = "Sesli Disney Stitch Real Fx Elektronik Kukla 30 cm", Price = 4289.99m },
            new { Id = Guid.Parse("58a3d9e8-7f6a-5b4c-3d2e-1f0a9b8c7d6e"), Name = "1:64 Hot Wheels The Hot Ones Fiat 500 Topolino (1936)", Price = 249.99m },
            new { Id = Guid.Parse("8bd60c1b-ac9d-8e7f-6a5b-4c3d2e1f0a9b"), Name = "LEGO Disney Walt Disney Hatırası Kamera", Price = 3699.00m }
        };

        var random = new Random(42); // Fixed seed for consistent results
        var orderCounter = 1;

        foreach (var customer in customers)
        {
            // Each customer gets 1-3 orders
            var orderCount = random.Next(1, 4);

            for (int i = 0; i < orderCount; i++)
            {
                var orderId = OrderId.Of(Guid.NewGuid());
                var customerId = CustomerId.Of(customer.CustomerId);
                var orderName = OrderName.Of($"ORD-{orderCounter:D6}");

                // Random shipping address
                var addresses = new[]
                {
                    Address.Of($"{customer.UserName}", "User", $"{customer.UserName}@shopping.com", "Main Street 123", "Turkey", "Istanbul", "34000"),
                    Address.Of($"{customer.UserName}", "User", $"{customer.UserName}@shopping.com", "Oak Avenue 456", "Turkey", "Ankara", "06000"),
                    Address.Of($"{customer.UserName}", "User", $"{customer.UserName}@shopping.com", "Pine Road 789", "Turkey", "Izmir", "35000"),
                    Address.Of($"{customer.UserName}", "User", $"{customer.UserName}@shopping.com", "Elm Street 321", "Turkey", "Bursa", "16000")
                };
                var shippingAddress = addresses[random.Next(addresses.Length)];

                // Random payment info
                var payments = new[]
                {
                    Payment.Of($"{customer.UserName}", "1234-5678-9012-3456", "12/25", "123", 1),
                    Payment.Of($"{customer.UserName}", "5678-9012-3456-7890", "11/26", "456", 1),
                    Payment.Of($"{customer.UserName}", "9012-3456-7890-1234", "10/27", "789", 1)
                };
                var payment = payments[random.Next(payments.Length)];

                var order = Order.Create(
                    orderId,
                    customerId,
                    orderName,
                    shippingAddress,
                    shippingAddress, // Same as billing address
                    payment
                );

                // Add 1-4 items to each order
                var itemCount = random.Next(1, 5);
                var selectedProducts = sampleProducts.OrderBy(x => random.Next()).Take(itemCount);

                foreach (var product in selectedProducts)
                {
                    var quantity = random.Next(1, 4);
                    var productId = ProductId.Of(product.Id);

                    order.Add(productId, quantity, product.Price);
                }

                // Set random order status
                var statuses = new[] { OrderStatus.Pending, OrderStatus.Completed, OrderStatus.Cancelled };
                var randomStatus = statuses[random.Next(statuses.Length)];

                // Use reflection to set the status (since it might be private set)
                var statusProperty = typeof(Order).GetProperty(nameof(Order.Status));
                statusProperty?.SetValue(order, randomStatus);

                // Set creation date in the past (last 30 days)
                var createdDaysAgo = random.Next(0, 30);
                var createdAt = DateTime.UtcNow.AddDays(-createdDaysAgo);

                // Use reflection to set created date
                var createdAtProperty = typeof(Order).GetProperty("CreatedAt") ?? typeof(Order).GetProperty("Created");
                if (createdAtProperty != null && createdAtProperty.CanWrite)
                {
                    createdAtProperty.SetValue(order, createdAt);
                }

                orders.Add(order);
                orderCounter++;
            }
        }

        context.Orders.AddRange(orders);
        await context.SaveChangesAsync();

        logger.LogInformation("✅ Created {OrderCount} sample orders for {CustomerCount} customers",
            orders.Count, customers.Length);
    }
}
