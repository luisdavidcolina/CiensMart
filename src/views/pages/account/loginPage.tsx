import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "../../../services/auth.service";
import { toast } from "react-toastify";
import { Col, Input, Label, Row } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import { useTranslation } from "react-i18next";

const Login: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test@123");

  const loginAuth = async (email: string, password: string) => {
    try {
      const user = await authService.login(email, password);
      if (user) {
        router.push(`/`);
      }
    } catch (error) {
      // Error is handled with toast in service
    }
  };

  return (
    <>
      <Breadcrumb title={t("account_login_breadcrumb_title")} parent={t("account_breadcrumb_home")} />
      <section className="login-page section-big-py-space bg-light">
        <div className="custom-container">
          <Row className="row">
            <Col xl="4" lg="6" md="8" className="offset-xl-4 offset-lg-3 offset-md-2">
              <div className="theme-card">
                <h3 className="text-center">{t("account_login_title")}</h3>
                <form className="theme-form">
                  <div className="form-group">
                    <Label htmlFor="email">{t("account_email_label")}</Label>
                    <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder={t("account_email_placeholder")} required />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="review">{t("account_password_label")}</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder={t("account_password_placeholder")} required />
                  </div>
                  <a href="#" className="btn btn-normal" onClick={() => loginAuth(email, password)}>
                    {t("account_login_action")}
                  </a>
                  <a className="float-end txt-default mt-2" href="/pages/account/forget-password" id="fgpwd">
                    {t("account_forgot_password")}
                  </a>
                </form>
                <p className="mt-3">{t("account_login_register_hint")}</p>
                <a href="/pages/account/register" className="txt-default pt-3 d-block">
                  {t("account_create_account")}
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Login;
