import React, { useState } from "react";
import { NextPage } from "next";
import { Input, Label, Form, Row, Col, FormGroup, Button, Spinner } from "reactstrap";
import { CartContext } from "../../../helpers/cart/cart.context";
import Breadcrumb from "../../../views/Containers/Breadcrumb";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";
import { toast } from "react-toastify";
import { authService } from "../../../services/auth.service";
import { orderService } from "../../../services/order.service";
import { paymentService } from "../../../services/payment.service";

interface formType {
  firstName: string;
  lastName: string;
  phone: any;
  email: string;
  address: string;
}

const CheckoutPage: NextPage = () => {
  const { cartItems, cartTotal, emptyCart } = React.useContext(CartContext);
  const { selectedCurr } = React.useContext(CurrencyContext);
  const { symbol, value } = selectedCurr;
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Payment Form State
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formType>();

  const router = useRouter();

  const handleCardChange = (e: any) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const processOrder = (data: formType, paymentStatus: string, transactionId?: string) => {
    const user = authService.getCurrentUser();
    const order = {
      ...data,
      cartItems,
      total: cartTotal,
      userId: user ? user.id : 'guest',
      status: 'Pending',
      paymentStatus: paymentStatus,
      transactionId: transactionId || `txn_${Date.now()}` // Fallback ID
    };

    const newOrder = orderService.createOrder(order);
    localStorage.setItem("order-sucess-items", JSON.stringify(cartItems));
    // Save ID for the success page to retrieve
    if (newOrder && newOrder.id) {
      localStorage.setItem("last_order_id", newOrder.id);
    }
    emptyCart();
    router.push("/pages/order-success");
  };

  const onSubmit = async (data: formType) => {
    if (data !== null) {
      setLoading(true);
      setPaymentError(null);

      // Simple validation
      if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error("Por favor ingrese los detalles de la tarjeta");
        setLoading(false);
        return;
      }

      // 1. Attempt Payment
      const response = await paymentService.processTransaction(
        cardDetails,
        cartTotal,
        `Pedido de ${data.firstName} ${data.lastName}`
      );

      if (response.success) {
        toast.success("¡Pago Exitoso!");
        processOrder(data, "Pagado", response.data?.transaction_id);
      } else {
        setPaymentError(response.error || "Pago fallido");
        setLoading(false);
        toast.error("Pago fallido. Puedes intentar de nuevo o pedir sin pagar.");
      }
    } else {
      console.log(errors);
    }
  };

  const handleBuyAnyway = handleSubmit((data: formType) => {
    processOrder(data, "Payment Failed/Pending");
  });

  return (
    <>
      <Breadcrumb title="Finalizar Pedido" parent="inicio" />
      {/* <!-- section start --> */}
      <section className="section-big-py-space bg-light">
        <div className="custom-container">
          <div className="checkout-page contact-page">
            <div className="checkout-form">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col lg="6" sm="12" xs="12">
                    <div className="checkout-title">
                      <h3>Detalles de Facturación</h3>
                    </div>
                    <div className="theme-form">
                      <Row className="check-out ">
                        <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                          <Label>Nombre</Label>
                          <input type="text" {...register("firstName", { required: true })} name="firstName" className={`${errors.firstName ? "error_border" : ""}`} placeholder="" />
                          <span className="error-message">{errors.firstName && "El nombre es obligatorio"}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                          <Label>Apellido</Label>
                          <input type="text" className={`${errors.lastName ? "error_border" : ""}`} placeholder="" {...register("lastName", { required: true })} />
                          <span className="error-message">{errors.lastName && "El apellido es obligatorio"}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                          <Label className="field-label">Teléfono</Label>
                          <input type="text" className={`${errors.phone ? "error_border" : ""}`} placeholder="" {...register("phone", { pattern: /\d+/ })} />
                          <span className="error-message">{errors.phone && "Por favor ingrese un número de teléfono válido."}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                          <Label className="field-label">Correo Electrónico</Label>
                          <input
                            type="text"
                            className={`${errors.email ? "error_border" : ""}`}
                            placeholder=""
                            {...register("email", {
                              required: true,
                              pattern: /^\S+@\S+$/i,
                            })}
                          />
                          <span className="error-message">{errors.email && "Por favor ingrese un correo válido."}</span>
                        </FormGroup>
                        <FormGroup className="col-md-12 col-sm-12 col-xs-12">
                          <Label className="field-label">Dirección</Label>
                          <input
                            type="text"
                            placeholder="Dirección de calle"
                            className={`${errors.address ? "error_border" : ""}`}
                            {...register("address", {
                              required: true,
                              min: 20,
                              max: 120,
                            })}
                          />
                          <span className="error-message">{errors.address && "Por favor ingrese su dirección."}</span>
                        </FormGroup>
                        <FormGroup className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <Input type="checkbox" name="shipping-option" id="account-option" /> &ensp;
                          <Label htmlFor="account-option">¿Crear una cuenta?</Label>
                        </FormGroup>
                      </Row>
                    </div>
                  </Col>

                  <Col lg="6" sm="12" xs="12">
                    <div className="checkout-details theme-form section-big-mt-space">
                      {cartItems && cartItems.length > 0 && (
                        <div className="order-box">
                          <div className="title-box">
                            <div>
                              Producto <span>Total</span>
                            </div>
                          </div>
                          <ul className="qty">
                            {cartItems.map((item: any, index: number) => (
                              <li key={index}>
                                {item.title} × {item.qty}{" "}
                                <span>
                                  {symbol}
                                  {item.total * value}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <ul className="sub-total">
                            <li>
                              Subtotal{" "}
                              <span className="count">
                                {symbol}
                                {(cartTotal * value).toFixed(2)}
                              </span>
                            </li>
                          </ul>
                          <ul className="total">
                            <li>
                              Total{" "}
                              <span className="count">
                                {symbol}
                                {(cartTotal * value).toFixed(2)}
                              </span>
                            </li>
                          </ul>
                        </div>
                      )}

                      <div className="payment-box">
                        <div className="upper-box">
                          <div className="payment-options">
                            <h4 className="mb-3">Pago con Tarjeta de Crédito</h4>
                            <Row>
                              <Col md="12" className="mb-3">
                                <Label>Número de Tarjeta</Label>
                                <Input type="text" name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardChange} placeholder="0000 0000 0000 0000" />
                              </Col>
                              <Col md="6" className="mb-3">
                                <Label>Vencimiento (MM/AA)</Label>
                                <Input type="text" name="expiry" value={cardDetails.expiry} onChange={handleCardChange} placeholder="MM/YY" />
                              </Col>
                              <Col md="6" className="mb-3">
                                <Label>CVV</Label>
                                <Input type="text" name="cvv" value={cardDetails.cvv} onChange={handleCardChange} placeholder="123" />
                              </Col>
                            </Row>
                          </div>
                        </div>

                        {paymentError && (
                          <div className="alert alert-danger mt-3">
                            <p>{paymentError}</p>
                            <Button type="button" color="warning" className="mt-2 text-white" onClick={handleBuyAnyway}>
                              Comprar de todos modos (Pagar después)
                            </Button>
                          </div>
                        )}

                        <div className="text-right mt-4">
                          {cartTotal === 0 ? (
                            <div className="alert alert-warning">Tu carrito está vacío</div>
                          ) : (
                            <Button type="submit" className="btn-normal btn" disabled={loading}>
                              {loading ? <Spinner size="sm" /> : "Realizar Pedido y Pagar"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- section end --> */}
    </>
  );
};

export default CheckoutPage;
