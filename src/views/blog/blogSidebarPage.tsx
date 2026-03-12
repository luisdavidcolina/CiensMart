import { NextPage } from "next";
import { Col, Container, Form, Input, Label, Media, Row } from "reactstrap";
import Breadcrumb from "../Containers/Breadcrumb";

const LeftSidebar: NextPage = () => {
  return (
    <div className="bg-light">
      <Breadcrumb title="detalle del blog" parent="inicio" />
      {/* <!-- section start --> */}
      <section className="blog-detail-page section-big-py-space ratio2_3">
        <Container>
          <Row className="section-big-pb-space">
            <Col sm="12" className="blog-detail">
              <div className="creative-card">
                <Media src="/images/layout-5/blog/5.jpg" className="img-fluid w-100 " alt="portada del blog" />
                <h3>Tendencias de comercio digital para aumentar ventas en 2026</h3>
                <ul className="post-social">
                  <li>11 marzo 2026</li>
                  <li>Publicado por: Equipo CiensMart</li>
                  <li>
                    <i className="fa fa-heart"></i> 128 vistas
                  </li>
                  <li>
                    <i className="fa fa-comments"></i> 14 comentarios
                  </li>
                </ul>
                <p>En los ultimos meses el ecommerce paso de competir por precio a competir por experiencia. Las tiendas con mejor rendimiento estan optimizando velocidad, claridad visual y mensajes simples de compra. Cuando el cliente entiende rapido que esta comprando y por que confiar en la tienda, la conversion mejora sin necesidad de descuentos agresivos.</p>
                <p>Otro cambio clave es la personalizacion por contexto: recomendaciones por categoria, banners segmentados y contenido editorial util en cada etapa del funnel. Un blog bien trabajado no solo aporta SEO, tambien reduce dudas y mejora la intencion de compra al mostrar casos reales, comparativas y guias practicas.</p>
                <p>Para sostener crecimiento, conviene medir tres indicadores cada semana: tasa de conversion por dispositivo, abandono en checkout y tiempo hasta primera compra. Con esos datos, los ajustes de interfaz y contenido dejan de ser intuicion y pasan a ser decisiones de negocio.</p>
              </div>
            </Col>
          </Row>
          <Row className="section-big-pb-space blog-advance ">
            <Col lg="6">
              <div className="creative-card">
                <Media src="/images/layout-5/blog/1.jpg" className="img-fluid " alt="analitica de ventas" />
                <ul>
                  <li>Define una propuesta de valor clara en la cabecera.</li>
                  <li>Usa imagenes reales de producto y contexto de uso.</li>
                  <li>Elimina pasos innecesarios en carrito y pago.</li>
                  <li>Muestra costos finales antes del ultimo paso.</li>
                  <li>Integra pruebas sociales con opiniones verificadas.</li>
                  <li>Optimiza la vista movil como prioridad comercial.</li>
                  <li>Mide conversion por canal para invertir mejor.</li>
                  <li>Publica contenido util orientado a decisiones de compra.</li>
                  <li>Automatiza recuperacion de carritos abandonados.</li>
                  <li>Revisa stock y precios a diario para evitar friccion.</li>
                  <li>Actualiza banners segun temporada y categoria.</li>
                </ul>
              </div>
            </Col>
            <Col lg="6">
              <div className="creative-card">
                <Media src="/images/layout-5/blog/3.jpg" className="img-fluid  " alt="estrategia de crecimiento" />
                <p>Una estrategia efectiva combina contenido, performance y confianza. Cuando la pagina carga rapido, el mensaje es claro y el usuario percibe seguridad, la experiencia de compra se vuelve fluida y la marca se fortalece.</p>
                <p className="mt-2">El blog puede funcionar como apoyo comercial: responde preguntas frecuentes, educa sobre categorias y muestra comparativas que aceleran la decision del cliente. Esto reduce friccion y mejora conversion organica.</p>
                <p className="mt-2">El objetivo final no es solo atraer visitas, sino convertir trafico en pedidos recurrentes con una identidad consistente y una propuesta de valor facil de entender.</p>
              </div>
            </Col>
          </Row>
          <Row className="section-big-pb-space">
            <Col sm="12">
              <div className="creative-card">
                <ul className="comment-section">
                  <li>
                    <div className="media">
                      <Media src="/images/avtar/1.jpg" alt="avatar de cliente" />
                      <div className="media-body">
                        <h6>
                          Laura Mendez <span>( 11 marzo 2026 a las 10:30 AM )</span>
                        </h6>
                        <p>Excelente articulo, aplicamos dos cambios en la pagina de producto y subio la conversion movil en pocos dias.</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="media">
                      <Media src="/images/avtar/2.jpg" alt="avatar de cliente" />
                      <div className="media-body">
                        <h6>
                          Daniel Rivas <span>( 11 marzo 2026 a las 11:05 AM )</span>
                        </h6>
                        <p>Muy util la parte de indicadores. Nos ayudo a detectar que el abandono estaba en metodos de pago, no en el catalogo.</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="media">
                      <Media src="/images/avtar/3.jpg" alt="avatar de cliente" />
                      <div className="media-body">
                        <h6>
                          Sofia Torres <span>( 11 marzo 2026 a las 12:10 PM )</span>
                        </h6>
                        <p>Nos gusto que el contenido sea practico. Ya estamos preparando una guia parecida para nuestras categorias top.</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <Row className="blog-contact">
            <Col sm="12">
              <div className="creative-card">
                <h2>Deja tu comentario</h2>
                <Form className="theme-form">
                  <div className="form-row row">
                    <Col md="12">
                      <Label htmlFor="name">Nombre</Label>
                      <Input type="text" className="forInputm-control" id="name" placeholder="Ingresa tu nombre" required />
                    </Col>
                    <Col md="12">
                      <Label htmlFor="email">Correo electronico</Label>
                      <Input type="text" className="form-Inputcontrol" placeholder="tu@correo.com" required />
                    </Col>
                    <Col md="12">
                      <Label htmlFor="exampleFormControlTextarea1">Comentario</Label>
                      <textarea className="form-control" placeholder="Escribe tu comentario" id="exampleFormControlTextarea1"></textarea>
                    </Col>
                    <Col md="12">
                      <button className="btn btn-normal" type="submit">
                        Publicar comentario
                      </button>
                    </Col>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <!-- Section ends --> */}
    </div>
  );
};

export default LeftSidebar;
