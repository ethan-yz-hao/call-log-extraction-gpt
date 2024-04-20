import React from "react";
import { GlobalData } from "@/types/global";
import {Box, Code, HStack, List, ListIcon, ListItem, Spinner, Text} from "@chakra-ui/react";
import {CheckCircleIcon} from "@chakra-ui/icons";

interface OutputDisplayProps {
    data: GlobalData;
}

const OutputDisplay = React.memo(({ data }: OutputDisplayProps) => {
    if (data.status === "processing") {
        return (
            <Box textAlign="center" my={5}>
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                <Text fontSize="xl" mt={3}>Processing...</Text>
            </Box>
        );
    }

    return (
        <Box p={5}>
            <Text fontSize="lg" mb={3}>Question: {data.question}</Text>
            <Text fontSize="lg" mb={3}>Facts:</Text>
            {data.facts.length > 0 ? (
                <List spacing={2} mb={3}>
                    {data.facts.map((fact, index) => (
                        <ListItem key={index}>
                            <HStack>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            <Code width="full">{fact}</Code>
                            </HStack>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Text>No facts available.</Text>
            )}
            <Text fontSize="lg">Status: {data.status || "Not Specified"}</Text>
        </Box>
    );
});

OutputDisplay.displayName = "OutputDisplay";

export default OutputDisplay;