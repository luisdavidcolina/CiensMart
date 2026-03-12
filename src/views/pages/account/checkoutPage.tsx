import React, { useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { Input, Label, Form, Row, Col, FormGroup, Button, Spinner, Card, CardBody } from "reactstrap";
import { CartContext } from "../../../helpers/cart/cart.context";
import Breadcrumb from "../../../views/Containers/Breadcrumb";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";
import { toast } from "react-toastify";
import { orderService } from "../../../services/order.service";
import { paymentService } from "../../../services/payment.service";
import { useAuth } from "@/helpers/auth/auth.context";
import { userStorageService } from "@/services/user-storage.service";
import { authService } from "@/services/auth.service";
import { useTranslation } from "react-i18next";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

interface formType {
  firstName: string;
  lastName: string;
  phone: any;
  email: string;
  address: string;
  city: string;
}

const CheckoutPage: NextPage = () => {
  const { t } = useTranslation("common");
  const { currentUser, userProfile } = useAuth();
  const { cartItems, cartTotal, emptyCart } = React.useContext(CartContext);
  const { selectedCurr } = React.useContext(CurrencyContext);
  const { symbol, value } = selectedCurr;
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [rememberCard, setRememberCard] = useState(false);
  const [manualBank, setManualBank] = useState(""); // manual bank selection
  const [demoLoginLoading, setDemoLoginLoading] = useState(false);

  // Payment Form State
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<formType>();

  const router = useRouter();

  // Load saved cards
  React.useEffect(() => {
    const fetchCards = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const directCards = userDocSnap.data()?.cards;
            if (Array.isArray(directCards)) {
              setSavedCards(directCards);
              return;
            }
          }
        } catch (error) {
          // fallback con servicio
        }

        const cards = await userStorageService.getSavedCards(currentUser.uid, currentUser.email || undefined, true);
        setSavedCards(cards);
      }
    };
    fetchCards();
  }, [currentUser]);

  // Auto-fill form if user is logged in
  React.useEffect(() => {
    if (userProfile) {
      setValue("firstName", userProfile.firstName || "");
      setValue("lastName", userProfile.lastName || "");
      setValue("email", userProfile.email || "");
      setValue("phone", userProfile.phone || "0");
      setValue("address", userProfile.address || "Av. Principal, Caracas");
      setValue("city", userProfile.city || "Caracas");
    } else {
      setValue("phone", "0");
      setValue("address", "Av. Principal, Caracas");
      setValue("city", "Caracas");
      if (currentUser) {
        setValue("email", currentUser.email || "");
      }
    }
  }, [userProfile, currentUser, setValue]);

  const handleCardChange = (e: any) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleSelectCard = (card: any) => {
    setCardDetails({
      cardNumber: card.cardNumber,
      expiry: card.expiry,
      cvv: card.cvv
    });
    if (card.bankIdentifier) {
      setManualBank(card.bankIdentifier);
    }
    toast.info(t("checkout_saved_card_selected", { last4: card.last4 }));
  };

  const processOrder = async (data: formType, paymentStatus: string, transactionId?: string, bankName?: string) => {
    const order = {
      ...data,
      cartItems,
      total: cartTotal,
      userId: currentUser ? currentUser.uid : 'guest',
      status: 'Pending',
      paymentStatus: paymentStatus,
      transactionId: transactionId || `txn_${Date.now()}`,
      paymentBank: bankName || "Unknown"
    };

    const newOrder = await orderService.createOrder(order);
    localStorage.setItem("order-sucess-items", JSON.stringify(cartItems));

    if (newOrder && newOrder.fireId) {
      localStorage.setItem("last_order_id", newOrder.fireId);
    }
    emptyCart();
    router.push("/pages/order-success");
  };

  const onSubmit = async (data: formType) => {
    if (data !== null) {
      setLoading(true);
      setPaymentError(null);

      if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error(t("checkout_card_details_required"));
        setLoading(false);
        return;
      }

      const response = await paymentService.processTransaction(
        cardDetails,
        cartTotal,
        `Pedido de ${data.firstName} ${data.lastName}`,
        manualBank // Pass manual selection if any
      );

      if (response.success) {
        toast.success(t("checkout_payment_success"));

        if (rememberCard && currentUser) {
          await userStorageService.saveCard(
            currentUser.uid,
            cardDetails,
            manualBank || response.bankName?.toLowerCase().replace(/\s/g, ""),
            currentUser.email || undefined
          );
        }

        await processOrder(data, "Pagado", response.data?.transaction_id, response.bankName);
      } else {
        setPaymentError(response.error || t("checkout_payment_failed"));
        setLoading(false);
        toast.error(t("checkout_payment_failed_hint"));
      }
    }
  };

  const handleBuyAnyway = handleSubmit((data: formType) => {
    processOrder(data, t("checkout_payment_failed_pending"));
  });

  const handleDemoLogin = async () => {
    try {
      setDemoLoginLoading(true);
      await authService.loginDemo();
      router.push("/pages/account/checkout");
    } catch (error) {
      // Toast is handled in auth service
    } finally {
      setDemoLoginLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <>
        <Breadcrumb title={t("checkout_breadcrumb_title")} parent={t("account_breadcrumb_home")} />
        <section className="section-big-py-space bg-light">
          <div className="custom-container">
            <div className="alert alert-warning mb-4">
              Debes iniciar sesion o registrarte para poder pagar.
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Link href="/pages/account/login" className="btn btn-normal me-2">
                Iniciar sesion
              </Link>
              <Link href="/pages/account/register" className="btn btn-outline-primary me-2">
                Registrarme
              </Link>
              <Button type="button" color="secondary" onClick={handleDemoLogin} disabled={demoLoginLoading}>
                {demoLoginLoading ? <Spinner size="sm" /> : "Iniciar sesion con cuenta demo"}
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={t("checkout_breadcrumb_title")} parent={t("account_breadcrumb_home")} />
      <section className="section-big-py-space bg-light">
        <div className="custom-container">
          <div className="checkout-page contact-page">
            <div className="checkout-form">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col lg="6" sm="12" xs="12">
                    <div className="checkout-title">
                      <h3>{t("checkout_billing_details")}</h3>
                    </div>
                    <div className="theme-form">
                      <Row className="check-out ">
                        <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                          <Label>{t("account_first_name_label")}</Label>
                          <input type="text" {...register("firstName", { required: true })} name="firstName" className={`${errors.firstName ? "error_border" : ""}`} />
                          <span className="error-message">{errors.firstName && t("checkout_first_name_required")}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                          <Label>{t("account_last_name_label")}</Label>
                          <input type="text" className={`${errors.lastName ? "error_border" : ""}`} {...register("lastName", { required: true })} />
                          <span className="error-message">{errors.lastName && t("checkout_last_name_required")}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                          <Label className="field-label">{t("checkout_phone")}</Label>
                          <input type="text" className={`${errors.phone ? "error_border" : ""}`} {...register("phone", { pattern: /\d+/ })} />
                        </FormGroup>
                        <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                          <Label className="field-label">{t("account_email_label")}</Label>
                          <input type="text" className={`${errors.email ? "error_border" : ""}`} {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
                        </FormGroup>
                        <FormGroup className="col-md-12 col-sm-12 col-xs-12">
                          <Label className="field-label">{t("checkout_address")}</Label>
                          <input type="text" placeholder={t("checkout_street_address")} className={`${errors.address ? "error_border" : ""}`} {...register("address", { required: true })} />
                        </FormGroup>
                        <FormGroup className="col-md-12 col-sm-12 col-xs-12">
                          <Label className="field-label">{t("checkout_city")}</Label>
                          <input type="text" className={`${errors.city ? "error_border" : ""}`} {...register("city", { required: true })} />
                        </FormGroup>
                        {!currentUser && (
                          <FormGroup className="col-lg-12">
                            <Input type="checkbox" id="account-option" /> &ensp;
                            <Label htmlFor="account-option">{t("checkout_create_account")}</Label>
                          </FormGroup>
                        )}
                      </Row>
                    </div>
                  </Col>

                  <Col lg="6" sm="12" xs="12">
                    <div className="checkout-details theme-form section-big-mt-space">
                      {cartItems && cartItems.length > 0 && (
                        <div className="order-box">
                          <div className="title-box">
                            <div>{t("checkout_product")} <span>{t("checkout_total")}</span></div>
                          </div>
                          <ul className="qty">
                            {cartItems.map((item: any, index: number) => (
                              <li key={index}>{item.title} × {item.qty} <span>{symbol}{item.total * value}</span></li>
                            ))}
                          </ul>
                          <ul className="sub-total">
                            <li>{t("checkout_subtotal")} <span className="count">{symbol}{(cartTotal * value).toFixed(2)}</span></li>
                          </ul>
                          <ul className="total">
                            <li>{t("checkout_total")} <span className="count">{symbol}{(cartTotal * value).toFixed(2)}</span></li>
                          </ul>
                        </div>
                      )}

                      <div className="payment-box">
                        <div className="upper-box">
                          <div className="payment-options">
                            <h4 className="mb-3">{t("checkout_credit_card_payment")}</h4>

                            {/* Saved Cards Selection */}
                            {savedCards.length > 0 && (
                              <div className="saved-cards-section mb-4">
                                <Label className="font-weight-bold">{t("checkout_saved_cards")}</Label>
                                <Row className="g-2">
                                  {savedCards.map((card) => (
                                    <Col md="6" key={card.id}>
                                      <Card
                                        className={`cursor-pointer mb-2 ${cardDetails.cardNumber === card.cardNumber ? 'border-primary' : ''}`}
                                        onClick={() => handleSelectCard(card)}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <CardBody className="p-2">
                                          <div className="d-flex justify-content-between align-items-center">
                                            <span>**** {card.last4}</span>
                                            <small className="text-muted">{card.expiry}</small>
                                          </div>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  ))}
                                </Row>
                              </div>
                            )}

                            <Row>
                              <Col md="12" className="mb-3">
                                <Label>{t("checkout_select_bank_optional")}</Label>
                                <Input type="select" name="manualBank" value={manualBank} onChange={(e) => setManualBank(e.target.value)}>
                                  <option value="">{t("checkout_bank_auto_detect")}</option>
                                  <option value="cienspay">Ciens Pay</option>
                                  <option value="bancobsidiana">Bancobsidiana</option>
                                  <option value="creditbank">CreditBank</option>
                                </Input>
                                <small className="text-muted">{t("checkout_bank_auto_detect_hint")}</small>
                              </Col>
                              <Col md="12" className="mb-3">
                                <Label>{t("checkout_card_number")}</Label>
                                <Input type="text" name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardChange} placeholder="0000 0000 0000 0000" />
                              </Col>
                              <Col md="6" className="mb-3">
                                <Label>{t("checkout_expiry")}</Label>
                                <Input type="text" name="expiry" value={cardDetails.expiry} onChange={handleCardChange} placeholder="MM/YY" />
                              </Col>
                              <Col md="6" className="mb-3">
                                <Label>CVV</Label>
                                <Input type="text" name="cvv" value={cardDetails.cvv} onChange={handleCardChange} placeholder="123" />
                              </Col>

                              {currentUser && (
                                <Col md="12" className="mt-2">
                                  <FormGroup check>
                                    <Label check>
                                      <Input type="checkbox" checked={rememberCard} onChange={(e) => setRememberCard(e.target.checked)} />
                                      {t("checkout_remember_card")}
                                    </Label>
                                  </FormGroup>
                                </Col>
                              )}
                            </Row>
                          </div>
                        </div>

                        {paymentError && (
                          <div className="alert alert-danger mt-3">
                            <p>{paymentError}</p>
                            <Button type="button" color="warning" className="mt-2 text-white" onClick={handleBuyAnyway}>
                              {t("checkout_buy_anyway")}
                            </Button>
                          </div>
                        )}

                        <div className="text-right mt-4">
                          {cartTotal === 0 ? (
                            <div className="alert alert-warning">{t("checkout_cart_empty")}</div>
                          ) : (
                            <Button type="submit" className="btn-normal btn" disabled={loading}>
                              {loading ? <Spinner size="sm" /> : t("checkout_place_order_pay")}
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
    </>
  );
};

export default CheckoutPage;
