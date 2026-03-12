import React, { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import Breadcrumb from "../../Containers/Breadcrumb";
import { useAuth } from "@/helpers/auth/auth.context";
import { userStorageService } from "@/services/user-storage.service";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";

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
    const saved = await userStorageService.getSavedCards(currentUser.uid, currentUser.email || undefined);
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
      }, form.bankIdentifier);

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
      const ok = await userStorageService.deleteSavedCard(currentUser.uid, cardId);
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
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}
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
