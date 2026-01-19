/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import Slider from "react-slick";
import ProductDetail from "./product-detail";

interface RightImageProductSlickProps {
  item: any;
}

const RightImageProductSlick: React.FC<RightImageProductSlickProps> = ({ item }) => {
  const [nav1, setNav1] = useState<Slider | null>();
  const [nav2, setNav2] = useState<Slider | null>();
  var setting1 = {
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

  const changeColorVar = (img_id: any) => {
    nav1?.slickGoTo(img_id);
  };

  return (
    <>
      <Col lg="4" sm="10" xs="12" className="order-up">
        <Slider className="product-slick" asNavFor={nav2!} ref={(slider1) => setNav1(slider1)}>
          {item &&
            item.images.map((img: any, i: any) => {
              return (
                <div key={i}>
                  <img src={`/images/${img.src}`} alt="" className="img-fluid  image_zoom_cls-0" />
                </div>
              );
            })}
        </Slider>
      </Col>
      <Col lg="1" sm="2" xs="12">
        <Row>
          <Col>
            <Slider {...setting1} className="slider-right-nav" asNavFor={nav1!} ref={(slider1) => setNav2(slider1)} slidesToShow={3} swipeToSlide={true} focusOnSelect={true} vertical={true}>
              {item &&
                item.images.map((img: any, i: any) => {
                  return (
                    <div key={i}>
                      <img src={`/images/${img.src}`} alt="" className="img-fluid  image_zoom_cls-0" />
                    </div>
                  );
                })}
            </Slider>
          </Col>
        </Row>
      </Col>
      <Col lg="7" className="rtl-text">
        <ProductDetail item={item} bundle={false} swatch={false} changeColorVar={changeColorVar} />
      </Col>
    </>
  );
};

export default RightImageProductSlick;
