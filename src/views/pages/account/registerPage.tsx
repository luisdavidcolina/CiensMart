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

  const handleRegister = (e: any) => {
    e.preventDefault();
    const success = authService.register(formData);
    if (success) {
      setTimeout(() => router.push(`/pages/account/checkout`), 200);
    }
  };

  return (
    <>
      <Breadcrumb title="Register" parent="home" />
      {/* <!--section start--> */}
      <section className="login-page section-big-py-space bg-light">
        <div className="custom-container">
          <Row className="row">
            <Col lg="4" className="offset-lg-4">
              <div className="theme-card">
                <h3 className="text-center">Create account</h3>
                <Form className="theme-form" onSubmit={handleRegister}>
                  <div className="form-row row">
                    <FormGroup className="col-md-12">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input type="text" name="firstName" onChange={handleChange} className="form-control" placeholder="First Name" required />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input type="text" name="lastName" onChange={handleChange} className="form-control" placeholder="Last Name" required />
                    </FormGroup>
                  </div>
                  <div className="form-row row">
                    <FormGroup className="col-md-12">
                      <Label htmlFor="email">email</Label>
                      <Input type="text" name="email" onChange={handleChange} className="form-control" placeholder="Email" required />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <Label htmlFor="password">Password</Label>
                      <Input type="password" name="password" onChange={handleChange} className="form-control" autoComplete="" placeholder="Enter your password" required />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <button type="submit" className="btn btn-normal">
                        create Account
                      </button>
                    </FormGroup>
                  </div>
                  <div className="form-row row">
                    <Col md="12">
                      <p>
                        Have you already account?
                        <a href="/pages/account/login" className="txt-default">
                          click
                        </a>
                        here to &nbsp;
                        <a href="/pages/account/login" className="txt-default">
                          Login
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
