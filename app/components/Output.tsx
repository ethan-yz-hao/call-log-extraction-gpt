'use client'
import React, { useEffect, useState } from 'react';
import { Text } from '@chakra-ui/react';
import DataDisplay from "@/app/components/DataDisplay";
import ErrorDisplay from "@/app/components/ErrorDisplay";

const Output = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Initially true for first fetch

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (!loading) setLoading(true);
            try {
                const response = await fetch('/get_question_and_facts');
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                const responseError = await fetch('/get_error');
                if (!responseError.ok) {
                    const error = await responseError.json();
                    throw new Error(error.message);
                }
                const result = await response.json();
                if (isMounted) {
                    setData(result);
                    setLoading(false);
                    setError('');
                }
            } catch (err: unknown) {
                if (isMounted) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError('An unexpected error occurred');
                    }
                    setLoading(false);
                }
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000); // Fetch every 1 second
        return () => {
            clearInterval(interval);
            isMounted = false;
        };
    }, []);

    return (
        <div>
            <Text fontSize="xl" fontWeight="semibold" mb={2}>
                Output:
            </Text>
            {loading ? (
                <Text fontSize="lg">Loading...</Text>
            ) : error ? (
                <ErrorDisplay error={error} />
            ) : (
                data && <DataDisplay data={data} />
            )}
        </div>
    );
};
export default Output;