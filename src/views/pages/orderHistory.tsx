import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Media, Row, Col } from "reactstrap";
import Breadcrumb from "../../views/Containers/Breadcrumb";
import { authService } from "@/services/auth.service";
import { orderService } from "@/services/order.service";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";

const OrderHistoryPage: NextPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { selectedCurr } = React.useContext(CurrencyContext);
  const { symbol, value } = selectedCurr;

  useEffect(() => {
    const user = authService.getCurrentUser();
    const userId = user ? user.id : 'guest';
    const history = orderService.getOrderHistory(userId);
    setOrders(history.reverse()); // Show newest first
  }, []);

  return (
    <div className="bg-light">
      {/* <!-- breadcrumb start --> */}
      <Breadcrumb title="historial de pedidos" parent="inicio" />
      {/* <!-- breadcrumb End --> */}

      {/* <!--section start--> */}
      <section className="cart-section order-history section-big-py-space">
        <div className="custom-container">
          <Row>
            <Col sm="12">
              <table className="table cart-table table-responsive-xs">
                <thead>
                  <tr className="table-head">
                    <th scope="col">producto</th>
                    <th scope="col">descripción</th>
                    <th scope="col">precio</th>
                    <th scope="col">estado</th>
                  </tr>
                </thead>
                {orders.map((order, index) => (
                  <tbody key={index}>
                    {order.cartItems.map((item: any, i: number) => (
                      <tr key={i}>
                        <td>
                          <a href="#">
                            <Media src={`/images/${item.images[0].src}`} alt="product" className="img-fluid" />
                          </a>
                        </td>
                        <td>
                          <a href="#">
                            nro pedido: <span className="dark-data">{order.id}</span> <br />
                            {item.title}
                          </a>
                          <div className="mobile-cart-content row">
                            <div className="col-xs-3 col-3">
                              <h4 className="td-color">{symbol}{(item.price * value).toFixed(2)}</h4>
                            </div>
                          </div>
                        </td>
                        <td>
                          <h4>{symbol}{(item.price * value).toFixed(2)}</h4>
                        </td>
                        <td>
                          <div className="responsive-data">
                            <h4 className="price">{symbol}{(item.price * value).toFixed(2)}</h4>
                            <span>Talla: {item.size || 'N/A'}</span>|<span>Cantidad: {item.qty}</span>
                          </div>
                          <span className="dark-data">{order.status}</span> ({order.paymentStatus})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
              {orders.length === 0 && <div className="text-center">No se encontraron pedidos.</div>}
            </Col>
          </Row>
        </div>
      </section>
      {/* <!--section end--> */}
    </div>
  );
};

export default OrderHistoryPage;
