const db = require("./database");

const products = [
    {
        name: "Premium Wireless Headphones",
        description: "Comfortable wireless headphones with clear sound and long battery life.",
        price: 4999,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        stock: 25
    },
    {
        name: "Smart Watch Series X",
        description: "Modern smartwatch with fitness tracking, notifications and daily activity monitoring.",
        price: 6999,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        stock: 18
    },
    {
        name: "Classic Leather Backpack",
        description: "Durable everyday backpack suitable for work, study and travel.",
        price: 3499,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        stock: 30
    },
    {
        name: "Running Sports Shoes",
        description: "Lightweight running shoes designed for comfortable daily workouts.",
        price: 5499,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        stock: 20
    },
    {
        name: "Minimal Desk Lamp",
        description: "Clean modern desk lamp for study, office and workspace setups.",
        price: 1999,
        category: "Home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
        stock: 35
    },
    {
        name: "Mechanical Gaming Keyboard",
        description: "Responsive mechanical keyboard designed for gaming and productivity.",
        price: 4499,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
        stock: 15
    },
    {
        name: "Ceramic Coffee Mug",
        description: "Simple ceramic mug with a clean design for everyday coffee or tea.",
        price: 799,
        category: "Home",
        image: "/images/ceramic-coffee-mug.jpg",
        stock: 50
    },
    {
        name: "Stainless Steel Water Bottle",
        description: "Reusable insulated water bottle for work, travel and outdoor activities.",
        price: 1499,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
        stock: 40
    }
];

const insertProduct = db.prepare(`
  INSERT INTO products
  (name, description, price, category, image, stock)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((products) => {
    for (const product of products) {
        insertProduct.run(
            product.name,
            product.description,
            product.price,
            product.category,
            product.image,
            product.stock
        );
    }
});

const existingProducts = db
    .prepare("SELECT COUNT(*) AS count FROM products")
    .get();

if (existingProducts.count === 0) {
    insertMany(products);
    console.log(`${products.length} products added successfully`);
} else {
    console.log("Products already exist. No new products added.");
}

db.close();