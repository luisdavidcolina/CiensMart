import React, { useState } from "react";
import { Col, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";

const TabProduct: React.FC = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <section className="tab-product tab-exes creative-card creative-inner mb-0">
      <Row>
        <Col sm="12" lg="12">
          <Nav tabs className="nav-material" id="top-tab" role="tablist">
            <NavItem>
              <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => setActiveTab("1")}>
                Descripcion
                <div className="material-border"></div>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => setActiveTab("2")}>
                Video
                <div className="material-border"></div>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => setActiveTab("3")}>
                Escribir resena
                <div className="material-border"></div>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className="nav-material" activeTab={activeTab}>
            <TabPane tabId="1">
              <p className="ps-0">Este producto ofrece un equilibrio ideal entre diseno, funcionalidad y durabilidad. Fue pensado para un uso diario comodo, con acabados cuidados y materiales resistentes. Es una excelente opcion para quienes buscan calidad y buen precio en una sola compra.</p>
              <div className="single-product-tables">
                <table>
                  <tbody>
                    <tr>
                      <td>Tejido</td>
                      <td>Chiffon</td>
                    </tr>
                    <tr>
                      <td>Color</td>
                      <td>Rojo</td>
                    </tr>
                    <tr>
                      <td>Material</td>
                      <td>Crepe estampado</td>
                    </tr>
                  </tbody>
                </table>
                <table>
                  <tbody>
                    <tr>
                      <td>Largo</td>
                      <td>50 pulgadas</td>
                    </tr>
                    <tr>
                      <td>Talla</td>
                      <td>S, M, L .XXL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabPane>
            <TabPane tabId="2">
              <div id="videoWrapper" className="mt-3 text-center">
                <iframe id="videoFrame" width="560" height="315" src="https://www.youtube.com/embed/BUWzX78Ye_8" allow="autoplay; encrypted-media" allowFullScreen />
              </div>
            </TabPane>
            <TabPane tabId="3">
              <Form>
                <div className="form-row row">
                  <Col md="12">
                    <div className="media">
                      <Label className="mb-0">Rating</Label>
                      <div className="media-body ms-3">
                        <div className="rating three-star">
                          <i className="fa fa-star"></i> <i className="fa fa-star"></i> <i className="fa fa-star"></i> <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <Label htmlFor="name">Nombre</Label>
                    <Input type="text" className="form-control" id="name" placeholder="Ingresa tu nombre" required />
                  </Col>
                  <Col md="6">
                    <Label htmlFor="email">Email</Label>
                    <Input type="text" className="form-control" placeholder="Correo electronico" required />
                  </Col>
                  <Col md="12">
                    <Label htmlFor="review">Titulo de la resena</Label>
                    <Input type="text" className="form-control" placeholder="Escribe el titulo de tu resena" required />
                  </Col>
                  <Col md="12">
                    <Label htmlFor="review">Comentario</Label>
                    <textarea className="form-control" rows={4} placeholder="Escribe aqui tu experiencia" id="exampleFormControlTextarea1"></textarea>
                  </Col>
                  <Col md="12">
                    <button className="btn btn-normal" type="submit">
                      Enviar resena
                    </button>
                  </Col>
                </div>
              </Form>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </section>
  );
};

export default TabProduct;
