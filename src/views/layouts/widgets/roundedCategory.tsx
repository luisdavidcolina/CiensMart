import { NextPage } from "next";
import Link from "next/link";
import Slider from "react-slick";
import { Col, Container, Media, Row } from "reactstrap";

var settings = {
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 6,
  slidesToScroll: 6,
  responsive: [
    {
      breakpoint: 1367,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: true,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
};

const CategoryList = [
  { img: "/images/layout-1/rounded-cat/7.png", category: "Moda", type: "fashion" },
  { img: "/images/layout-1/rounded-cat/6.png", category: "Electrónica", type: "electronics" },
  { img: "/images/layout-1/rounded-cat/2.png", category: "Muebles", type: "furniture" },
  { img: "/images/layout-1/rounded-cat/5.png", category: "Comestibles", type: "grocery" },
];
const Category: NextPage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className="slide-6 no-arrow">
            <Slider {...settings}>
              {CategoryList.map((data, i) => (
                <div key={i}>
                  <div className="category-contain">
                    <Link href={{ pathname: "/collections/leftsidebar/", query: { category: data.type.toUpperCase() } }}>
                      <div className="img-wrapper">
                        <Media src={data.img} alt="category" className="img-fluid" />
                      </div>
                      <div>
                        <div className="btn-rounded">{data.category}</div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Category;
