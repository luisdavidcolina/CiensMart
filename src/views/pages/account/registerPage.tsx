import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/auth.service";
import { Label, Input, Row, Col, Form, FormGroup } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import { useTranslation } from "react-i18next";

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      const user = await authService.register(formData);
      if (user) {
        router.push(`/`);
      }
    } catch (error) {
      // Error is handled with toast in service
    }
  };

  const handleDemoLogin = async () => {
    try {
      const user = await authService.loginDemo();
      if (user) {
        router.push(`/`);
      }
    } catch (error) {
      // Error is handled with toast in service
    }
  };

  return (
    <>
      <Breadcrumb title={t("account_register_breadcrumb_title")} parent={t("account_breadcrumb_home")} />
      {/* <!--section start--> */}
      <section className="login-page section-big-py-space bg-light">
        <div className="custom-container">
          <Row className="row">
            <Col lg="4" className="offset-lg-4">
              <div className="theme-card">
                <h3 className="text-center">{t("account_register_title")}</h3>
                <Form className="theme-form" onSubmit={handleRegister}>
                  <div className="form-row row">
                    <FormGroup className="col-md-12">
                      <Label htmlFor="firstName">{t("account_first_name_label")}</Label>
                      <Input type="text" name="firstName" onChange={handleChange} className="form-control" placeholder={t("account_first_name_placeholder")} required />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <Label htmlFor="lastName">{t("account_last_name_label")}</Label>
                      <Input type="text" name="lastName" onChange={handleChange} className="form-control" placeholder={t("account_last_name_placeholder")} required />
                    </FormGroup>
                  </div>
                  <div className="form-row row">
                    <FormGroup className="col-md-12">
                      <Label htmlFor="email">{t("account_email_label")}</Label>
                      <Input type="text" name="email" onChange={handleChange} className="form-control" placeholder={t("account_email_placeholder")} required />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <Label htmlFor="password">{t("account_password_label")}</Label>
                      <Input type="password" name="password" onChange={handleChange} className="form-control" autoComplete="" placeholder={t("account_password_placeholder")} required />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <button type="submit" className="btn btn-normal">
                        {t("account_register_action")}
                      </button>
                      <button type="button" className="btn btn-outline-secondary ms-2" onClick={handleDemoLogin}>
                        Iniciar sesion con cuenta demo
                      </button>
                    </FormGroup>
                  </div>
                  <div className="form-row row">
                    <Col md="12">
                      <p>
                        {t("account_have_account")}
                        <a href="/pages/account/login" className="txt-default">
                          {t("account_click_here")}
                        </a>
                        {t("account_here_to")} &nbsp;
                        <a href="/pages/account/login" className="txt-default">
                          {t("account_login_action")}
                        </a>
                      </p>
                    </Col>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </section>
      {/* <!--Section ends--> */}
    </>
  );
};

export default RegisterPage;
