import React, { useState } from "react";
import { NextPage } from "next";
import { Input, DropdownToggle, DropdownMenu, InputGroupText, DropdownItem, InputGroup, ButtonDropdown } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const Search: NextPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
  const { t } = useTranslation("common");
  const router = useRouter();

  const triggerSearch = () => {
    const trimmed = searchTerm.trim();
    const query = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
    router.push(`/pages/search${query}`);
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
            <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
              <DropdownToggle key={"search-menu-toggle"} caret>
                {t("All Category")}
              </DropdownToggle>
              <DropdownMenu key={"search-menu"}>
                <DropdownItem>All Category</DropdownItem>
                <DropdownItem>indurstrial</DropdownItem>
                <DropdownItem>sports</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </InputGroup>
        </form>
      </div>
    </div>
  );
};

export default Search;
