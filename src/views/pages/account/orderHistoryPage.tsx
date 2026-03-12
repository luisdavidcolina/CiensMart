import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Container, Row, Col, Table, Badge } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import { useAuth } from "@/helpers/auth/auth.context";
import { orderService } from "@/services/order.service";
import { CurrencyContext } from "@/helpers/currency/CurrencyContext";
import { useTranslation } from "react-i18next";

const OrderHistoryPage: NextPage = () => {
    const { currentUser } = useAuth();
    const { t } = useTranslation("common");
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
                setError(t("order_history_error_loading"));
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [currentUser, t]);

    return (
        <>
            <Breadcrumb title={t("order_history_breadcrumb_title")} parent={t("account_breadcrumb_account")} />
            <section className="section-big-py-space bg-light">
                <Container>
                    <Row>
                        <Col lg="12">
                            <div className="order-history-page">
                                {loading ? (
                                    <div className="text-center">
                                        <h3>{t("order_history_loading")}</h3>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-warning text-center">
                                        <h4>{error}</h4>
                                        <p>{t("order_history_error_hint")}</p>
                                    </div>
                                ) : orders.length > 0 ? (
                                    <Table hover responsive>
                                        <thead>
                                            <tr>
                                                <th>{t("order_history_table_date")}</th>
                                                <th>{t("order_history_table_id")}</th>
                                                <th>{t("order_history_table_bank")}</th>
                                                <th>{t("order_history_table_total")}</th>
                                                <th>{t("order_history_table_payment_status")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order.fireId}>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td>{order.fireId}</td>
                                                    <td>{order.paymentBank || t("order_history_not_available")}</td>
                                                    <td>{symbol}{(order.total * value).toFixed(2)}</td>
                                                    <td>
                                                        <Badge color={order.paymentStatus === "Pagado" ? "success" : "warning"}>
                                                            {order.paymentStatus || t("dashboard_pending")}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-center">
                                        <h3>{t("order_history_empty")}</h3>
                                        <a href="/" className="btn btn-normal mt-3">{t("order_history_start_shopping")}</a>
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
