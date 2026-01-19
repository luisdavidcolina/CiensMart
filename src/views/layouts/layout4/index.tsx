import Loader from "@/common/Loader";
import { NextPage } from "next";
import { ReactNode } from "react";
import { CartProvider } from "@/helpers/cart/cart.provider";
import { FilterProvider } from "@/helpers/filter/filter.provider";
import Footer from "../../Containers/Footer";
import HeaderContainer from "../../Containers/Header/header1";

interface Props {
  children: ReactNode;
}
const Layout4Section: NextPage<Props> = ({ children }) => (
  <Loader>
    <div className="bg-light">
      <CartProvider>
        <HeaderContainer cartPopupPosition="top" display="d-none" category={true} layoutLogo="layout-4" />
        <FilterProvider>{children}</FilterProvider>
        <Footer layoutLogo="layout-4" />
      </CartProvider>
    </div>
  </Loader>
);

export default Layout4Section;
