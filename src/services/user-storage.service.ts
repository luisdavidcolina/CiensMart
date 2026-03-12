import { db } from "../config/firebase";
import { collection, doc, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";

const COLLECTIONS = {
    USER_DATA: "user_data",
    USERS: "users",
};

const getLocalCardsKey = (key: string) => `user_cards_${key}`;

const getLocalCards = (key: string) => {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(getLocalCardsKey(key));
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const setLocalCards = (key: string, cards: any[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(getLocalCardsKey(key), JSON.stringify(Array.isArray(cards) ? cards : []));
    } catch {
        // ignore localStorage write errors
    }
};

const mergeCards = (primary: any[], secondary: any[]) => {
    const map = new Map<string, any>();
    [...secondary, ...primary].forEach((card: any) => {
        const clean = String(card?.cardNumber || "").replace(/\D/g, "");
        const last4 = card?.last4 || clean.slice(-4) || "";
        const key = String(card?.id || `${last4}_${card?.expiry || ""}`);
        if (!key) return;
        map.set(key, { ...card, last4 });
    });
    return Array.from(map.values());
};

export const userStorageService = {
    _getUsersDocRefByUid: async (uid: string) => {
        const directRef = doc(db, COLLECTIONS.USERS, uid);
        const directSnap = await getDoc(directRef);
        if (directSnap.exists()) {
            return directRef;
        }

        // Legacy soporte: documentos de users creados con id aleatorio
        try {
            const q = query(collection(db, COLLECTIONS.USERS), where("uid", "==", uid), limit(1));
            const snap = await getDocs(q);
            if (!snap.empty) {
                return doc(db, COLLECTIONS.USERS, snap.docs[0].id);
            }
        } catch {
            // ignorar y usar doc directo por uid
        }

        return directRef;
    },

    _normalizeCardsFromDoc: (data: any) => {
        if (!data) return [];
        if (Array.isArray(data.cards)) return data.cards;
        if (Array.isArray(data.savedCards)) return data.savedCards;
        if (Array.isArray(data.paymentCards)) return data.paymentCards;
        return [];
    },

    /**
     * Syncs the user's wishlist to Firestore.
     */
    syncWishlist: async (uid: string, wishlistItems: any[]) => {
        try {
            const userDoc = doc(db, COLLECTIONS.USER_DATA, uid);
            await setDoc(userDoc, {
                wishlist: wishlistItems,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } catch (e) {
            console.error("Error syncing wishlist: ", e);
        }
    },

    /**
     * Retrieves the saved wishlist from Firestore.
     */
    getSavedWishlist: async (uid: string) => {
        try {
            const userDoc = doc(db, COLLECTIONS.USER_DATA, uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                return docSnap.data().wishlist || [];
            }
            return [];
        } catch (e) {
            console.error("Error fetching saved wishlist: ", e);
            return [];
        }
    },

    /**
     * Saves a payment card to the user's vault.
     */
    saveCard: async (uid: string, card: any, bankIdentifier?: string, fallbackId?: string) => {
        try {
            const userDoc = await userStorageService._getUsersDocRefByUid(uid);
            const docSnap = await getDoc(userDoc);
            let cards = [];

            if (docSnap.exists()) {
                cards = userStorageService._normalizeCardsFromDoc(docSnap.data());
            }

            cards = mergeCards(cards, getLocalCards(uid));
            if (fallbackId) {
                cards = mergeCards(cards, getLocalCards(fallbackId));
            }

            // Migracion de respaldo: si habia tarjetas legacy en user_data/{uid}, se fusionan una sola vez.
            try {
                const legacyRef = doc(db, COLLECTIONS.USER_DATA, uid);
                const legacySnap = await getDoc(legacyRef);
                if (legacySnap.exists()) {
                    const legacyCards = userStorageService._normalizeCardsFromDoc(legacySnap.data());
                    cards = mergeCards(cards, legacyCards);
                }
            } catch {
                // ignorar problemas de lectura legacy
            }

            // Prioridad de coincidencia: id (edicion), luego ultimos 4 digitos.
            const cleanCardNumber = (card.cardNumber || "").replace(/\D/g, "");
            const last4 = cleanCardNumber.slice(-4);
            const existsIndex = card.id
                ? cards.findIndex((c: any) => c.id === card.id)
                : cards.findIndex((c: any) => c.last4 === last4);

            const now = new Date().toISOString();
            const resolvedBankIdentifier = bankIdentifier || card.bankIdentifier || "";
            const bankNameMap: Record<string, string> = {
                cienspay: "Ciens Pay",
                bancobsidiana: "Bancobsidiana",
                creditbank: "CreditBank",
            };

            const cardData = {
                ...card,
                cardNumber: card.cardNumber,
                last4,
                bankIdentifier: resolvedBankIdentifier,
                bankName: bankNameMap[resolvedBankIdentifier] || card.bankName || "Banco no especificado",
                id: existsIndex >= 0 ? cards[existsIndex].id : Date.now(),
                addedAt: existsIndex >= 0 ? cards[existsIndex].addedAt : new Date().toISOString(),
                updatedAt: now
            };

            if (existsIndex >= 0) {
                // Update existing card preference
                cards[existsIndex] = cardData;
            } else {
                // Add new card
                cards.push(cardData);
            }

            await setDoc(userDoc, {
                uid,
                ...(fallbackId ? { email: fallbackId } : {}),
                cards: cards,
                updatedAt: now
            }, { merge: true });

            setLocalCards(uid, cards);
            if (fallbackId) {
                setLocalCards(fallbackId, cards);
            }
            return true;
        } catch (e) {
            console.error("Error saving card: ", e);
            // Fallback: persist locally so cards do not disappear in UI
            try {
                const localCards = mergeCards(getLocalCards(uid), []);
                const allLocalCards = fallbackId ? mergeCards(localCards, getLocalCards(fallbackId)) : localCards;
                const cleanCardNumber = (card.cardNumber || "").replace(/\D/g, "");
                const last4 = cleanCardNumber.slice(-4);
                const existsIndex = card.id
                    ? allLocalCards.findIndex((c: any) => c.id === card.id)
                    : allLocalCards.findIndex((c: any) => c.last4 === last4);
                const now = new Date().toISOString();

                const fallbackCard = {
                    ...card,
                    last4,
                    id: existsIndex >= 0 ? allLocalCards[existsIndex].id : Date.now(),
                    addedAt: existsIndex >= 0 ? allLocalCards[existsIndex].addedAt : now,
                    updatedAt: now,
                };

                if (existsIndex >= 0) {
                    allLocalCards[existsIndex] = fallbackCard;
                } else {
                    allLocalCards.push(fallbackCard);
                }

                setLocalCards(uid, allLocalCards);
                if (fallbackId) {
                    setLocalCards(fallbackId, allLocalCards);
                }
                return true;
            } catch {
                return false;
            }
        }
    },

    /**
     * Retrieves saved cards for the user.
     */
    getSavedCards: async (uid: string, fallbackId?: string, strictUidOnly: boolean = false) => {
        const localCards = fallbackId ? mergeCards(getLocalCards(uid), getLocalCards(fallbackId)) : getLocalCards(uid);
        try {
            const userDoc = await userStorageService._getUsersDocRefByUid(uid);
            const docSnap = await getDoc(userDoc);
            let cardsFromFirestore: any[] = [];

            if (docSnap.exists()) {
                cardsFromFirestore = userStorageService._normalizeCardsFromDoc(docSnap.data());
            }

            // Si hay tarjetas en Firestore, sincronizamos local y devolvemos merge robusto
            if (cardsFromFirestore.length > 0) {
                const merged = mergeCards(cardsFromFirestore, localCards);
                setLocalCards(uid, merged);
                if (fallbackId) {
                    setLocalCards(fallbackId, merged);
                }
                return merged;
            }

            if (strictUidOnly) {
                // Si no hay en users/{uid}, intentamos migrar desde user_data/{uid}
                try {
                    const legacyRef = doc(db, COLLECTIONS.USER_DATA, uid);
                    const legacySnap = await getDoc(legacyRef);
                    if (legacySnap.exists()) {
                        const legacyCards = userStorageService._normalizeCardsFromDoc(legacySnap.data());
                        if (legacyCards.length > 0) {
                            const migrated = mergeCards(legacyCards, localCards);
                            await setDoc(userDoc, { uid, ...(fallbackId ? { email: fallbackId } : {}), cards: migrated, updatedAt: new Date().toISOString() }, { merge: true });
                            setLocalCards(uid, migrated);
                            if (fallbackId) {
                                setLocalCards(fallbackId, migrated);
                            }
                            return migrated;
                        }
                    }
                } catch {
                    // ignore legacy migration failure
                }

                return mergeCards([], getLocalCards(uid));
            }

            if (fallbackId && fallbackId !== uid) {
                try {
                    const legacyDoc = doc(db, COLLECTIONS.USER_DATA, fallbackId);
                    const legacySnap = await getDoc(legacyDoc);
                    if (legacySnap.exists()) {
                        const legacyCards = userStorageService._normalizeCardsFromDoc(legacySnap.data());
                        const mergedLegacy = mergeCards(legacyCards, localCards);
                        if (mergedLegacy.length > 0) {
                            setLocalCards(uid, mergedLegacy);
                            if (fallbackId) {
                                setLocalCards(fallbackId, mergedLegacy);
                            }
                            return mergedLegacy;
                        }
                    }
                } catch {
                    // Reglas pueden bloquear docs legacy. Ignoramos y seguimos con local.
                }
            }

            return localCards;
        } catch (e) {
            console.error("Error fetching saved cards: ", e);
            return localCards;
        }
    },

    /**
     * Deletes a saved card by id.
     */
    deleteSavedCard: async (uid: string, cardId: number, fallbackId?: string) => {
        const localCards = fallbackId ? mergeCards(getLocalCards(uid), getLocalCards(fallbackId)) : getLocalCards(uid);
        const updatedLocal = localCards.filter((c: any) => c.id !== cardId);
        setLocalCards(uid, updatedLocal);
        if (fallbackId) {
            setLocalCards(fallbackId, updatedLocal);
        }

        try {
            const userDoc = await userStorageService._getUsersDocRefByUid(uid);
            const docSnap = await getDoc(userDoc);
            if (!docSnap.exists()) return true;

            const cards = userStorageService._normalizeCardsFromDoc(docSnap.data()).filter((c: any) => c.id !== cardId);
            await setDoc(userDoc, {
                cards,
                updatedAt: new Date().toISOString(),
            }, { merge: true });

            setLocalCards(uid, cards);
            if (fallbackId) {
                setLocalCards(fallbackId, cards);
            }
            return true;
        } catch (e) {
            console.error("Error deleting saved card: ", e);
            // Al menos queda eliminado en local
            return true;
        }
    }
};
