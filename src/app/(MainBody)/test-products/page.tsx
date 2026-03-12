"use client";
import React, { useMemo, useState } from "react";
import { useLocalQuery, gql } from "@/hooks/useLocalQuery";
import { getImagePath } from "@/utils/imagePath";

const GET_ALL_PRODUCTS = gql`
  query getProducts($limit: Int) {
    products(limit: $limit) {
      total
      items {
        id
        title
        type
                category
                brand
        price
                stock
        source
        images {
          src
        }
      }
    }
  }
`;

const TestProductsPage = () => {
    const { data, loading, error, refetch } = useLocalQuery(GET_ALL_PRODUCTS, {
        variables: { limit: 500 },
    });
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const allItems = data?.products?.items || [];

    const types = useMemo<string[]>(() => {
        const uniqueTypes = new Set<string>();
        allItems.forEach((item: any) => {
            uniqueTypes.add(String(item.type || "sin-tipo").toLowerCase());
        });
        return [...uniqueTypes].sort();
    }, [allItems]);

    const categories = useMemo<string[]>(() => {
        const uniqueCategories = new Set<string>();
        allItems.forEach((item: any) => {
            uniqueCategories.add(String(item.category || "sin-subcategoria").toLowerCase());
        });
        return [...uniqueCategories].sort();
    }, [allItems]);

    const filteredItems = useMemo(() => {
        return allItems.filter((item: any) => {
            const normalizedTitle = (item.title || "").toLowerCase();
            const normalizedType = (item.type || "sin-tipo").toLowerCase();
            const normalizedCategory = (item.category || "sin-subcategoria").toLowerCase();

            const matchesSearch = !search.trim() || normalizedTitle.includes(search.trim().toLowerCase());
            const matchesType = typeFilter === "all" || normalizedType === typeFilter;
            const matchesCategory = categoryFilter === "all" || normalizedCategory === categoryFilter;
            return matchesSearch && matchesType && matchesCategory;
        });
    }, [allItems, search, typeFilter, categoryFilter]);

    const clearCacheAndRefetch = () => {
        if (typeof window !== "undefined") {
            const keys = Object.keys(localStorage).filter((k) => k.startsWith("gql_cache_"));
            keys.forEach((k) => localStorage.removeItem(k));
            refetch();
        }
    };

    return (
        <div style={{ padding: "24px", background: "#f6f8fb", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ marginBottom: "8px", fontSize: "28px" }}>Cuadricula de Catalogo</h1>
            <p style={{ marginTop: 0, color: "#5f6368" }}>Vista para depurar productos y tomar screenshots.</p>

            <div style={{ background: "#ffffff", border: "1px solid #e8ecf2", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por titulo"
                        style={{ minWidth: "240px", flex: 1, padding: "9px 10px", border: "1px solid #d0d7e2", borderRadius: "8px" }}
                    />
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: "9px 10px", border: "1px solid #d0d7e2", borderRadius: "8px" }}>
                        <option value="all">Tipo: todos</option>
                        {types.map((type) => (
                            <option value={type} key={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: "9px 10px", border: "1px solid #d0d7e2", borderRadius: "8px" }}>
                        <option value="all">Subcategoria: todas</option>
                        {categories.map((category) => (
                            <option value={category} key={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => refetch()} style={{ padding: "9px 12px", borderRadius: "8px", border: "none", background: "#1c3481", color: "#fff", cursor: "pointer" }}>
                        Recargar
                    </button>
                    <button onClick={clearCacheAndRefetch} style={{ padding: "9px 12px", borderRadius: "8px", border: "none", background: "#4b5563", color: "#fff", cursor: "pointer" }}>
                        Limpiar cache
                    </button>
                </div>
                <div style={{ marginTop: "10px", fontSize: "13px", color: "#4b5563" }}>
                    Total recibido: <strong>{data?.products?.total || 0}</strong> | Mostrando: <strong>{filteredItems.length}</strong>
                </div>
                {loading && <div style={{ marginTop: "8px", color: "#1c3481" }}>Cargando productos...</div>}
                {error && <div style={{ marginTop: "8px", color: "#b42318" }}>Error: {error.message}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
                {filteredItems.map((item: any) => {
                    const imageSrc = item.images?.[0]?.src ? getImagePath(item.images[0].src) : "/images/placeholder.png";
                    return (
                        <div key={item.id} style={{ background: "#fff", border: "1px solid #e6e8ee", borderRadius: "10px", overflow: "hidden" }}>
                            <div style={{ background: "#f8fafc", height: "140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img src={imageSrc} alt={item.title || "producto"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div style={{ padding: "10px" }}>
                                <h3 style={{ margin: "0 0 8px", fontSize: "14px", lineHeight: 1.3 }}>{item.title || "Sin titulo"}</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#334155" }}>
                                    <div>
                                        <strong>Categoria:</strong> {item.type || "sin-tipo"}
                                    </div>
                                    <div>
                                        <strong>Subcategoria:</strong> {item.category || "sin-subcategoria"}
                                    </div>
                                    <div>
                                        <strong>Marca:</strong> {item.brand || "sin-marca"}
                                    </div>
                                    <div>
                                        <strong>Precio:</strong> ${item.price ?? 0}
                                    </div>
                                    <div>
                                        <strong>Stock:</strong> {item.stock ?? "n/a"}
                                    </div>
                                    <div style={{ color: "#64748b" }}>
                                        ID: {item.id} | Fuente: {item.source || "local"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!loading && !error && filteredItems.length === 0 && (
                <div style={{ marginTop: "20px", textAlign: "center", color: "#6b7280" }}>No hay productos que coincidan con los filtros.</div>
            )}
        </div>
    );
};

export default TestProductsPage;
