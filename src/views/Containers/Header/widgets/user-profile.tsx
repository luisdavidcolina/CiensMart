import { NextPage } from "next";
import { useState } from "react";
import { toast } from "react-toastify";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { useAuth } from "@/helpers/auth/auth.context";
import { authService } from "@/services/auth.service";

const UserProfile: NextPage = () => {
  const { currentUser, logout } = useAuth();
  const [openAccount, setOpenAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signout = async () => {
    await logout();
    setOpenAccount(false);
  };

  const loginAuth = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      setOpenAccount(false);
    } catch (error) {
      // toast handled in service
    }
  };

  return (
    <>
      <li className="mobile-user onhover-dropdown" onClick={() => setOpenAccount(!openAccount)}>
        <a href="#">
          <i className="icon-user"></i>
        </a>
      </li>
      <div id="myAccount" className={`add_to_cart right account-bar ${openAccount ? "open-side" : ""}`}>
        <a href="#" className="overlay" onClick={() => setOpenAccount(!openAccount)}></a>
        <div className="cart-inner">
          <>
            <div className="cart_top">
              <h3>my account</h3>
              <div className="close-cart">
                <a href="#" onClick={() => setOpenAccount(!openAccount)}>
                  <i className="fa fa-times" aria-hidden="true"></i>
                </a>
              </div>
            </div>
            <Form className="userForm">
              {!currentUser && (
                <>
                  <FormGroup>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input type="text" className="form-control d-inherit" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="review">Contraseña</Label>
                    <Input type="password" className="form-control d-inherit" placeholder="Introduce tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </FormGroup>
                </>
              )}
              {currentUser && (
                <div className="text-center mb-3">
                  <h5>HOLA,</h5>
                  <p>{currentUser.email}</p>
                </div>
              )}
              <FormGroup>
                {!currentUser ? (
                  <a href="#" className="btn btn-rounded btn-block" onClick={() => loginAuth(email, password)}>
                    Ingresar
                  </a>
                ) : (
                  <a href="#" className="btn btn-rounded btn-block" onClick={signout}>
                    Cerrar Sesión
                  </a>
                )}
              </FormGroup>
              {!currentUser && (
                <FormGroup>
                  <h5 className="forget-class">
                    <a href="/pages/account/forget-password" className="d-block">
                      ¿olvidaste tu contraseña?
                    </a>
                  </h5>
                  <h6 className="forget-class">
                    <a href="/pages/account/register" className="d-block" onClick={() => setOpenAccount(false)}>
                      ¿nuevo aquí? Regístrate
                    </a>
                  </h6>
                </FormGroup>
              )}
            </Form>
          </>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
