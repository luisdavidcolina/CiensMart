import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import { useAuth } from "@/helpers/auth/auth.context";
import { orderService } from "@/services/order.service";
import { authService } from "@/services/auth.service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Dashboard: NextPage = () => {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const { currentUser, userProfile, loading, logout } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.email) {
        setOrders([]);
        setLoadingOrders(false);
        return;
      }

      try {
        const history = await orderService.getOrderHistory(currentUser.email);
        setOrders(history.slice(0, 10));
      } catch (error) {
        console.error("Error cargando pedidos en dashboard:", error);
        toast.error(t("dashboard_orders_load_error"));
      } finally {
        setLoadingOrders(false);
      }
    };

    setLoadingOrders(true);
    fetchOrders();
  }, [currentUser, t]);

  const handleDeleteOrder = async (orderId: string) => {
    const confirmed = window.confirm(t("dashboard_delete_order_confirm"));
    if (!confirmed) {
      return;
    }

    try {
      setDeletingOrderId(orderId);
      await orderService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.fireId !== orderId));
      toast.success(t("dashboard_order_deleted"));
    } catch (error) {
      console.error("Error eliminando pedido:", error);
      toast.error(t("dashboard_delete_order_error"));
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      t("dashboard_delete_account_confirm")
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingAccount(true);
      await authService.deleteCurrentAccount();
      window.location.href = "/";
    } catch {
      // El mensaje de error ya se maneja en authService
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return <div className="text-center p-5">{t("dashboard_loading_panel")}</div>;
  }

  if (!currentUser) {
    return (
      <div className="text-center p-5">
        <h4>{t("dashboard_login_required")}</h4>
        <a href="/pages/account/login" className="btn btn-normal mt-3">
          {t("dashboard_go_to_login")}
        </a>
      </div>
    );
  }

  const fullName = `${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim();
  const displayName = fullName || currentUser.displayName || t("dashboard_default_user");

  return (
    <>
      {/* <!-- breadcrumb start --> */}
      <Breadcrumb title={t("dashboard_breadcrumb_title")} parent={t("account_breadcrumb_home")} />
      {/* <!-- breadcrumb End --> */}

      {/* <!-- section start --> */}
      <section className="section-big-py-space bg-light">
        <Container>
          <Row>
            <Col lg="3">
              <div
                className="account-sidebar"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <a className="popup-btn">{t("dashboard_my_account")}</a>
              </div>
              <div
                className={`dashboard-left`}
                style={{
                  left: isOpen ? "0px" : "",
                }}
              >
                <div className="collection-mobile-back">
                  <span
                    className="filter-back"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <i className="fa fa-angle-left" aria-hidden="true"></i> {t("dashboard_back")}
                  </span>
                </div>
                <div className="block-content ">
                  <ul>
                    <li className="active">
                      <a href="#">{t("dashboard_account_info")}</a>
                    </li>
                    <li>
                      <a href="/pages/account/order-history">{t("dashboard_my_orders")}</a>
                    </li>
                    <li>
                      <a href="/pages/account/cards">Mis tarjetas</a>
                    </li>
                    <li>
                      <a
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          logout();
                        }}
                      >
                        {t("dashboard_logout")}
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{ color: "#c62828" }}
                        onClick={(event) => {
                          event.preventDefault();
                          if (!deletingAccount) {
                            handleDeleteAccount();
                          }
                        }}
                      >
                        {deletingAccount ? t("dashboard_deleting_account") : t("dashboard_delete_account")}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col lg="9">
              <div className="dashboard-right">
                <div className="dashboard">
                  <div className="page-title">
                    <h2>{t("dashboard_title")}</h2>
                  </div>
                  <div className="welcome-msg">
                    <p>{t("dashboard_welcome", { name: displayName })}</p>
                    <p>{t("dashboard_subtitle")}</p>
                  </div>
                  <div className="box-account box-info">
                    <div className="box-head">
                      <h2>{t("dashboard_account_information_title")}</h2>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="box">
                          <div className="box-title">
                            <h3>{t("dashboard_main_data")}</h3>
                          </div>
                          <div className="box-content">
                            <h6>{t("dashboard_name")}: {displayName}</h6>
                            <h6>{t("dashboard_email")}: {currentUser.email || t("order_history_not_available")}</h6>
                            <h6>{t("dashboard_uid")}: {currentUser.uid}</h6>
                            <h6>{t("dashboard_total_orders")}: {orders.length}</h6>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="box-title mb-3">
                        <h3>{t("dashboard_recent_orders")}</h3>
                      </div>

                      {loadingOrders ? (
                        <p>{t("dashboard_loading_orders")}</p>
                      ) : orders.length === 0 ? (
                        <p>{t("dashboard_no_orders")}</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>{t("dashboard_table_id")}</th>
                                <th>{t("dashboard_table_date")}</th>
                                <th>{t("dashboard_table_total")}</th>
                                <th>{t("dashboard_table_status")}</th>
                                <th>{t("dashboard_table_action")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order) => (
                                <tr key={order.fireId}>
                                  <td>{order.fireId}</td>
                                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                  <td>{order.total ?? "-"}</td>
                                  <td>{order.paymentStatus || t("dashboard_pending")}</td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDeleteOrder(order.fireId)}
                                      disabled={deletingOrderId === order.fireId}
                                    >
                                      {deletingOrderId === order.fireId ? t("dashboard_deleting") : t("dashboard_delete")}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <!-- section end --> */}
    </>
  );
};

export default Dashboard;
