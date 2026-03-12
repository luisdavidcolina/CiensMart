import React, { useContext } from "react";
import { NextPage } from "next";
import MenuBar from "../Header/widgets/menu-bar";
import { MenuContext } from "@/helpers/menu/MenuContext";

const HorizaontalMenu: NextPage = () => {
  const menuContext = useContext(MenuContext);
  const { menuResponsive, setMenuResponsive } = menuContext;
  return (
    <>
      <div
        className={`menu-overlay ${menuResponsive ? "active" : ""}`}
        onClick={() => {
          setMenuResponsive(!menuResponsive);
          document.body.style.overflow = "visible";
        }}
      ></div>

    </>
  );
};

export default HorizaontalMenu;
