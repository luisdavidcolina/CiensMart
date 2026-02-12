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
    return (<div>Please login to view dashboard</div>);
  }

  return (
    <>
      {/* <!-- breadcrumb start --> */}
      <Breadcrumb title="Dashboard" parent="home" />
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
                <a className="popup-btn">my account</a>
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
                    <i className="fa fa-angle-left" aria-hidden="true"></i> back
                  </span>
                </div>
                <div className="block-content ">
                  <ul>
                    <li className="active">
                      <a href="#">Account Info</a>
                    </li>
                    <li>
                      <a href="/pages/account/order-history">My Orders</a>
                    </li>
                    <li>
                      <a href="#" onClick={() => authService.logout()}>Logout</a>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col lg="9">
              <div className="dashboard-right">
                <div className="dashboard">
                  <div className="page-title">
                    <h2>My Dashboard</h2>
                  </div>
                  <div className="welcome-msg">
                    <p>Hello, {user.firstName} {user.lastName} !</p>
                    <p>From your My Account Dashboard you have the ability to view a snapshot of your recent account activity and update your account information. Select a link below to view or edit information.</p>
                  </div>
                  <div className="box-account box-info">
                    <div className="box-head">
                      <h2>Account Information</h2>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="box">
                          <div className="box-title">
                            <h3>Contact Information</h3>
                            <a href="#">Edit</a>
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
