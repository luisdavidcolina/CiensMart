import { Skeleton } from "@/common/skeleton";
import { CartContext } from "@/helpers/cart/cart.context";
import { CompareContext } from "@/helpers/compare/compare.context";
import { WishlistContext } from "@/helpers/wishlist/wish.context";
import { useLocalQuery, gql } from "../../../../hooks/useLocalQuery";
import { NextPage } from "next";
import React, { useState } from "react";
import Slider from "react-slick";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import ProductBox from "../Product-Box/productbox2";

var settings = {
  arrows: true,
  dots: false,
  infinite: false,
  speed: 300,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1700,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: true,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
};

const GET_PRODUCTS = gql`
  query getProducts($type: CategoryType, $limit: Int!) {
    products(type: $type, limit: $limit) {
      items {
        id
        title
        type
        collection {
          collectionName
        }
      }
    }
  }
`;

const GET_COLLECTION = gql`
  query getCollection($collection: String) {
    collection(collec: $collection) {
      id
      title
      description
      type
      brand
      category
      price
      new
      sale
      discount
      stock
      variants {
        id
        sku
        size
        color
        image_id
      }
      images {
        image_id
        id
        alt
        src
      }
    }
  }
`;

interface tabProduct2Props {
  type: Array<string>;
}

const collectionTranslations: { [key: string]: string } = {
  "NEW PRODUCTS": "NUEVOS PRODUCTOS",
  "FEATURED PRODUCTS": "PRODUCTOS DESTACADOS",
  "ON SALE": "EN OFERTA",
};

const TabProduct2: NextPage<tabProduct2Props> = ({ type }) => {
  const { addToWish } = React.useContext(WishlistContext);
  const { addToCart } = React.useContext(CartContext);
  const { addToCompare } = React.useContext(CompareContext);

  const [activeTab, setActiveTab] = useState("NEW PRODUCTS");
  const collection: any[] = [];

  const { loading, data } = useLocalQuery(GET_PRODUCTS, {
    variables: {
      type: Array.isArray(type) ? type[0] : type, // Fetch by use localized type safely
      source: "ciensmart", // Only fetch official products
      limit: 50, // Fetch more to allow for better client-side filtering
    },
  });

  const allProd = data?.products?.items || [];

  const prod = allProd.filter((item: any) => {
    if (activeTab === "NEW PRODUCTS") return item.new === true;
    if (activeTab === "FEATURED PRODUCTS") return item.featured === true;
    if (activeTab === "ON SALE") return item.sale === true;
    return true;
  });

  console.log(`📦 [TabProduct2] ActiveTab: ${activeTab}, TotalItems: ${allProd.length}, FilteredItems: ${prod.length}`);

  return (
    <>
      <div style={{ display: 'none' }} id="debug-check">VERSION: FIREBASE_TAB_2</div>
      <section className="section-pt-space">
        <div className="tab-product-main">
          <div className="tab-prodcut-contain">
            <Nav tabs>
              {["NEW PRODUCTS", "FEATURED PRODUCTS", "ON SALE"].map((c, i) => (
                <NavItem key={i}>
                  <NavLink className={activeTab === c ? "active" : ""} onClick={() => setActiveTab(c)}>
                    {collectionTranslations[c] || c}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </div>
        </div>
      </section>
      <section className="section-py-space pb-0 ratio_square">
        <div className="custom-container addtocart_count">
          <Row>
            <Col className="pe-0">
              <TabContent activeTab={activeTab}>
                <TabPane tabId={activeTab}>
                  <div className="product product-slide-6 product-m no-arrow">
                    <div>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        <Slider {...settings}>
                          {prod.map((itm: any, i: any) => {
                            return (
                              <div key={itm.id || i}>
                                <ProductBox newLabel={itm.new} {...itm} item={itm} addCart={() => addToCart(itm)} addWish={() => addToWish(itm)} addCompare={() => addToCompare(itm)} />
                              </div>
                            );
                          })}
                        </Slider>
                      )}
                    </div>
                  </div>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default TabProduct2;
