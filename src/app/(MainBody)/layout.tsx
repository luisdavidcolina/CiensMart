"use client";
import { CartProvider } from "@/helpers/cart/cart.provider";
import { CompareProvider } from "@/helpers/compare/compare.provider";
import { CurrencyContextProvider } from "@/helpers/currency/CurrencyContext";
import { FilterProvider } from "@/helpers/filter/filter.provider";
import { MenuContextProvider } from "@/helpers/menu/MenuContext";
import { WishlistProvider } from "@/helpers/wishlist/wish.provider";
import { AuthProvider } from "@/helpers/auth/auth.context";
import TaptoTop from "@/views/Containers/TapTop";
import { ToastContainer } from "react-toastify";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://bigdeal-api-git-main-pixelstrapthemes.vercel.app/",
  cache: new InMemoryCache(),
});

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );
};

export default layout;
