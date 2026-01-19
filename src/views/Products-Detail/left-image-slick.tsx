import React, { useState } from "react";
import { Col, Row, Media } from "reactstrap";
import Slider from "react-slick";
import ProductDetail from "./product-detail";

interface LeftImageProductSlickProps {
  item: any;
}

const LeftImageProductSlick: React.FC<LeftImageProductSlickProps> = ({ item }) => {
  const [nav1, setNav1] = useState<Slider | null>();
  const [nav2, setNav2] = useState<Slider | null>();

  const changeColorVar = (img_id: any) => {
    nav1?.slickGoTo(img_id);
  };
  return (
    <>
      <Col lg="1" sm="2" xs="12">
        <Row>
          <Col>
            <Slider
              className="slider-right-nav"
              asNavFor={nav2!} ref={(slider1) => setNav1(slider1)}
              slidesToShow={3}
              swipeToSlide={true}
              focusOnSelect={true}
              vertical={true}
              responsive={[
                {
                  breakpoint: 576,
                  settings: {
                    vertical: false,
                  },
                },
              ]}
            >
              {item &&
                item.images.map((img: any, i: any) => {
                  return (
                    <div key={i}>
                      <Media src={`/images/${img.src}`} alt="" className="img-fluid  image_zoom_cls-0" />
                    </div>
                  );
                })}
            </Slider>
          </Col>
        </Row>
      </Col>
      <Col lg="4" sm="10" xs="12" className="order-up">
        <Slider className="product-slick" asNavFor={nav1!} ref={(slider2) => setNav2(slider2)}>
          {item &&
            item.images.map((img: any, i: any) => {
              return (
                <div key={i}>
                  <Media src={`/images/${img.src}`} alt="" className="img-fluid  image_zoom_cls-0" />
                </div>
              );
            })}
        </Slider>
      </Col>
      <Col lg="7" className="rtl-text">
        <ProductDetail item={item} bundle={false} swatch={false} changeColorVar={changeColorVar} />
      </Col>
    </>
  );
};

export default LeftImageProductSlick;
