import { CurrencyContext } from "@/helpers/currency/CurrencyContext";
import { getImagePath } from "@/utils/imagePath";
import { useLocalQuery, gql } from "../../../hooks/useLocalQuery";
import { NextPage } from "next";
import { useContext, useState } from "react";
import Slider from "react-slick";
import { Col, Media, Row } from "reactstrap";
import CountDownComponent from "../widgets/CountDownComponent";

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

var bestSellerSetting = {
  dots: false,
  infinite: false,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const HotDeal: NextPage = () => {

  const currencyContext = useContext(CurrencyContext);
  const { selectedCurr } = currencyContext;
  var { loading, data: dataR } = useLocalQuery(GET_COLLECTION, {
    variables: {
      type: "electronics", // Use a valid type from our seed
      source: "ciensmart",
      limit: 1
    },
  });

  var { data: sideProducts } = useLocalQuery(GET_COLLECTION, {
    variables: {
      type: "ALL",
      limit: 3
    },
  });

  const hotDealItem = dataR?.collection?.[0];
  const [nav1, setNav1] = useState<Slider | null>();
  const [nav2, setNav2] = useState<Slider | null>();

  var settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    fade: true,
    infinite: true,
    dots: false,
  };

  var setting1 = {
    arrows: false,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          vertical: false,
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <section className="hot-deal b-g-white section-pb-space space-abjust">
      <div className="custom-container">
        <Row className="hot-2">
          <Col lg="12">
            <div className="title3 b-g-white text-center">
              <h4>oferta destacada de hoy</h4>
            </div>
          </Col>
          <Col lg="9">
            <div className="slide-1 no-arrow">
              <div>
                <div className="hot-deal-contain deal-abjust">
                  <Row className="row hot-deal-subcontain">
                    <Col lg="4" md="4">
                      <div className="hotdeal-right-slick border-0">
                        <Slider asNavFor={nav2!} ref={(slider1) => setNav1(slider1)} {...settings}>
                          {hotDealItem &&
                            hotDealItem.images && hotDealItem.images.map((img: any, i: any) => {
                              return (
                                <div key={i}>
                                  <Media src={img.src.startsWith('http') ? img.src : getImagePath(img.src)} alt="oferta-dia" className="img-fluid" />
                                </div>
                              );
                            })}
                        </Slider>
                      </div>
                    </Col>
                    <Col lg="6" md="6">
                      <div className="hot-deal-center">
                        <div>
                          <div>
                            <h5>{hotDealItem?.title || "Lo mejor en tecnología y hogar"}</h5>
                          </div>
                          <div className="rating">
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                          </div>
                          <div>
                            <p>{hotDealItem?.description || "En CiensMart seleccionamos cuidadosamente cada artículo para garantizarte la máxima calidad."}</p>
                            {hotDealItem && !loading ? (
                              <div className="price">
                                <span>
                                  {selectedCurr.symbol}
                                  {(hotDealItem.price * selectedCurr.value).toFixed(2)}
                                </span>
                                {hotDealItem.discount > 0 && (
                                  <span>
                                    {" "}
                                    {selectedCurr.symbol}
                                    {(hotDealItem.price * (1 - hotDealItem.discount / 100) * selectedCurr.value).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <CountDownComponent />
                        </div>
                      </div>
                    </Col>
                    <Col md="2">
                      <div className="hotdeal-right-nav">
                        <Slider asNavFor={nav1!} ref={(slider1) => setNav2(slider1)} vertical={true} {...setting1} slidesToShow={2} swipeToSlide={true} focusOnSelect={true} verticalSwiping={true}>
                          {hotDealItem &&
                            hotDealItem.images && hotDealItem.images.map((img: any, i: any) => {
                              return (
                                <div key={i}>
                                  <Media src={img.src.startsWith('http') ? img.src : getImagePath(img.src)} alt="miniatura-oferta" className="img-fluid" />
                                </div>
                              );
                            })}
                        </Slider>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
          <Col lg="3">
            <Slider className="bg-light h-100" {...bestSellerSetting}>
              {sideProducts?.collection?.map((product: any, idx: number) => (
                <div key={idx}>
                  <div className="media-banner border-0">
                    <div className="media-banner-box">
                      <div className="media-heading">
                        <h5>{idx === 0 ? "nuevo ingreso" : idx === 1 ? "oferta especial" : "más vendido"}</h5>
                      </div>
                    </div>
                    <div className="media-banner-box">
                      <div className="media">
                        <Media
                          src={product.images?.[0]?.src.startsWith('http') ? product.images[0].src : getImagePath(product.images?.[0]?.src || "pro3/3.jpg")}
                          className="img-fluid"
                          alt="banner"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                        <div className="media-body">
                          <div className="media-contant">
                            <div>
                              <div className="rating">
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                              </div>
                              <p>{product.title}</p>
                              <h6>{selectedCurr.symbol}{(product.price * selectedCurr.value).toFixed(2)}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) || <div>Cargando ofertas...</div>}
            </Slider>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default HotDeal;
