import React, { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import Breadcrumb from "../../Containers/Breadcrumb";
import { useAuth } from "@/helpers/auth/auth.context";
import { userStorageService } from "@/services/user-storage.service";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

type SavedCard = {
  id: number;
  alias?: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  last4?: string;
  bankIdentifier?: string;
  bankName?: string;
};

const bankNameMap: Record<string, string> = {
  cienspay: "Ciens Pay",
  bancobsidiana: "Bancobsidiana",
  creditbank: "CreditBank",
};

// Ajusta aqui el tamano cuadrado de todos los logos del modulo.
const BANK_LOGO_SIZE_SMALL = 28;
const BANK_LOGO_SIZE_LARGE = 56;

// Reemplaza aqui por tus logos reales cuando los tengas listos.
// Ejemplo: "/images/banks/cienspay.png"
const BANK_LOGOS: Record<string, string> = {
  cienspay: "/images/icon/1.png",
  bancobsidiana: "/images/icon/2.png",
  creditbank: "/images/icon/3.png",
};

const bankCatalog: Record<string, { name: string; logo: string; portal?: string }> = {
  cienspay: {
    name: "Ciens Pay",
    logo: BANK_LOGOS.cienspay,
    portal: "http://3.144.142.161/dashboard",
  },
  bancobsidiana: {
    name: "Bancobsidiana",
    logo: BANK_LOGOS.bancobsidiana,
    portal: "https://bancobsidiana.up.railway.app/login",
  },
  creditbank: {
    name: "CreditBank",
    logo: BANK_LOGOS.creditbank,
    portal: "https://creditbankbanco.vercel.app/login",
  },
};

const emptyForm = {
  id: null as number | null,
  alias: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  bankIdentifier: "",
};

const maskCardNumber = (value: string) => {
  const clean = (value || "").replace(/\D/g, "");
  if (clean.length < 4) return "****";
  return `**** **** **** ${clean.slice(-4)}`;
};

const formatCardNumber = (value: string) => {
  const clean = value.replace(/\D/g, "").slice(0, 16);
  return clean.replace(/(.{4})/g, "$1 ").trim();
};

const CardsPage: NextPage = () => {
  const { currentUser, loading } = useAuth();
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isEditing = useMemo(() => form.id !== null, [form.id]);

  const loadCards = async () => {
    if (!currentUser?.uid) return;
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const directCards = userDocSnap.data()?.cards;
        if (Array.isArray(directCards)) {
          setCards(directCards as SavedCard[]);
          return;
        }
      }
    } catch (error) {
      // si falla lectura directa, seguimos con fallback del servicio
    }

    const saved = await userStorageService.getSavedCards(currentUser.uid, currentUser.email || undefined, true);
    setCards(saved || []);
  };

  useEffect(() => {
    if (currentUser?.uid) {
      loadCards();
    }
  }, [currentUser?.uid]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      setForm((prev) => ({ ...prev, cardNumber: formatCardNumber(value) }));
      return;
    }

    if (name === "expiry") {
      const clean = value.replace(/\D/g, "").slice(0, 4);
      const formatted = clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
      setForm((prev) => ({ ...prev, expiry: formatted }));
      return;
    }

    if (name === "cvv") {
      setForm((prev) => ({ ...prev, cvv: value.replace(/\D/g, "").slice(0, 4) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const number = form.cardNumber.replace(/\D/g, "");
    if (number.length < 13 || number.length > 16) {
      toast.error("Ingresa un numero de tarjeta valido");
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      toast.error("La fecha de expiracion debe tener formato MM/YY");
      return false;
    }

    if (!/^\d{3,4}$/.test(form.cvv)) {
      toast.error("Ingresa un CVV valido");
      return false;
    }

    if (!form.bankIdentifier) {
      toast.error("Selecciona un banco");
      return false;
    }

    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.uid) return;
    if (!validateForm()) return;

    try {
      setSaving(true);
      const ok = await userStorageService.saveCard(currentUser.uid, {
        id: form.id ?? undefined,
        alias: form.alias,
        cardNumber: form.cardNumber,
        expiry: form.expiry,
        cvv: form.cvv,
        bankIdentifier: form.bankIdentifier,
        bankName: bankNameMap[form.bankIdentifier],
      }, form.bankIdentifier, currentUser.email || undefined);

      if (!ok) {
        toast.error("No se pudo guardar la tarjeta");
        return;
      }

      toast.success(isEditing ? "Tarjeta actualizada" : "Tarjeta agregada");
      setForm(emptyForm);
      await loadCards();
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (card: SavedCard) => {
    setForm({
      id: card.id,
      alias: card.alias || "",
      cardNumber: card.cardNumber || "",
      expiry: card.expiry || "",
      cvv: card.cvv || "",
      bankIdentifier: card.bankIdentifier || "",
    });
  };

  const onDelete = async (cardId: number) => {
    if (!currentUser?.uid) return;
    const confirmed = window.confirm("Seguro que deseas eliminar esta tarjeta?");
    if (!confirmed) return;

    try {
      setDeletingId(cardId);
      const ok = await userStorageService.deleteSavedCard(currentUser.uid, cardId, currentUser.email || undefined);
      if (!ok) {
        toast.error("No se pudo eliminar la tarjeta");
        return;
      }
      toast.success("Tarjeta eliminada");
      await loadCards();
      if (form.id === cardId) {
        setForm(emptyForm);
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center p-5">Cargando...</div>;
  }

  if (!currentUser) {
    return (
      <div className="text-center p-5">
        <h4>Debes iniciar sesion para administrar tus tarjetas</h4>
        <a href="/pages/account/login" className="btn btn-normal mt-3">
          Ir a iniciar sesion
        </a>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title="mis tarjetas" parent="cuenta" />
      <section className="section-big-py-space bg-light">
        <Container>
          <Row>
            <Col lg="5" className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <h3 className="mb-3">{isEditing ? "Editar tarjeta" : "Agregar tarjeta"}</h3>
                  <Form onSubmit={onSubmit}>
                    <FormGroup>
                      <Label>Alias</Label>
                      <Input name="alias" value={form.alias} onChange={onChange} placeholder="Ejemplo: Personal o Empresa" />
                    </FormGroup>
                    <FormGroup>
                      <Label>Banco</Label>
                      <Input type="select" name="bankIdentifier" value={form.bankIdentifier} onChange={onChange}>
                        <option value="">Selecciona un banco</option>
                        <option value="cienspay">Ciens Pay</option>
                        <option value="bancobsidiana">Bancobsidiana</option>
                        <option value="creditbank">CreditBank</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label>Numero de tarjeta</Label>
                      <Input name="cardNumber" value={form.cardNumber} onChange={onChange} placeholder="0000 0000 0000 0000" />
                    </FormGroup>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label>Expiracion</Label>
                          <Input name="expiry" value={form.expiry} onChange={onChange} placeholder="MM/YY" />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>CVV</Label>
                          <Input name="cvv" value={form.cvv} onChange={onChange} placeholder="123" />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="d-flex gap-2">
                      <Button type="submit" className="btn btn-normal" disabled={saving}>
                        {saving ? "Guardando..." : isEditing ? "Actualizar tarjeta" : "Guardar tarjeta"}
                      </Button>
                      {isEditing && (
                        <Button type="button" color="secondary" onClick={() => setForm(emptyForm)}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col lg="7">
              <Card>
                <CardBody>
                  <h3 className="mb-3">Tarjetas registradas</h3>
     
                  {cards.length === 0 ? (
                    <p className="mb-0">Aun no tienes tarjetas guardadas.</p>
                  ) : (
                    <Row>
                      {cards.map((card) => (
                        <Col md="6" key={card.id} className="mb-3">
                          <div className="p-3 border rounded h-100">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <strong>{card.alias || "Tarjeta"}</strong>
                              <span className="badge bg-light text-dark">{card.bankName || bankNameMap[card.bankIdentifier || ""] || "Banco"}</span>
                            </div>
                            {card.bankIdentifier && bankCatalog[card.bankIdentifier] && (
                              <div className="mb-2 d-flex align-items-center" style={{ gap: "8px" }}>
                                <img
                                  src={bankCatalog[card.bankIdentifier].logo}
                                  alt={bankCatalog[card.bankIdentifier].name}
                                  style={{ width: `${BANK_LOGO_SIZE_SMALL}px`, height: `${BANK_LOGO_SIZE_SMALL}px`, objectFit: "contain" }}
                                />
                                <small className="text-muted">{bankCatalog[card.bankIdentifier].name}</small>
                              </div>
                            )}
                            <div className="mb-1">{maskCardNumber(card.cardNumber)}</div>
                            <small className="text-muted d-block">Exp: {card.expiry}</small>
                            <small className="text-muted d-block">CVV: ***</small>
                            <div className="mt-3 d-flex gap-2">
                              <Button size="sm" color="primary" onClick={() => onEdit(card)}>
                                Modificar
                              </Button>
                              <Button size="sm" color="danger" disabled={deletingId === card.id} onClick={() => onDelete(card.id)}>
                                {deletingId === card.id ? "Eliminando..." : "Quitar"}
                              </Button>
                              {card.bankIdentifier && bankCatalog[card.bankIdentifier]?.portal && (
                                <a
                                  href={bankCatalog[card.bankIdentifier].portal}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-outline-dark"
                                >
                                  Ir al banco
                                </a>
                              )}
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}

                  <div className="mt-4 pt-3 border-top">
                    <h5 className="mb-3">Portales bancarios</h5>
                    <Row>
                      {Object.entries(bankCatalog).map(([key, bank]) => (
                        <Col md="4" key={key} className="mb-3">
                          <div className="p-3 border rounded text-center h-100">
                            <img src={bank.logo} alt={bank.name} style={{ width: `${BANK_LOGO_SIZE_LARGE}px`, height: `${BANK_LOGO_SIZE_LARGE}px`, objectFit: "contain" }} />
                            <div className="mt-2" style={{ fontWeight: 600 }}>{bank.name}</div>
                            {bank.portal ? (
                              <a href={bank.portal} target="_blank" rel="noreferrer" className="btn btn-sm btn-normal mt-2">
                                Abrir portal
                              </a>
                            ) : (
                              <small className="d-block text-muted mt-2">Enlace pendiente</small>
                            )}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default CardsPage;
