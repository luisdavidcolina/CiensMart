import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebase.service';

/**
 * Lightweight mock for gql tag to avoid @apollo/client dependency.
 * Extracts the first selection name from the query string.
 */
export const gql = (strings: any, ...values: any) => {
    const queryStr = typeof strings === 'string' ? strings : strings[0];
    // Very simple regex to find the first field name after '{'
    const match = queryStr.match(/{\s*(\w+)/);
    const selection = match ? match[1] : "unknown";

    return {
        isMockGql: true,
        selection: selection,
        // Legacy path support for useLocalQuery
        definitions: [{
            selectionSet: {
                selections: [{
                    name: { value: selection }
                }]
            }
        }]
    };
};

export const useLocalQuery = (query: any, options?: any) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(undefined);
    const [error, setError] = useState<any>(null);

    const fetchData = async (queryVariables: any) => {
        const selection = query.selection || query.definitions[0].selectionSet.selections[0].name.value;
        const cacheKey = `gql_cache_${selection}_${JSON.stringify(queryVariables)}`;

        // 1. Check Cache First (for instant UI)
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    console.log(`📦 [useLocalQuery] Cache Hit for '${selection}'`);
                    setData(parsed);
                    setLoading(false); // Immediate data, no spinner
                } catch (e) {
                    console.warn("Failed to parse cache", e);
                }
            }
        }

        // 2. Fetch from Network
        try {
            let result = null;

            console.log(`📡 [useLocalQuery] Intercepting network for: '${selection}'`, {
                variables: queryVariables
            });

            // Fetch from Firestore via firebaseService
            switch (selection) {
                case 'products':
                    const productsResult = await firebaseService.getProducts(queryVariables);
                    result = {
                        products: productsResult
                    };
                    break;
                case 'product':
                    const singleProduct = await firebaseService.getProductById(queryVariables?.id);
                    result = {
                        product: singleProduct
                    };
                    break;
                case 'collection':
                    const collectionResult = await firebaseService.getProducts({ ...queryVariables, limit: 100 });
                    result = {
                        collection: collectionResult.items
                    };
                    break;
                case 'relatedProducts':
                    const relatedResult = await firebaseService.getProducts({ type: queryVariables?.type, limit: 6 });
                    result = {
                        relatedProducts: relatedResult.items
                    };
                    break;
                case 'currency':
                    result = {
                        currency: [
                            { currency: 'USD', symbol: '$', value: 1.0 },
                            { currency: 'EUR', symbol: '€', value: 0.92 },
                            { currency: 'GBP', symbol: '£', value: 0.78 },
                            { currency: 'INR', symbol: '₹', value: 83.0 },
                        ]
                    };
                    break;
                default:
                    console.warn(`useLocalQuery: Unknown selection '${selection}'`);
                    break;
            }

            if (result) {
                setData(result);
                // Update Cache
                if (typeof window !== 'undefined') {
                    localStorage.setItem(cacheKey, JSON.stringify(result));
                }
            }
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // If no options or no variables, just fetch once
        if (!options || !options.variables) {
            fetchData({});
        } else {
            fetchData(options.variables);
        }
    }, [JSON.stringify(options?.variables)]);

    const fetchMore = async (fetchMoreOptions: any) => {
        const variables = options?.variables || {};
        const newVariables = { ...variables, ...fetchMoreOptions.variables };

        setLoading(true);
        const selection = query.selection || query.definitions[0].selectionSet.selections[0].name.value;
        let newData: any = null;

        if (selection === 'products') {
            const result = await firebaseService.getProducts(newVariables);
            newData = { products: result };
        }

        if (fetchMoreOptions.updateQuery && newData) {
            const mergedData = fetchMoreOptions.updateQuery(data, { fetchMoreResult: newData });
            setData(mergedData);
        }

        setLoading(false);
        return { data: newData };
    };

    return {
        loading,
        data,
        error,
        fetchMore,
        refetch: (newVariables?: any) => fetchData(newVariables || options?.variables || {})
    };
};
