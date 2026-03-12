import React, { useState } from "react";
import { NextPage } from "next";
import { Input, DropdownToggle, DropdownMenu, InputGroupText, DropdownItem, InputGroup, ButtonDropdown } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const Search: NextPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
  const { t } = useTranslation("common");
  const router = useRouter();

  const categoryOptions = [
    { value: "all", label: "Todas las categorias" },
    { value: "FASHION", label: "Moda" },
    { value: "ELECTRONICS", label: "Electronica" },
    { value: "BEAUTY", label: "Belleza" },
    { value: "BAGS", label: "Bolsos" },
    { value: "WATCH", label: "Relojes" },
    { value: "FURNITURE", label: "Muebles" },
    { value: "TOOLS", label: "Herramientas" },
    { value: "KIDS", label: "Ninos" },
  ];

  const selectedCategoryLabel = categoryOptions.find((option) => option.value === selectedCategory)?.label || "Todas las categorias";

  const triggerSearch = () => {
    const trimmed = searchTerm.trim();
    const params = new URLSearchParams();
    if (trimmed) {
      params.set("q", trimmed);
    }
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    const query = params.toString();
    router.push(`/pages/search${query ? `?${query}` : ""}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    triggerSearch();
  };

  return (
    <div className="input-block">
      <div className="input-box">
        <form className="big-deal-form" onSubmit={handleSubmit}>
          <InputGroup>
            <InputGroupText>
              <span className="search">
                <i
                  className="fa 
                       fa-search"
                  onClick={triggerSearch}></i>
              </span>
            </InputGroupText>
            <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar productos o categorias" />
            <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
              <DropdownToggle key={"search-menu-toggle"} caret>
                {selectedCategoryLabel}
              </DropdownToggle>
              <DropdownMenu key={"search-menu"}>
                {categoryOptions.map((option) => (
                  <DropdownItem key={option.value} onClick={() => setSelectedCategory(option.value)}>
                    {option.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </ButtonDropdown>
          </InputGroup>
        </form>
      </div>
    </div>
  );
};

export default Search;
