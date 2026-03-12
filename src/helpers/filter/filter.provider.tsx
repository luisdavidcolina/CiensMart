import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FilterContext } from "./filter.context";

const CATEGORY_MAP: { [key: string]: string } = {
  "MODA": "fashion",
  "FASHION": "fashion",
  "ELECTRÓNICA": "electronics",
  "ELECTRONICA": "electronics",
  "ELECTRONICS": "electronics",
  "MUEBLES": "furniture",
  "FURNITURE": "furniture",
  "COMESTIBLES": "grocery",
  "GROCERY": "grocery"
};

export const FilterProvider = (props: any) => {
  const searchParams = useSearchParams();
  const brand: any = searchParams.get("brand");
  const color: any = searchParams.get("color");
  const pricemin: any = searchParams.get("pricemin");
  const pricemax: any = searchParams.get("pricemax");
  const categoryParam: any = searchParams.get("category");

  const getNormalizedCategory = (cat: string | null) => {
    if (!cat) return "fashion";
    const upper = cat.toUpperCase();
    return CATEGORY_MAP[upper] || cat.toLowerCase();
  };

  const param: [] = brand ? brand.split(",") : [];
  const [filterOpen, setFilterOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<String>(getNormalizedCategory(categoryParam));
  const [selectedBrands, setSelectedBrands] = useState<String[]>(param || []);
  const [selectedColor, setSelectedColor] = useState<String>(color || "");
  const [selectedPrice, setSelectedPrice] = useState({ min: parseInt(pricemin) || 0, max: parseInt(pricemax) || 500 });
  const [sidebarpopup, setSidebarpopup] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(getNormalizedCategory(categoryParam));
    }
  }, [categoryParam]);
  const handleBrands = (brand: String) => {
    var index = selectedBrands.indexOf(brand);
    if (index > -1) {
      setSelectedBrands(selectedBrands.filter((e) => e !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <FilterContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        handleBrands,
        selectedBrands,
        setSelectedBrands,
        selectedColor,
        setSelectedColor,
        selectedPrice,
        setSelectedPrice,
        filterOpen,
        setFilterOpen,
        leftSidebarOpen,
        setLeftSidebarOpen,
        sidebarpopup,
        setSidebarpopup,
      }}
    >
      {props.children}
    </FilterContext.Provider>
  );
};
