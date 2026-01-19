import { NextPage } from "next";
import { useState } from "react";
import { toast } from "react-toastify";
import { Form, FormGroup, Input, Label } from "reactstrap";

const UserProfile: NextPage = () => {
  const [openAccount, setOpenAccount] = useState(false);
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test@123");
  const [user, setUser] = useState("");
  const signout = () => {
    setUser("");
    localStorage.removeItem("Login");
    setOpenAccount(!openAccount);
    setTimeout(() => toast.success("Success Fully Signed Out"), 200);
  };

  const loginAuth = (email: string, password: string) => {
    if (email === "test@gmail.com" && password === "test@123") {
      setUser(email);
      localStorage.setItem("Login", email);
      setOpenAccount(!openAccount);
      setTimeout(() => toast.success("Success Fully Login"), 200);
    } else {
      setTimeout(() => toast.error("Login Failed"), 200);
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
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input type="text" disabled={user ? true : false} className="form-control d-inherit" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="review">Password</Label>
                <Input type="password" disabled={user ? true : false} className="form-control d-inherit" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                {!user ? (
                  <a href="#" className="btn btn-rounded btn-block" onClick={() => loginAuth(email, password)}>
                    Login
                  </a>
                ) : (
                  <a href="#" className="btn btn-rounded btn-block" onClick={signout}>
                    Logout
                  </a>
                )}
              </FormGroup>
              {!user && (
                <FormGroup>
                  <h5 className="forget-class">
                    <a href="/pages/account/forget-password" className="d-block">
                      forget password?
                    </a>
                  </h5>
                  <h6 className="forget-class">
                    <a href="/pages/account/register" className="d-block">
                      new to store? Signup now
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
