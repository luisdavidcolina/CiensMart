import React, { useEffect } from "react";
import { Button, Col, Container, Form, FormGroup, Input, Row } from "reactstrap";
import { NextPage } from "next";
import { useRouter } from "next/navigation";

const MobileSearch: NextPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    document.getElementById("search-overlay")!.style.display = "none";
  });
  const closeSearch = () => {
    document.getElementById("search-overlay")!.style.display = "none";
  };

  const openSearch = () => {
    document.getElementById("search-overlay")!.style.display = "flex";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    const query = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
    closeSearch();
    router.push(`/pages/search${query}`);
  };

  return (
    <>
      <li className="onhover-div mobile-search">
        <i className="icon-search" onClick={openSearch}></i>
      </li>
      <div id="search-overlay" className="search-overlay">
        <div>
          <span className="close-mobile-search" onClick={closeSearch} title="Close Overlay">
            ×
          </span>
          <div className="overlay-content">
            <Container>
              <Row>
                <Col xl="12">
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Input
                        type="text"
                        className="form-control"
                        id="mobileSearchInput"
                        placeholder="Search a Product"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                      />
                    </FormGroup>
                    <Button type="submit" className="btn btn-primary">
                      <i className="fa fa-search"></i>
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSearch;
