import React from "react";
import Slider from "react-slick";
import { Col, Container, Media, Row } from "reactstrap";

var settings = {
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const BlogSection: React.FC = () => (
  <section className="blog ">
    {/* */}
    <div className="title3">
      <h4>últimas noticias del blog</h4>
    </div>
    {/* */}
    <Container>
      <Row>
        <Col xs="12">
          <Slider className="blog-slide no-arrow" {...settings}>
            {/* Post 1: Tecnología General */}
            <div>
              <div className="blog-contain">
                <div className="blog-img">
                  <Media src="/images/layout-1/blog/1.jpg" alt="blog" className="img-fluid w-100" />
                </div>
                <div className="blog-details">
                  <h4>Tendencias Tecnológicas 2026</h4>
                  <p>Exploramos los avances en domótica y dispositivos inteligentes que están redefiniendo el hogar moderno este año.</p>
                  <span>
                    <a href="/blog/blog-details">leer más</a>
                  </span>
                </div>
                <div className="blog-label">
                  <p>20 enero 2026</p>
                </div>
              </div>
            </div>

            {/* Post 2: IA y Ciencia (Basado en tus proyectos de divulgación) */}
            <div>
              <div className="blog-contain">
                <div className="blog-img">
                  <Media src="/images/layout-1/blog/2.jpg" alt="blog" className="img-fluid w-100 " />
                </div>
                <div className="blog-details">
                  <h4>IA y Computación Científica</h4>
                  <p>Un análisis sobre cómo los modelos de IA están facilitando la investigación en la Facultad de Ciencias.</p>
                  <span>
                    <a href="/blog/blog-details">leer más</a>
                  </span>
                </div>
                <div className="blog-label">
                  <p>15 enero 2026</p>
                </div>
              </div>
            </div>

            {/* Post 3: Contexto UCV */}
            <div>
              <div className="blog-contain">
                <div className="blog-img">
                  <Media src="/images/layout-1/blog/3.jpg" alt="blog" className="img-fluid w-100 " />
                </div>
                <div className="blog-details">
                  <h4>Innovación en la Escuela de Computación</h4>
                  <p>Cómo los proyectos estudiantiles de la UCV están impulsando el desarrollo de e-commerce locales.</p>
                  <span>
                    <a href="/blog/blog-details">leer más</a>
                  </span>
                </div>
                <div className="blog-label">
                  <p>10 enero 2026</p>
                </div>
              </div>
            </div>

            {/* Post 4: Lógica y Aplicaciones */}
            <div>
              <div className="blog-contain">
                <div className="blog-img">
                  <Media src="/images/layout-1/blog/2.jpg" alt="blog" className="img-fluid w-100" />
                </div>
                <div className="blog-details">
                  <h4>Lógica aplicada al Desarrollo Web</h4>
                  <p>La importancia de las estructuras lógicas y discretas en la optimización de algoritmos de búsqueda.</p>
                  <span>
                    <a href="/blog/blog-details">leer más</a>
                  </span>
                </div>
                <div className="blog-label">
                  <p>05 enero 2026</p>
                </div>
              </div>
            </div>
          </Slider>
        </Col>
      </Row>
    </Container>
  </section>
);

export default BlogSection;
