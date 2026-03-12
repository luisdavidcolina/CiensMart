"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { CartProvider } from "@/helpers/cart/cart.provider";
import { CompareProvider } from "@/helpers/compare/compare.provider";
import { CurrencyContextProvider } from "@/helpers/currency/CurrencyContext";
import { FilterProvider } from "@/helpers/filter/filter.provider";
import { MenuContextProvider } from "@/helpers/menu/MenuContext";
import { WishlistProvider } from "@/helpers/wishlist/wish.provider";
import { AuthProvider } from "@/helpers/auth/auth.context";

const TaptoTop = dynamic(() => import("@/views/Containers/TapTop"), { ssr: false });
const ToastContainer = dynamic(() => import("react-toastify").then((mod) => mod.ToastContainer), { ssr: false });
const layout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const themeClasses = ["color-1", "color-2", "color-3", "color-4", "color-5", "color-6"];
    const savedColor = localStorage.getItem("color") || "color-5";

    themeClasses.forEach((themeClass) => {
      document.documentElement.classList.remove(themeClass);
    });

    document.documentElement.classList.add(savedColor);
    localStorage.setItem("color", savedColor);
  }, []);

  return (
    <AuthProvider>
      <div>
        <CurrencyContextProvider>
          <MenuContextProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  <FilterProvider>{children}</FilterProvider>
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </MenuContextProvider>
        </CurrencyContextProvider>
        <ToastContainer />
        <TaptoTop />
      </div>
    </AuthProvider>
  );
};

export default layout;
