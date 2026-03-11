import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebase.service';

export const useLocalQuery = (query: any, options: any) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const fetchData = async (queryVariables: any) => {
        setLoading(true);
        try {
            const selection = query.definitions[0].selectionSet.selections[0].name.value;
            let result = null;

            // We use Firebase service instead of localDataService
            switch (selection) {
                case 'products':
                    const productsResult = await firebaseService.getProducts(queryVariables);
                    result = {
                        products: productsResult
                    };
                    break;
                case 'product': // Added case for single product
                    const singleProduct = await firebaseService.getProductById(queryVariables.id);
                    result = {
                        product: singleProduct
                    };
                    break;
                case 'collection':
                    // Map collection to a query in Firebase (simplified as all products for now)
                    const collectionResult = await firebaseService.getProducts({ ...queryVariables, limit: 100 });
                    result = {
                        collection: collectionResult.items
                    };
                    break;
                case 'relatedProducts':
                    const relatedResult = await firebaseService.getProducts({ type: queryVariables.type, limit: 6 });
                    result = {
                        relatedProducts: relatedResult.items
                    };
                    break;
                default:
                    console.warn(`useLocalQuery: Unknown query selection '${selection}'`);
                    break;
            }

            setData(result);
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (options && options.variables) {
            fetchData(options.variables);
        } else {
            setLoading(false);
        }
    }, [JSON.stringify(options?.variables)]);

    const fetchMore = async (fetchMoreOptions: any) => {
        const newVariables = { ...options.variables, ...fetchMoreOptions.variables };

        setLoading(true);
        const selection = query.definitions[0].selectionSet.selections[0].name.value;
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
        refetch: (newVariables?: any) => fetchData(newVariables || options.variables)
    };
};
