/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useState } from "react";
import { NextPage } from "next";
import { Media, Row, Col } from "reactstrap";
import Breadcrumb from "../../views/Containers/Breadcrumb";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";
import { orderService } from "@/services/order.service";
import { authService } from "@/services/auth.service";

const OrderSuccessPage: NextPage = () => {
  const [order, setOrder] = useState<any>(null);
  const { selectedCurr } = React.useContext(CurrencyContext);
  const { symbol, value } = selectedCurr;

  useEffect(() => {
    // Attempt to get the specific order we just created
    const lastOrderId = localStorage.getItem("last_order_id");

    if (lastOrderId) {
      const foundOrder = orderService.getOrderById(lastOrderId);
      setOrder(foundOrder);
    } else {
      // Fallback to history if no specific ID found (legacy behavior)
      const user = authService.getCurrentUser();
      const userId = user ? user.id : 'guest';
      // Note: getOrdersByUser now checks userId too, but might still be flaky if guest and no email match
      const orders = orderService.getOrderHistory(userId);
      if (orders && orders.length > 0) {
        setOrder(orders[orders.length - 1]);
      }
    }
  }, []);

  if (!order) {
    return (
      <>
        <Breadcrumb title="order-success" parent="home" />
        <section className="section-big-py-space mt--5 bg-light">
          <div className="custom-container">
            <div className="col-sm-12 empty-cart-cls text-center">
              <h3 className="mb-3"><strong>Loading Order Details...</strong></h3>
            </div>
          </div>
        </section>
      </>
    )
  }

  const items = order.cartItems;
  const subtotal = order.total;
  const shippingCharge = 0; // Simplified for now
  const taxRate = 0; // Simplified
  const taxCharge = 0;
  const grandTotal = subtotal;

  const orderDate = new Date().toLocaleDateString();
  // Ideally order should have a date field.

  return (
    <>
      {/* <!-- thank-you section start --> */}
      <Breadcrumb title="order-success" parent="home" />
      {/* <!-- Section ends --> */}

      {/* <!-- order-detail section start --> */}
      <section className="section-big-py-space mt--5 bg-light">
        <div className="custom-container">
          <Row>
            <Col lg="6">
              <div className="product-order">
                <h3>your order details</h3>
                <Row className="product-order-detail g-3">
                  {items && items.map((item: any, i: number) => {
                    return (
                      <Fragment key={i}>
                        <Col xs="3">
                          <Media src={`/images/${item.images[0].src}`} alt="" className="img-fluid " />
                        </Col>
                        <Col xs="3" className="order_detail">
                          <div>
                            <h4>product name</h4>
                            <h5>{item.title}</h5>
                          </div>
                        </Col>
                        <Col xs="3" className="order_detail">
                          <div>
                            <h4>quantity</h4>
                            <h5>{item.qty}</h5>
                          </div>
                        </Col>
                        <Col xs="3" className="order_detail">
                          <div>
                            <h4>price</h4>
                            <h5>
                              {symbol}
                              {(item.price * value).toFixed(2)}
                            </h5>
                          </div>
                        </Col>
                      </Fragment>
                    );
                  })}
                </Row>

                <div className="total-sec">
                  <ul>
                    <li>
                      subtotal{" "}
                      <span>
                        {symbol}
                        {(subtotal * value).toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="final-total">
                  <h3>
                    total{" "}
                    <span>
                      {symbol} {grandTotal * value}
                    </span>
                  </h3>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="row order-success-sec">
                <div className="col-sm-6">
                  <h4>summary</h4>
                  <ul className="order-detail">
                    <li>Payment ID: {order.transactionId || 'N/A'}</li>
                    <li>Order ID: {order.id || 'N/A'}</li>
                    <li>Order Total: {symbol}{(grandTotal * value).toFixed(2)}</li>
                  </ul>
                </div>
                <div className="col-sm-6">
                  <h4>shipping address</h4>
                  <ul className="order-detail">
                    <li>{order.firstName} {order.lastName}</li>
                    <li>{order.address}</li>
                    <li>{order.phone}</li>
                  </ul>
                </div>
                <div className="col-sm-12 payment-mode">
                  <h4>payment status</h4>
                  <p style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {order.paymentStatus || 'Pending'}
                  </p>
                </div>
                <div className="col-md-12">
                  <div className="delivery-sec">
                    <h3>expected date of delivery</h3>
                    <h2>{new Date(Date.now() + 86400000).toLocaleDateString()}</h2>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
      {/* <!-- Section ends --> */}
    </>
  );
};

export default OrderSuccessPage;
