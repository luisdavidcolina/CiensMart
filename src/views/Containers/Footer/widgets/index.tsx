import React from "react";
import { Row, Col, Container, Media, Input } from "reactstrap";

type FooterSectionProps = {
  layoutLogo: string;
};

const FooterSection: React.FC<FooterSectionProps> = ({ layoutLogo }) => {
  return (
    <footer className="footer-2">
      <Container>
        <Row className="row">
          <Col xs="12">
            <div className="footer-main-contian">
              <Row>
                <Col lg="4" md="12">
                  <div className="footer-left">
                    <div className="footer-logo">
                      <Media src={`/images/${layoutLogo}/logo/logo.png`} className="img-fluid  " alt="logo" />
                    </div>
                    <div className="footer-detail">
                      <p>
                        CiensMart es tu tienda departamental de confianza, dedicada a ofrecer una amplia variedad de productos en tecnología, hogar y mucho más. Innovamos para brindarte calidad y excelencia desde la Escuela de Computación de la Facultad de Ciencias - UCV.
                      </p>
                      <ul className="paymant-bottom">
                        <li>
                          <a href="#">
                            <Media src="/images/layout-1/pay/1.png" className="img-fluid" alt="pago" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <Media src="/images/layout-1/pay/2.png" className="img-fluid" alt="pago" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <Media src="/images/layout-1/pay/3.png" className="img-fluid" alt="pago" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <Media src="/images/layout-1/pay/4.png" className="img-fluid" alt="pago" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <Media src="/images/layout-1/pay/5.png" className="img-fluid" alt="pago" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col lg="8" md="12">
                  <div className="footer-right">
                    <Row className="row">
                      <Col md="12">
                        <div className="subscribe-section">
                          <div className="row">
                            <div className="col-md-5 ">
                              <div className="subscribe-block">
                                <div className="subscrib-contant ">
                                  {/* Texto traducido: subscribe to newsletter */}
                                  <h4>suscríbete a nuestro boletín</h4>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-7 ">
                              <div className="subscribe-block">
                                <div className="subscrib-contant">
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">
                                        <i className="fa fa-envelope-o"></i>
                                      </span>
                                    </div>
                                    {/* Placeholder traducido: your email */}
                                    <Input type="text" className="form-control" placeholder="tu correo electrónico" />
                                    <div className="input-group-prepend">
                                      <span className="input-group-text telly">
                                        <i className="fa fa-telegram"></i>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md="12">
                        <div className="account-right">
                          <div className="row">
                            {/* Columna: Mi Cuenta */}
                            <div className="col-md-4">
                              <div className="footer-box">
                                <div className="footer-title">
                                  <h5>mi cuenta</h5>
                                </div>
                                <div className="footer-contant">
                                  <ul>
                                    <li>
                                      <a href="#">quiénes somos</a>
                                    </li>
                                    <li>
                                      <a href="#">contáctanos</a>
                                    </li>
                                    <li>
                                      <a href="#">términos y condiciones</a>
                                    </li>
                                    <li>
                                      <a href="#">cambios y devoluciones</a>
                                    </li>
                                    <li>
                                      <a href="#">envío y entrega</a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Columna: Enlaces Rápidos */}
                            <div className="col-md-3">
                              <div className="footer-box">
                                <div className="footer-title">
                                  <h5>enlaces rápidos</h5>
                                </div>
                                <div className="footer-contant">
                                  <ul>
                                    <li>
                                      <a href="#">ubicación de la tienda</a>
                                    </li>
                                    <li>
                                      <a href="#">mi cuenta</a>
                                    </li>
                                    <li>
                                      <a href="#">rastreo de pedidos</a>
                                    </li>
                                    <li>
                                      <a href="#">guía de tallas</a>
                                    </li>
                                    <li>
                                      <a href="#">preguntas frecuentes (FAQ)</a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Columna: Información de Contacto */}
                            <div className="col-md-5">
                              <div className="footer-box footer-contact-box">
                                <div className="footer-title">
                                  <h5>contáctanos</h5>
                                </div>
                                <div className="footer-contant">
                                  <ul className="contact-list">
                                    <li>
                                      <i className="fa fa-map-marker"></i>
                                      <span>
                                        CiensMart Store - Facultad de Ciencias <br /> <span> UCV, Caracas - 1041</span>
                                      </span>
                                    </li>
                                    <li>
                                      <i className="fa fa-phone"></i>
                                      <span>Llámanos: 0212-555-0199</span>
                                    </li>
                                    <li>
                                      <i className="fa fa-envelope-o"></i>
                                      <span>Email: soporte@ciensmart.ucv.ve</span>
                                    </li>
                                    <li>
                                      <i className="fa fa-fax"></i>
                                      <span>Fax: 0212-555-0200</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="app-link-block  bg-transparent">
        <Container>
          <Row>
            <div className="app-link-bloc-contain app-link-bloc-contain-1">
              <div className="app-item-group">
                <div className="app-item">
                  <Media src="/images/layout-1/app/1.png" className="img-fluid" alt="app-banner" />
                </div>
                <div className="app-item">
                  <Media src="/images/layout-1/app/2.png" className="img-fluid" alt="app-banner" />
                </div>
              </div>
              <div className="app-item-group ">
                <div className="social-block">
                  <h6>síguenos</h6>
                  <ul className="social">
                    <li>
                      <a href="#">
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-google-plus"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-rss"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </div>
      <div className="sub-footer">
        <Container>
          <Row>
            <Col xs="12">
              <div className="sub-footer-contain">
                <p>
                  <span>2025 - 26 </span> © Todos los derechos reservados por CiensMart - Escuela de Computación UCV
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default FooterSection;
