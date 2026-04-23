const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

const URI = process.env.MONGO_URI || "mongodb://localhost:27017/quickmart";

const products = [
  // DAIRY
  { name: "Farm Fresh Milk (1L)", price: 65, category: "Dairy", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80", stock: 100, tags: ["daily-use", "healthy", "morning"] },
  { name: "Amul Butter (100g)", price: 58, category: "Dairy", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80", stock: 100, tags: ["daily-use", "spread"] },
  { name: "Fresh Paneer (200g)", price: 85, category: "Dairy", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&q=80", stock: 100, tags: ["protein", "meals", "fresh"] },
  { name: "Greek Yogurt (150g)", price: 120, category: "Dairy", image: "https://images.unsplash.com/photo-1488477181946-b258679eaaf8?w=500&q=80", stock: 100, tags: ["healthy", "snack"] },
  { name: "Cheddar Cheese Block", price: 250, category: "Dairy", image: "https://images.unsplash.com/photo-1618164436241-4473940d908d?w=500&q=80", stock: 100, tags: ["meals", "snack"] },
  
  // BAKERY
  { name: "Whole Wheat Bread", price: 55, category: "Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80", stock: 100, tags: ["daily-use", "morning", "healthy"] },
  { name: "Chocolate Croissant", price: 110, category: "Bakery", image: "https://images.unsplash.com/photo-1549996647-190b679b33d7?w=500&q=80", stock: 100, tags: ["snack", "sweet"] },
  { name: "Baguette (French Loaf)", price: 90, category: "Bakery", image: "https://images.unsplash.com/photo-1597079910443-60c43fc4f729?w=500&q=80", stock: 100, tags: ["meals", "fresh"] },
  { name: "Blueberry Muffins (Pack of 2)", price: 150, category: "Bakery", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&q=80", stock: 100, tags: ["snack", "sweet", "morning"] },
  { name: "Garlic Breadsticks", price: 130, category: "Bakery", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80", stock: 100, tags: ["snack", "meals"] },
  
  // FRUITS
  { name: "Fuji Apples (1kg)", price: 250, category: "Fruits", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=500&q=80", stock: 100, tags: ["healthy", "fresh", "snack"] },
  { name: "Robusta Bananas (1 Dozen)", price: 60, category: "Fruits", image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=500&q=80", stock: 100, tags: ["daily-use", "healthy"] },
  { name: "Nagpur Oranges (1kg)", price: 150, category: "Fruits", image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=500&q=80", stock: 100, tags: ["healthy", "fresh", "vitaminc"] },
  { name: "Hass Avocados (Pack of 2)", price: 400, category: "Fruits", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&q=80", stock: 100, tags: ["healthy", "premium", "morning"] },
  { name: "Fresh Strawberries (Box)", price: 300, category: "Fruits", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80", stock: 100, tags: ["healthy", "sweet", "fresh"] },

  // VEGETABLES
  { name: "Fresh Tomatoes (1kg)", price: 40, category: "Vegetables", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80", stock: 100, tags: ["daily-use", "meals", "fresh"] },
  { name: "Red Onions (1kg)", price: 35, category: "Vegetables", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80", stock: 100, tags: ["daily-use", "meals"] },
  { name: "Baby Spinach (Bundle)", price: 50, category: "Vegetables", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80", stock: 100, tags: ["healthy", "greens", "meals"] },
  { name: "Bell Peppers Mix", price: 120, category: "Vegetables", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80", stock: 100, tags: ["meals", "fresh", "healthy"] },
  { name: "Organic Carrots (1kg)", price: 80, category: "Vegetables", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80", stock: 100, tags: ["healthy", "snack", "meals"] },

  // SNACKS
  { name: "Lays Classic Potato Chips", price: 20, category: "Snacks", image: "https://images.unsplash.com/photo-1566478989037-eade3f7e2bd4?w=500&q=80", stock: 100, tags: ["snack", "party"] },
  { name: "Doritos Nacho Cheese", price: 50, category: "Snacks", image: "https://images.unsplash.com/photo-1628148911529-652a6cd06da8?w=500&q=80", stock: 100, tags: ["snack", "party", "spicy"] },
  { name: "Oreo Original Cookies", price: 40, category: "Snacks", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80", stock: 100, tags: ["snack", "sweet"] },
  { name: "Roasted Almonds (250g)", price: 350, category: "Snacks", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&q=80", stock: 100, tags: ["healthy", "snack", "premium"] },
  { name: "Dark Chocolate Bar 70%", price: 280, category: "Snacks", image: "https://images.unsplash.com/photo-1548816654-be1267861bc9?w=500&q=80", stock: 100, tags: ["snack", "sweet", "premium"] },

  // BEVERAGES
  { name: "Coca-Cola Original (750ml)", price: 45, category: "Beverages", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80", stock: 100, tags: ["drinks", "party"] },
  { name: "Red Bull Energy Drink", price: 125, category: "Beverages", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&q=80", stock: 100, tags: ["drinks", "energy"] },
  { name: "100% Orange Juice (1L)", price: 110, category: "Beverages", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80", stock: 100, tags: ["healthy", "drinks", "morning"] },
  { name: "Cold Brew Coffee", price: 180, category: "Beverages", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80", stock: 100, tags: ["drinks", "morning", "energy"] },
  { name: "Sparkling Water", price: 80, category: "Beverages", image: "https://images.unsplash.com/photo-1563212871-3bc635fec4ee?w=500&q=80", stock: 100, tags: ["healthy", "drinks"] },

  // STAPLES
  { name: "Basmati Rice (5kg)", price: 850, category: "Staples", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80", stock: 100, tags: ["daily-use", "meals", "bulk"] },
  { name: "Whole Wheat Atta (5kg)", price: 290, category: "Staples", image: "https://images.unsplash.com/photo-1574316071802-0d684efa7aa5?w=500&q=80", stock: 100, tags: ["daily-use", "meals", "bulk"] },
  { name: "Toor Dal (1kg)", price: 160, category: "Staples", image: "https://images.unsplash.com/photo-1586256087799-aabc6d820468?w=500&q=80", stock: 100, tags: ["daily-use", "healthy", "meals"] },
  { name: "Extra Virgin Olive Oil (1L)", price: 950, category: "Staples", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80", stock: 100, tags: ["healthy", "premium", "daily-use"] },
  { name: "Tata Salt (1kg)", price: 25, category: "Staples", image: "https://images.unsplash.com/photo-1627916962291-72945d8b7754?w=500&q=80", stock: 100, tags: ["daily-use", "meals"] },

  // HOUSEHOLD
  { name: "Liquid Detergent", price: 350, category: "Household", image: "https://images.unsplash.com/photo-1584820927498-cafe4c12643a?w=500&q=80", stock: 100, tags: ["daily-use", "cleaning"] },
  { name: "Floor Cleaner", price: 180, category: "Household", image: "https://images.unsplash.com/photo-1584820928236-4076e0ea79d5?w=500&q=80", stock: 100, tags: ["cleaning", "daily-use"] },
  { name: "Kitchen Towels (2 Rolls)", price: 140, category: "Household", image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=500&q=80", stock: 100, tags: ["cleaning", "kitchen"] },
  { name: "AA Batteries (Pack 10)", price: 220, category: "Household", image: "https://images.unsplash.com/photo-1616853526131-41be3092ea20?w=500&q=80", stock: 100, tags: ["electronics", "essentials"] },
  { name: "Aluminum Foil (25m)", price: 155, category: "Household", image: "https://images.unsplash.com/photo-1603534958998-f58c7e0f2f35?w=500&q=80", stock: 100, tags: ["kitchen", "essentials"] },

  // PERSONAL CARE
  { name: "Beauty Bar Soap (Pack 3)", price: 160, category: "Personal Care", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&q=80", stock: 100, tags: ["hygiene", "daily-use"] },
  { name: "Toothpaste Total Care", price: 110, category: "Personal Care", image: "https://images.unsplash.com/photo-1559837265-f703551532af?w=500&q=80", stock: 100, tags: ["hygiene", "morning", "daily-use"] },
  { name: "Anti-Dandruff Shampoo", price: 280, category: "Personal Care", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80", stock: 100, tags: ["hygiene", "daily-use"] },
  { name: "Triple Blade Razor", price: 350, category: "Personal Care", image: "https://images.unsplash.com/photo-1512760867015-c1fa9fb62ff9?w=500&q=80", stock: 100, tags: ["hygiene", "grooming"] },
  { name: "Moisturizing Body Lotion", price: 290, category: "Personal Care", image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=500&q=80", stock: 100, tags: ["hygiene", "skincare"] }
];

mongoose.connect(URI)
  .then(async () => {
    console.log("Connected to MongoDB for Database Seeding...");
    await Product.deleteMany({});
    console.log("Cleared old product data.");
    await Product.insertMany(products);
    console.log("Successfully seeded 40 high-quality grocery products with matching images!");
    process.exit();
  })
  .catch(err => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
