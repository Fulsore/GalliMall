import csv
import random
import os

# 🔥 Expanded categories
categories = {
    "Dairy": ["Milk", "Cheese", "Butter", "Yogurt", "Paneer"],
    "Bakery": ["Bread", "Cake", "Biscuit", "Donut", "Muffin"],
    "Fruits": ["Apple", "Banana", "Mango", "Orange", "Grapes"],
    "Vegetables": ["Tomato", "Potato", "Onion", "Carrot", "Spinach"],
    "Beverages": ["Tea", "Coffee", "Juice", "Soda", "Energy Drink"],
    "Snacks": ["Chips", "Namkeen", "Chocolate", "Cookies", "Popcorn"],

    # NEW CATEGORIES
    "Electronics": ["Mobile", "Laptop", "Headphones", "Charger", "Smart Watch"],
    "Home": ["Chair", "Table", "Bed Sheet", "Pillow", "Curtain"],
    "Daily Needs": ["Soap", "Shampoo", "Toothpaste", "Detergent", "Toilet Paper"],
    "Stationery": ["Pen", "Pencil", "Notebook", "Eraser", "Marker"],
    "Clothing": ["Shirt", "T-Shirt", "Jeans", "Jacket", "Shorts"]
}

shops = [
    "Fresh Mart", "Daily Needs Store", "Super Store",
    "Green Basket", "Quick Shop", "Mega Mart",
    "Urban Grocery", "Smart Shop"
]

output_file = os.path.join(os.path.dirname(__file__), "products.csv")

with open(output_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)

    writer.writerow([
        "name", "price", "description",
        "category", "subcategory",
        "shop", "image"
    ])

    for i in range(1000):
        category = random.choice(list(categories.keys()))
        subcategory = random.choice(categories[category])

        name = f"{subcategory} {random.randint(1, 999)}"
        price = random.randint(5, 5000)

        shop = random.choice(shops)

        writer.writerow([
            name,
            price,
            f"High quality {subcategory} from {category}",
            category,
            subcategory,
            shop,
            "products/default.jpg"
        ])

print("✅ CSV generated successfully at scripts/products.csv")