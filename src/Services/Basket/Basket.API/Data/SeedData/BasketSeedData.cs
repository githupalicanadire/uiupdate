using Microsoft.Extensions.Logging;

namespace Basket.API.Data.SeedData;

public static class BasketSeedData
{
    public static async Task SeedAsync(IBasketRepository repository, ILogger logger)
    {
        logger.LogInformation("🛒 Seeding basket data...");

        // Sample users with shopping carts
        var sampleBaskets = new[]
        {
            new
            {
                UserName = "alice",
                Items = new[]
                {
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("5334c996-8457-4cf0-815c-ed2b77c4ff61"),
                        ProductName = "🧸 Teddy Bear",
                        Price = 29.99m,
                        Quantity = 2,
                        Color = "Brown"
                    },
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("c67d6323-e8b1-4bdf-9a75-b0d0d2e7e914"),
                        ProductName = "🚗 Racing Car",
                        Price = 24.99m,
                        Quantity = 1,
                        Color = "Red"
                    }
                }
            },
            new
            {
                UserName = "bob",
                Items = new[]
                {
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("4f136e9f-ff8c-4c1f-9a33-d12f689bdab8"),
                        ProductName = "🎨 Art Set",
                        Price = 39.99m,
                        Quantity = 1,
                        Color = "Multi"
                    }
                }
            },
            new
            {
                UserName = "emily",
                Items = new[]
                {
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("6ec1297b-ec0a-4aa1-be25-6726e3b51a27"),
                        ProductName = "🧩 Puzzle Game",
                        Price = 19.99m,
                        Quantity = 3,
                        Color = "Default"
                    },
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("b786103d-c621-4f5a-b498-23452610f88c"),
                        ProductName = "🚀 Space Rocket",
                        Price = 34.99m,
                        Quantity = 1,
                        Color = "Silver"
                    },
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("5334c996-8457-4cf0-815c-ed2b77c4ff61"),
                        ProductName = "🧸 Teddy Bear",
                        Price = 29.99m,
                        Quantity = 1,
                        Color = "White"
                    }
                }
            },
            new
            {
                UserName = "sarah",
                Items = new[]
                {
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("f5c6e7d8-a9b0-1c2d-3e4f-567890abcdef"),
                        ProductName = "🎲 Board Game",
                        Price = 27.99m,
                        Quantity = 2,
                        Color = "Default"
                    }
                }
            },
            new
            {
                UserName = "david",
                Items = new[]
                {
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                        ProductName = "🏗️ Building Blocks",
                        Price = 44.99m,
                        Quantity = 1,
                        Color = "Multi"
                    },
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("1a2b3c4d-5e6f-7890-abcd-ef1234567891"),
                        ProductName = "🎪 Magic Set",
                        Price = 32.99m,
                        Quantity = 1,
                        Color = "Black"
                    }
                }
            }
        };

        foreach (var basketData in sampleBaskets)
        {
            // Check if basket already exists
            try
            {
                var existingBasket = await repository.GetBasket(basketData.UserName);
                if (existingBasket != null && existingBasket.Items.Any())
                {
                    logger.LogInformation("🛒 Basket for {UserName} already exists, skipping...", basketData.UserName);
                    continue;
                }
            }
            catch
            {
                // Basket doesn't exist, which is fine
            }

            // Create new basket
            var basket = new ShoppingCart(basketData.UserName);
            basket.Items.AddRange(basketData.Items);

            await repository.StoreBasket(basket);
            logger.LogInformation("✅ Created basket for {UserName} with {ItemCount} items", 
                basketData.UserName, basketData.Items.Length);
        }

        logger.LogInformation("✅ Basket seeding completed");
    }
}
