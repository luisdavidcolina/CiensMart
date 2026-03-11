import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/auth.service";
import { Label, Input, Row, Col, Form, FormGroup } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";

const RegisterPage: NextPage = () => {
  const router = useRouter();
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

  return (
    <>
      <Breadcrumb title="Registro" parent="inicio" />
      {/* <!--section start--> */}
      <section className="login-page section-big-py-space bg-light">
        <div className="custom-container">
          <Row className="row">
            <Col lg="4" className="offset-lg-4">
              <div className="theme-card">
                <h3 className="text-center">Crear cuenta</h3>
                <Form className="theme-form" onSubmit={handleRegister}>
                  <div className="form-row row">
                    <FormGroup className="col-md-12">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input type="text" name="firstName" onChange={handleChange} className="form-control" placeholder="Nombre" required />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input type="text" name="lastName" onChange={handleChange} className="form-control" placeholder="Apellido" required />
                    </FormGroup>
                  </div>
                  <div className="form-row row">
                    <FormGroup className="col-md-12">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input type="text" name="email" onChange={handleChange} className="form-control" placeholder="Correo Electrónico" required />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input type="password" name="password" onChange={handleChange} className="form-control" autoComplete="" placeholder="Introduce tu contraseña" required />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <button type="submit" className="btn btn-normal">
                        Crear Cuenta
                      </button>
                    </FormGroup>
                  </div>
                  <div className="form-row row">
                    <Col md="12">
                      <p>
                        ¿Ya tienes una cuenta?
                        <a href="/pages/account/login" className="txt-default">
                          haz clic
                        </a>
                        aquí para &nbsp;
                        <a href="/pages/account/login" className="txt-default">
                          Iniciar Sesión
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
