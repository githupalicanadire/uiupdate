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

        // Sample products (these should match Catalog service products)
        var sampleProducts = new[]
        {
            new { Id = Guid.Parse("5334c996-8457-4cf0-815c-ed2b77c4ff61"), Name = "🧸 Teddy Bear", Price = 29.99m },
            new { Id = Guid.Parse("c67d6323-e8b1-4bdf-9a75-b0d0d2e7e914"), Name = "🚗 Racing Car", Price = 24.99m },
            new { Id = Guid.Parse("4f136e9f-ff8c-4c1f-9a33-d12f689bdab8"), Name = "🎨 Art Set", Price = 39.99m },
            new { Id = Guid.Parse("6ec1297b-ec0a-4aa1-be25-6726e3b51a27"), Name = "🧩 Puzzle Game", Price = 19.99m },
            new { Id = Guid.Parse("b786103d-c621-4f5a-b498-23452610f88c"), Name = "🚀 Space Rocket", Price = 34.99m },
            new { Id = Guid.Parse("f5c6e7d8-a9b0-1c2d-3e4f-567890abcdef"), Name = "🎲 Board Game", Price = 27.99m },
            new { Id = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"), Name = "🏗️ Building Blocks", Price = 44.99m },
            new { Id = Guid.Parse("1a2b3c4d-5e6f-7890-abcd-ef1234567891"), Name = "🎪 Magic Set", Price = 32.99m }
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
                    Address.Of($"{customer.UserName}", "Main Street", "123", "USA", "NY", "10001"),
                    Address.Of($"{customer.UserName}", "Oak Avenue", "456", "USA", "CA", "90210"),
                    Address.Of($"{customer.UserName}", "Pine Road", "789", "USA", "TX", "73301"),
                    Address.Of($"{customer.UserName}", "Elm Street", "321", "USA", "FL", "33101")
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
