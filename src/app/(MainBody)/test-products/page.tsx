"use client";
import React from 'react';
import { useLocalQuery, gql } from '@/hooks/useLocalQuery';
import { getImagePath } from '@/utils/imagePath';

const GET_ALL_PRODUCTS = gql`
  query getProducts($limit: Int) {
    products(limit: $limit) {
      total
      items {
        id
        title
        type
        price
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
        variables: { limit: 20 }
    });

    const clearCacheAndRefetch = () => {
        if (typeof window !== 'undefined') {
            const keys = Object.keys(localStorage).filter(k => k.startsWith('gql_cache_'));
            keys.forEach(k => localStorage.removeItem(k));
            console.log("🧹 Caché de pruebas limpiada");
            refetch();
        }
    };

    const configAudit = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Conexion_OK' : 'FALTA_CLAVE',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NO_DEFINIDO',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'OK' : 'FALTA',
    };

    return (
        <div style={{ padding: '40px', background: '#f4f4f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#333' }}>🛠 Panel de Diagnóstico de Productos</h1>
            <p>Usa esta página para validar si Firestore está enviando datos correctamente.</p>

            <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
                <h4>🕵️ Auditoría de Configuración:</h4>
                <ul style={{ fontSize: '12px' }}>
                    <li><strong>Proyecto:</strong> {configAudit.projectId}</li>
                    <li><strong>API Key:</strong> <span style={{ color: configAudit.apiKey === 'Conexion_OK' ? 'green' : 'red' }}>{configAudit.apiKey}</span></li>
                    <li><strong>Auth Domain:</strong> {configAudit.authDomain}</li>
                </ul>
                <p style={{ fontSize: '10px', color: '#856404' }}>* Si ves "FALTA" o "NO_DEFINIDO", Next.js no está leyendo tu .env.local.</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => refetch()}
                    style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    🔄 Recargar (Refetch)
                </button>
                <button
                    onClick={clearCacheAndRefetch}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    🧹 Limpiar Caché y Probar
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Estado del Hook</h3>
                    <p><strong>Loading:</strong> {loading ? '⏳ Sí' : '✅ No'}</p>
                    <p><strong>Error:</strong> {error ? `❌ ${error.message}` : '✅ Ninguno'}</p>
                    <p><strong>Total en DB:</strong> {data?.products?.total || 0}</p>
                    <hr />
                    <h4>Datos Crudos (JSON):</h4>
                    <pre style={{ maxHeight: '400px', overflow: 'auto', background: '#eee', padding: '10px', fontSize: '11px' }}>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Resultados Visuales</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                        {data?.products?.items?.map((item: any) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '10px', textAlign: 'center' }}>
                                <img
                                    src={getImagePath(item.images?.[0]?.src || "")}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <h5 style={{ margin: '10px 0 5px', fontSize: '12px' }}>{item.title}</h5>
                                <p style={{ margin: 0, fontSize: '10px', color: '#666' }}>ID: {item.id} | ${item.price}</p>
                                <span style={{ fontSize: '9px', background: '#e9ecef', padding: '2px 5px', borderRadius: '10px' }}>{item.type}</span>
                            </div>
                        ))}
                    </div>
                    {data?.products?.items?.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            📭 No hay productos en el resultado actual.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestProductsPage;
