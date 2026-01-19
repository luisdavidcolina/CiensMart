import React, { useState } from "react";
import { Col, Row, Media } from "reactstrap";
import Slider from "react-slick";
import AccordianDescription from "../../views/Products-Detail/accordian.product-right";
import AccordianForm from "../../views/Products-Detail/accordian.form";
import ThubnailDescription from "./thubnail-description";

interface ProductSlickProps {
  item: any;
  accordian: boolean;
  thumbnail: boolean;
}

const AccordianSlick: React.FC<ProductSlickProps> = ({ item, accordian, thumbnail }) => {
  const [nav1, setNav1] = useState<Slider | null>();
  const [nav2, setNav2] = useState<Slider | null>();
  const changeColorVar = (img_id: any) => {
    nav1?.slickGoTo(img_id);
  };

  return (
    <>
      <Col lg="4">
        <Slider className="product-slick" asNavFor={nav2!} ref={(slider1) => setNav1(slider1)}>
          {item &&
            item.images.map((img: any, i: any) => {
              return (
                <div key={i}>
                  <Media src={`/images/${img.src}`} alt="" className="img-fluid  image_zoom_cls-0" />
                </div>
              );
            })}
        </Slider>
        <Row>
          <Col>
            <Slider className="slider-nav" asNavFor={nav1!} ref={(slider1) => setNav2(slider1)} slidesToShow={3} swipeToSlide={true} focusOnSelect={true}>
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
      <Col lg="4">
        {accordian ? <AccordianDescription item={item} /> : ""}
        {thumbnail ? <ThubnailDescription item={item} /> : ""}
      </Col>
      <Col lg="4">
        <AccordianForm item={item} changeColorVar={changeColorVar} />
      </Col>
    </>
  );
};

export default AccordianSlick;
