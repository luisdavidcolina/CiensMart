import React from "react";
import { NextPage } from "next";
import { Input, Container, Row, Col, Card, Form, FormGroup } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import { useTranslation } from "react-i18next";

const ForgetPassword: NextPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Breadcrumb title={t("forgot_breadcrumb_title")} parent={t("account_breadcrumb_home")} />
      <section className="login-page pwd-page section-big-py-space bg-light">
        <Container>
          <Row>
            <Col lg="6" className="offset-lg-3">
              <Card className="theme-card border-0">
                <h3>{t("forgot_title")}</h3>
                <Form className="theme-form">
                  <div className="form-row row justify-content-center">
                    <Col className="p-0" md="12">
                      <FormGroup>
                        <label htmlFor="email" className="form-label">
                          {t("account_email_label")}
                        </label>
                        <Input type="text" className="form-control" placeholder={t("forgot_email_placeholder")} required />
                      </FormGroup>
                    </Col>
                    <a href="#" className="btn btn-normal">
                      {t("forgot_submit")}
                    </a>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ForgetPassword;
