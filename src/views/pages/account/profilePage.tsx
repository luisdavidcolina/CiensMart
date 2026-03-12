import React from "react";
import { NextPage } from "next";
import { Input, Label, Row, Col, Form, FormGroup } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import { useTranslation } from "react-i18next";

const Profile: NextPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Breadcrumb title={t("profile_breadcrumb_title")} parent={t("account_breadcrumb_home")} />
      {/* <!-- personal deatail section start --> */}
      <section className="contact-page register-page section-big-py-space bg-light">
        <div className="custom-container">
          <Row className="row">
            <Col lg="6">
              <h3 className="mb-3">{t("profile_personal_detail")}</h3>
              <Form className="theme-form">
                <div className="form-row row">
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name">{t("account_first_name_label")}</Label>
                      <Input type="text" className="form-control" id="name" placeholder={t("contact_first_name_placeholder")} required />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="email">{t("account_last_name_label")}</Label>
                      <Input type="text" className="form-control" id="last-name" placeholder={t("account_last_name_placeholder")} required />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="review">{t("checkout_phone")}</Label>
                      <Input type="text" className="form-control" placeholder={t("contact_phone_placeholder")} required />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <div>
                      <FormGroup>
                        <Label htmlFor="email">{t("account_email_label")}</Label>
                        <Input type="text" className="form-control" placeholder={t("account_email_placeholder")} required />
                      </FormGroup>
                    </div>
                  </Col>
                  <Col className="col-md-12">
                    <div>
                      <Label htmlFor="review">{t("contact_write_message")}</Label>
                      <textarea className="form-control mb-0" placeholder={t("contact_write_message")} id="exampleFormControlTextarea1"></textarea>
                    </div>
                  </Col>
                </div>
              </Form>
            </Col>
            <Col lg="6">
              <h3 className="mb-3 spc-responsive">{t("profile_shipping_address")}</h3>
              <Form className="theme-form">
                <div className="form-row row">
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="home-ploat">{t("profile_flat_plot")}</Label>
                      <Input type="text" className="form-control" id="home-ploat" placeholder={t("profile_company_name")} required />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="address-two">{t("profile_address")}</Label>
                      <Input type="text" className="form-control" id="address-two" placeholder={t("profile_address")} required />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="zip-code">{t("profile_zip_code")}</Label>
                      <Input type="text" className="form-control" id="zip-code" placeholder={t("profile_zip_code")} required />
                    </FormGroup>
                  </Col>
                  <Col md="6" className="select_input">
                    <FormGroup>
                      <Label>{t("profile_country")}</Label>
                      <select className="form-control">
                        <option value="India">India</option>
                        <option value="UAE">UAE</option>
                        <option value="U.K">U.K</option>
                        <option value="US">US</option>
                      </select>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="city">{t("checkout_city")}</Label>
                      <Input type="text" className="form-control" id="city" placeholder={t("checkout_city")} required />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="region-state">{t("profile_region_state")}</Label>
                      <Input type="text" className="form-control" id="region-state" placeholder={t("profile_region_state")} required />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <button className="btn btn-sm btn-normal mb-lg-5" type="submit">
                      {t("profile_save_setting")}
                    </button>
                  </Col>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      </section>
      {/* <!-- Section ends --> */}
    </>
  );
};

export default Profile;
