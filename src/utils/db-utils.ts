import { db } from "../config/firebase";
import { collection, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";

/**
 * Purges the entire products collection. 
 * USE WITH CAUTION: This will delete all products from Firestore.
 */
export const purgeProducts = async () => {
    console.log("⚠️ CAUTION: Puraging all products from Firestore...");
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);

    if (snapshot.empty) {
        console.log("ℹ️ No products found to delete.");
        return;
    }

    console.log(`Deleting ${snapshot.size} products...`);

    // We use batches for efficiency (Firestore limit is 500 per batch)
    let count = 0;
    while (count < snapshot.size) {
        const batch = writeBatch(db);
        const chunk = snapshot.docs.slice(count, count + 500);

        chunk.forEach((d) => {
            batch.delete(d.ref);
        });

        await batch.commit();
        count += chunk.length;
        console.log(`Progress: ${count}/${snapshot.size} deleted...`);
    }

    console.log("✅ All products purged successfully!");
};
