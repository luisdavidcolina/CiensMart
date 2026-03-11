import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Container, Row, Col, Table, Badge } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import { useAuth } from "@/helpers/auth/auth.context";
import { orderService } from "@/services/order.service";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";

const OrderHistoryPage: NextPage = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedCurr } = React.useContext(CurrencyContext);
    const { symbol, value } = selectedCurr;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (currentUser && currentUser.email) {
                    const history = await orderService.getOrderHistory(currentUser.email);
                    setOrders(history);
                }
            } catch (err: any) {
                console.error("Error loading orders:", err);
                setError("Error al cargar el historial. Probablemente falte un índice en Firestore.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [currentUser]);

    return (
        <>
            <Breadcrumb title="Mis Pedidos" parent="cuenta" />
            <section className="section-big-py-space bg-light">
                <Container>
                    <Row>
                        <Col lg="12">
                            <div className="order-history-page">
                                {loading ? (
                                    <div className="text-center">
                                        <h3>Cargando historial...</h3>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-warning text-center">
                                        <h4>{error}</h4>
                                        <p>Por favor, asegúrate de haber creado el índice en la consola de Firebase usando el enlace que aparece en la consola del navegador.</p>
                                    </div>
                                ) : orders.length > 0 ? (
                                    <Table hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Fecha</th>
                                                <th>ID Pedido</th>
                                                <th>Banco</th>
                                                <th>Total</th>
                                                <th>Estado Pago</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order.fireId}>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td>{order.fireId}</td>
                                                    <td>{order.paymentBank || "N/A"}</td>
                                                    <td>{symbol}{(order.total * value).toFixed(2)}</td>
                                                    <td>
                                                        <Badge color={order.paymentStatus === "Pagado" ? "success" : "warning"}>
                                                            {order.paymentStatus}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-center">
                                        <h3>Aún no tienes pedidos.</h3>
                                        <a href="/" className="btn btn-normal mt-3">Empezar a comprar</a>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default OrderHistoryPage;
