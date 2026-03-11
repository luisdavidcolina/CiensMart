import { db } from "../config/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { purgeProducts } from "./db-utils";

const categories = [
    {
        name: "Fashion",
        types: ["Men", "Women", "Kids", "Shoes"],
        brands: ["CiensMart", "Zara", "Nike", "Adidas", "H&M", "Gucci", "Levis"],
        items: ["T-Shirt", "Jeans", "Jacket", "Dress", "Sneakers", "Handbag", "Shirt", "Shorts"],
        imageKeyword: "fashion,clothing",
        priceRange: [15, 200]
    },
    {
        name: "Electronics",
        types: ["Laptops", "Phones", "Smartwatches", "Headphones", "Cameras"],
        brands: ["Apple", "Samsung", "Sony", "Dell", "HP", "Logitech", "Xiaomi"],
        items: ["A1 Pro", "Galaxy Elite", "Ultra HD Camera", "Wireless Headphones", "Precision Mouse", "Nexus Tablet"],
        imageKeyword: "technology,gadget",
        priceRange: [50, 1500]
    },
    {
        name: "Furniture",
        types: ["Home", "Office", "Living Room", "Bedroom"],
        brands: ["IKEA", "Ashley", "Eames", "Durable", "Classic Decor"],
        items: ["Chair", "Table", "Sofa", "Desk", "Lamp", "Shelf", "Bed", "Cabinet"],
        imageKeyword: "furniture,interior",
        priceRange: [30, 800]
    },
    {
        name: "Grocery",
        types: ["Fruits", "Vegetables", "Drinks", "Snacks"],
        brands: ["FreshPick", "BioNature", "Pepsico", "Nestle", "OrganicFarm"],
        items: ["Apple Pack", "Green Salad", "Mineral Water", "Dark Chocolate", "Energy Drink", "Wheat Bread"],
        imageKeyword: "grocery,food",
        priceRange: [1, 20]
    }
];



export const seedDatabase = async () => {
    console.log("🚀 Starting Massive Seeding Process with External AI/Stock Images...");

    // Step 1: Purge existing products to ensure a clean state
    await purgeProducts();

    const productsCol = collection(db, "products");
    let globalIdCount = 200; // Reset id counter
    let totalAdded = 0;

    for (const cat of categories) {
        console.log(`Processing category: ${cat.name}...`);

        // Generate 25 products per category
        for (let i = 0; i < 25; i++) {
            const brand = cat.brands[Math.floor(Math.random() * cat.brands.length)];
            const item = cat.items[Math.floor(Math.random() * cat.items.length)];
            const type = cat.types[Math.floor(Math.random() * cat.types.length)];
            const price = Math.floor(Math.random() * (cat.priceRange[1] - cat.priceRange[0])) + cat.priceRange[0];

            // Using LoremFlickr for high-quality, diverse stock images
            // We use a combination of keyword + a random "lock" number to get unique images
            const randomSeed = Math.floor(Math.random() * 1000);
            const imgSrc = `https://loremflickr.com/640/480/${cat.imageKeyword}?lock=${globalIdCount + i}`;

            const product = {
                id: globalIdCount++,
                title: `${brand} ${item}`,
                description: `Experience quality with the new ${brand} ${item}. Designed for excellence in our ${cat.name} collection. High-end materials and modern design.`,
                type: cat.name.toLowerCase(),
                brand: brand,
                category: type,
                price: price,
                new: Math.random() > 0.5,
                sale: Math.random() > 0.7,
                featured: Math.random() > 0.6,
                bestSeller: Math.random() > 0.8,
                discount: Math.random() > 0.7 ? 15 : 0,
                stock: Math.floor(Math.random() * 100) + 10,
                source: "ciensmart",
                variants: [],
                images: [
                    {
                        image_id: globalIdCount * 10,
                        id: globalIdCount,
                        alt: `${brand} ${item}`,
                        src: imgSrc
                    }
                ]
            };

            try {
                // Simplified: Just add them, but with a unique Check title logic if requested
                await addDoc(productsCol, product);
                totalAdded++;
                if (totalAdded % 10 === 0) console.log(`Progress: ${totalAdded} products added...`);
            } catch (e) {
                console.error(`Error adding product: `, e);
            }
        }
    }

    console.log(`✅ Finished! Added ${totalAdded} products with Cloud Images to Firestore.`);
};
