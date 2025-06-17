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
                        ProductName = "Squid Game 5 Taş Oyunu",
                        Price = 149.99m,
                        Quantity = 2,
                        Color = "Default"
                    },
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("c67d6323-e8b0-4bdd-a7e6-a593eb6068e8"),
                        ProductName = "Smile Games Günün Sorusu Kutu Oyunu",
                        Price = 274.99m,
                        Quantity = 1,
                        Color = "Default"
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
                        ProductId = Guid.Parse("4f136e07-cc90-4d8b-b847-68c0a3331d79"),
                        ProductName = "Smile Games Matematik Oyunu",
                        Price = 589.99m,
                        Quantity = 1,
                        Color = "Default"
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
                        ProductName = "UNO Reverse Pack Eklenti Paketi",
                        Price = 119.99m,
                        Quantity = 2,
                        Color = "Default"
                    },
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("b786103d-c621-4f5a-b498-23312a3fa792"),
                        ProductName = "UNO Stack Pack Eklenti Paketi",
                        Price = 119.99m,
                        Quantity = 1,
                        Color = "Default"
                    },
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("9c8d7e6f-5a4b-3c2d-1e0f-9a8b7c6d5e4f"),
                        ProductName = "Bontempi Işıklı Mikrofonlu Elektronik Tabureli Org",
                        Price = 2699.00m,
                        Quantity = 1,
                        Color = "Pink"
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
                        ProductId = Guid.Parse("f24d3e2f-1a0b-9c8d-7e6f-5a4b3c2d1e0f"),
                        ProductName = "Fisher Price Matematikçi Timsah",
                        Price = 1399.99m,
                        Quantity = 1,
                        Color = "Green"
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
                        ProductId = Guid.Parse("2570a6b5-4c3d-2e1f-0a9b-8c7d6e5f4a3b"),
                        ProductName = "Sesli Disney Stitch Real Fx Elektronik Kukla 30 cm",
                        Price = 4289.99m,
                        Quantity = 1,
                        Color = "Blue"
                    },
                    new ShoppingCartItem
                    {
                        ProductId = Guid.Parse("58a3d9e8-7f6a-5b4c-3d2e-1f0a9b8c7d6e"),
                        ProductName = "1:64 Hot Wheels The Hot Ones Fiat 500 Topolino (1936)",
                        Price = 249.99m,
                        Quantity = 2,
                        Color = "Red"
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
