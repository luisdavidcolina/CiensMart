import React, { useState } from "react";
import { Col, Row, Media } from "reactstrap";
import Slider from "react-slick";
import AccordianForm from "./accordian.form";
import AccordianDescription from "./accordian.product-right";

interface ThumbnailLeftSlickProps {
  item: any;
}

const ThumbnailLeftSlick: React.FC<ThumbnailLeftSlickProps> = ({ item }) => {
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
      <Col lg="1" sm="2" xs="12">
        <Row>
          <Col>
            <Slider className="slider-right-nav" {...setting1} asNavFor={nav2!} ref={(slider1) => setNav1(slider1)} slidesToShow={3} swipeToSlide={true} focusOnSelect={true} vertical={true}>
              {item &&
                item?.images?.map((img: any, i: any) => {
                  return (
                    <div key={i}>
                      <Media src={`/images/${img.src}`} alt="" className="img-fluid image_zoom_cls-0" />
                    </div>
                  );
                })}
            </Slider>
          </Col>
        </Row>
      </Col>
      <Col lg="3" sm="10" xs="12" className="order-up">
        <Slider className="product-slick" asNavFor={nav1!} ref={(slider1) => setNav2(slider1)}>
          {item &&
            item?.images?.map((img: any, i: any) => {
              return (
                <div key={i}>
                  <Media src={`/images/${img.src}`} alt="/images/pro3/3.jpg" className="img-fluid  image_zoom_cls-0" />
                </div>
              );
            })}
        </Slider>
      </Col>
      <Col lg="4">
        <AccordianDescription item={item} />
      </Col>
      <Col lg="4">
        <AccordianForm item={item} changeColorVar={changeColorVar} />
      </Col>
    </>
  );
};

export default ThumbnailLeftSlick;
