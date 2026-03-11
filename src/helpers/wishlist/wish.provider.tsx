import React, { useState, useEffect } from "react";
import { WishlistContext } from "./wish.context";
import { product } from "../interfaces/product";
import { toast } from "react-toastify";
import { useAuth } from "../auth/auth.context";
import { userStorageService } from "@/services/user-storage.service";

const getLocalWishlistItems = () => {
  if (typeof window === "undefined") return [];
  try {
    const list = localStorage.getItem("wishlist");
    return list ? JSON.parse(list) : [];
  } catch (err) {
    return [];
  }
};

export const WishlistProvider = (props: any) => {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(getLocalWishlistItems() as product[]);

  // Load cloud wishlist on login
  useEffect(() => {
    const loadCloudWishlist = async () => {
      if (currentUser) {
        const savedList = await userStorageService.getSavedWishlist(currentUser.uid);
        if (savedList && savedList.length > 0) {
          // Merge or replace logic (replacing here for simplicity)
          setWishlistItems(savedList);
        }
      }
    };
    loadCloudWishlist();
  }, [currentUser]);

  // Sync back to local and cloud
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    if (currentUser) {
      userStorageService.syncWishlist(currentUser.uid, wishlistItems);
    }
  }, [wishlistItems, currentUser]);

  // Add Product To Wishlist
  const addToWish = (item: product) => {
    const index = wishlistItems.findIndex((wish) => wish.id === item.id);
    if (index === -1) {
      toast.success("Product Added to Wishlist Successfully !");
      setWishlistItems([...wishlistItems, item]);
    } else {
      toast.error("This Product Already Added !");
    }
  };

  // Remove Product From Wishlist
  const removeFromWish = (item: { id: number; }) => {
    setWishlistItems(wishlistItems.filter((e) => e.id !== item.id));
    toast.error("Product Removed from Wishlist Successfully !");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWish,
        removeFromWish,
      }}>
      {props.children}
    </WishlistContext.Provider>
  );
};
