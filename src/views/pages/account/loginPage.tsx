import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "../../../services/auth.service";
import { toast } from "react-toastify";
import { Col, Input, Label, Row } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";

const Login: NextPage = () => {
  const router = useRouter();
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
      <Breadcrumb title="iniciar sesión" parent="inicio" />
      <section className="login-page section-big-py-space bg-light">
        <div className="custom-container">
          <Row className="row">
            <Col xl="4" lg="6" md="8" className="offset-xl-4 offset-lg-3 offset-md-2">
              <div className="theme-card">
                <h3 className="text-center">Iniciar Sesión</h3>
                <form className="theme-form">
                  <div className="form-group">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Correo Electrónico" required />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="review">Contraseña</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Introduce tu contraseña" required />
                  </div>
                  <a href="#" className="btn btn-normal" onClick={() => loginAuth(email, password)}>
                    Iniciar Sesión
                  </a>
                  <a className="float-end txt-default mt-2" href="/pages/account/forget-password" id="fgpwd">
                    ¿Olvidaste tu contraseña?
                  </a>
                </form>
                <p className="mt-3">Regístrate para obtener una cuenta gratuita en nuestra tienda. El registro es rápido y fácil. Te permite realizar pedidos en nuestra tienda. Para comenzar a comprar, haz clic en registrarse.</p>
                <a href="/pages/account/register" className="txt-default pt-3 d-block">
                  Crear una Cuenta
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
