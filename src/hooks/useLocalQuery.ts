import { useState, useEffect } from 'react';
import { localDataService } from '../services/localData.service';

export const useLocalQuery = (query: any, options: any) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const fetchData = async (queryVariables: any) => {
        setLoading(true);
        try {
            // Minimal AST parsing to determine what data to fetch
            // We assume the query name or the first selection field tells us what to get
            const selection = query.definitions[0].selectionSet.selections[0].name.value;

            let result = null;

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            switch (selection) {
                case 'products':
                    result = {
                        products: localDataService.getProducts(queryVariables)
                    };
                    break;
                case 'collection':
                    result = {
                        collection: localDataService.getCollection(queryVariables.collection)
                    };
                    break;
                case 'relatedProducts':
                    result = {
                        relatedProducts: localDataService.getRelatedProducts(queryVariables.type, queryVariables.id)
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
        // Initial fetch
        if (options && options.variables) {
            fetchData(options.variables);
        }
    }, [JSON.stringify(options?.variables)]); // Deep compare variables

    const fetchMore = async (fetchMoreOptions: any) => {
        // Implement fetchMore logic for pagination
        // This usually returns a promise with the new data
        const newVariables = { ...options.variables, ...fetchMoreOptions.variables };

        // We reuse the main fetch logic but we need to return the result for the caller to merge
        // The caller in Collection.tsx uses updateQuery callback.

        setLoading(true);
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const selection = query.definitions[0].selectionSet.selections[0].name.value;
        let newData: any = null;

        if (selection === 'products') {
            const result = localDataService.getProducts(newVariables);
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
