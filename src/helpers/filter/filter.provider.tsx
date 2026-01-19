import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FilterContext } from "./filter.context";

export const FilterProvider = (props: any) => {
  const searchParams = useSearchParams();
  const brand: any = searchParams.get("brand");
  const color: any = searchParams.get("color");
  const pricemin: any = searchParams.get("pricemin");
  const pricemax: any = searchParams.get("pricemax");
  const category: any = searchParams.get("category");
  const param: [] = brand ? brand.split(",") : [];
  const [filterOpen, setFilterOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<String>(category || "FASHION");
  const [selectedBrands, setSelectedBrands] = useState<String[]>(param || []);
  const [selectedColor, setSelectedColor] = useState<String>(color || "");
  const [selectedPrice, setSelectedPrice] = useState({ min: parseInt(pricemin) || 0, max: parseInt(pricemax) || 500 });
  const [sidebarpopup, setSidebarpopup] = useState(false);
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
