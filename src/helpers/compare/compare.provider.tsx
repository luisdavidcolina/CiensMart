import React, { useState, useEffect } from "react";
import { CompareContext } from "./compare.context";
import { product } from "../interfaces/product";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const getLocalCompareItems = () => {
  try {
    const list = localStorage.getItem("compare");
    if (list === null) {
      return [];
    } else {
      return JSON.parse(list);
    }
  } catch (err) {
    return [];
  }
};

export const CompareProvider = (props:any) => {
  const [compareItems, setcompareItems] = useState(getLocalCompareItems() as product[]);
  const router = useRouter();
  useEffect(() => {
    localStorage.setItem("compare", JSON.stringify(compareItems));
  }, [compareItems]);

  // Add Product To Wishlist
  const addToCompare = (item: product) => {
    const index = compareItems.findIndex((compare) => compare.id === item.id);
    if (index === -1) {
      toast.success("Producto agregado para comparar");
      setcompareItems([...compareItems, item]);
      router.push("/pages/compare/compare-1");
    } else {
      toast.error("Este producto ya esta en comparacion");
    }
  };

  // Remove Product From compare
  const removeFromComapre = (item: { id: number; }) => {
    setcompareItems(compareItems.filter((e) => e.id !== item.id));
    toast.error("Producto eliminado de comparacion");
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems: compareItems,
        addToCompare: addToCompare,
        removeFromComapre: removeFromComapre,
      }}>
      {props.children}
    </CompareContext.Provider>
  );
};
