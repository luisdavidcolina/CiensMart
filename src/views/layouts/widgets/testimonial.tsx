import { NextPage } from "next";
import Slider from "react-slick";
import { Col, Container, Media, Row } from "reactstrap";

var settings = {
  autoplay: false,
  autoplaySpeed: 2500,
};

const Review = [
  {
    img: "/images/testimonial/1.jpg",
    user: "Carlos Rodríguez",
    review: "Excelente servicio. Compré una nevera para mi hogar y el proceso de entrega fue impecable. La atención al cliente resolvió todas mis dudas de inmediato. ¡Totalmente recomendados!",
  },
  {
    img: "/images/testimonial/2.jpg",
    user: "Elena Martínez",
    review: "Me encanta la variedad de productos que tienen. Conseguí todo lo que necesitaba para remodelar mi cocina en un solo lugar y a precios muy competitivos. Una experiencia de compra 10/10.",
  },
  {
    img: "/images/testimonial/3.jpg",
    user: "Ricardo Gómez",
    review: "La plataforma es muy intuitiva y rápida. Como usuario frecuente de tiendas online, valoro mucho la facilidad para encontrar ofertas y la seguridad en los métodos de pago. Sin duda volveré a comprar.",
  },
];

const Testimonial: NextPage = () => {
  return (
    <>
      <Container>
        <Row>
          <Col md="12">
            <div className="slide-1 no-arrow">
              <Slider {...settings}>
                {Review.map((data, i) => (
                  <div key={i}>
                    <div className="testimonial-contain">
                      <div className="media">
                        <div className="testimonial-img">
                          <Media src={data.img} className="img-fluid rounded-circle" alt="testimonial" />
                        </div>
                        <div className="media-body">
                          <h5>{data.user}</h5>
                          <p>{data.review}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Testimonial;
