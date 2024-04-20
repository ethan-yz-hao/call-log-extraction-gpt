import React from "react";
import {Box, Text} from "@chakra-ui/react";


const ErrorDisplay = React.memo(( { error }: { error: string }) => {
    return (
        <Box p={5}>
            <Text fontSize="xl">Error: {error}</Text>
        </Box>
    );
});

ErrorDisplay.displayName = "ErrorDisplay";

export default ErrorDisplay;