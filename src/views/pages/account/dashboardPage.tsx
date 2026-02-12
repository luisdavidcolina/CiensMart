import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import { authService } from "@/services/auth.service";

const Dashboard: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  if (!user) {
    return (<div>Por favor inicia sesión para ver el panel</div>);
  }

  return (
    <>
      {/* <!-- breadcrumb start --> */}
      <Breadcrumb title="Panel de Control" parent="inicio" />
      {/* <!-- breadcrumb End --> */}

      {/* <!-- section start --> */}
      <section className="section-big-py-space bg-light">
        <Container>
          <Row>
            <Col lg="3">
              <div
                className="account-sidebar"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <a className="popup-btn">mi cuenta</a>
              </div>
              <div
                className={`dashboard-left`}
                style={{
                  left: isOpen ? "0px" : "",
                }}
              >
                <div className="collection-mobile-back">
                  <span
                    className="filter-back"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <i className="fa fa-angle-left" aria-hidden="true"></i> volver
                  </span>
                </div>
                <div className="block-content ">
                  <ul>
                    <li className="active">
                      <a href="#">Información de la Cuenta</a>
                    </li>
                    <li>
                      <a href="/pages/account/order-history">Mis Pedidos</a>
                    </li>
                    <li>
                      <a href="#" onClick={() => authService.logout()}>Cerrar Sesión</a>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col lg="9">
              <div className="dashboard-right">
                <div className="dashboard">
                  <div className="page-title">
                    <h2>Mi Panel</h2>
                  </div>
                  <div className="welcome-msg">
                    <p>Hola, {user.firstName} {user.lastName} !</p>
                    <p>Desde el Panel de tu Cuenta tienes la capacidad de ver una instantánea de tu actividad reciente y actualizar la información de tu cuenta. Selecciona un enlace a continuación para ver o editar la información.</p>
                  </div>
                  <div className="box-account box-info">
                    <div className="box-head">
                      <h2>Información de la Cuenta</h2>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="box">
                          <div className="box-title">
                            <h3>Información de Contacto</h3>
                            <a href="#">Editar</a>
                          </div>
                          <div className="box-content">
                            <h6>{user.firstName} {user.lastName}</h6>
                            <h6>{user.email}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <!-- section end --> */}
    </>
  );
};

export default Dashboard;
