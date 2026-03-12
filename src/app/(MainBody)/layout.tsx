"use client";
import dynamic from "next/dynamic";
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
