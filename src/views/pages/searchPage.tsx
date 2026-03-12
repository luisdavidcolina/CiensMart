/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Row, Col } from "reactstrap";
import Breadcrumb from "../../views/Containers/Breadcrumb";
import { useLocalQuery, gql } from "@/hooks/useLocalQuery";
import { getImagePath } from "@/utils/imagePath";

const GET_PRODUCTS = gql`
  query getProducts($limit: Int) {
    products(limit: $limit) {
      total
      items {
        id
        title
        type
        category
        brand
        price
        discount
        images {
          src
        }
      }
    }
  }
`;

const SearchPage: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const categoryParam = (searchParams.get("category") || "all").toUpperCase();

  const [searchTerm, setSearchTerm] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

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

  const { data, loading } = useLocalQuery(GET_PRODUCTS, {
    variables: { limit: 500 },
  });

  const allItems = data?.products?.items || [];

  const filteredItems = useMemo(() => {
    const text = (qParam || "").trim().toLowerCase();
    const activeCategory = (categoryParam || "all").toUpperCase();

    return allItems.filter((item: any) => {
      const normalizedTitle = String(item.title || "").toLowerCase();
      const normalizedType = String(item.type || "").toLowerCase();
      const normalizedCategory = String(item.category || "").toLowerCase();
      const normalizedBrand = String(item.brand || "").toLowerCase();

      const matchesText =
        !text ||
        normalizedTitle.includes(text) ||
        normalizedType.includes(text) ||
        normalizedCategory.includes(text) ||
        normalizedBrand.includes(text);

      const typeUpper = String(item.type || "").toUpperCase();
      const categoryUpper = String(item.category || "").toUpperCase();
      const matchesCategory =
        activeCategory === "ALL" ||
        activeCategory === "all" ||
        typeUpper === activeCategory ||
        categoryUpper === activeCategory;

      return matchesText && matchesCategory;
    });
  }, [allItems, qParam, categoryParam]);

  const triggerSearch = (event?: React.FormEvent) => {
    if (event) event.preventDefault();

    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    }
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    const query = params.toString();
    router.push(`/pages/search${query ? `?${query}` : ""}`);
  };

  return (
    <>
      <Breadcrumb title="busqueda" parent="inicio" />

      <section className="authentication-page section-big-pt-space bg-light">
        <div className="custom-containe">
          <section className="search-block">
            <Container>
              <Row>
                <Col lg="8" className="offset-lg-2">
                  <form className="form-header" onSubmit={triggerSearch}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar productos o categorias"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                      />
                      <select className="form-control" style={{ maxWidth: "220px" }} value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="input-group-append">
                        <button className="btn btn-normal" type="submit">
                          <i className="fa fa-search"></i> Buscar
                        </button>
                      </div>
                    </div>
                  </form>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </section>

      <section className="section-big-py-space ratio_asos bg-light">
        <div className="custom-container">
          <div className="mb-3 text-muted">
            {loading ? "Buscando productos..." : `Resultados: ${filteredItems.length}`}
          </div>

          <div className="row search-product related-pro1">
            {!loading && filteredItems.length === 0 && (
              <Col sm="12">
                <div className="text-center p-4 bg-white border rounded">
                  <h4>No se encontraron productos</h4>
                  <p className="mb-0">Prueba con otro texto o cambia la categoria.</p>
                </div>
              </Col>
            )}

            {filteredItems.map((item: any) => {
              const productSlug = String(item.title || "producto").replace(/\s+/g, "");
              const imageSrc = item.images?.[0]?.src ? getImagePath(item.images[0].src) : "/images/placeholder.png";
              const basePrice = Number(item.price) || 0;
              const rawDiscount = Number(item.discount);
              const safeDiscount = Number.isFinite(rawDiscount) && rawDiscount > 0 && rawDiscount < 100 ? rawDiscount : 0;
              const finalPrice = basePrice * (1 - safeDiscount / 100);

              return (
                <Col xl="3" md="4" sm="6" key={item.id}>
                  <div className="product">
                    <div className="product-box">
                      <div className="product-imgbox">
                        <div className="product-front">
                          <Link href={`/product-details/${item.id}-${productSlug}`}>
                            <img src={imageSrc} className="img-fluid" alt={item.title} />
                          </Link>
                        </div>
                      </div>
                      <div className="product-detail detail-center">
                        <div className="detail-title">
                          <div className="detail-left">
                            <Link href={`/product-details/${item.id}-${productSlug}`}>
                              <h6 className="price-title">{item.title}</h6>
                            </Link>
                            <small className="text-muted d-block">{item.type || item.category}</small>
                          </div>
                          <div className="detail-right">
                            {safeDiscount > 0 && <div className="check-price">${basePrice.toFixed(2)}</div>}
                            <div className="price">${(safeDiscount > 0 ? finalPrice : basePrice).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchPage;
