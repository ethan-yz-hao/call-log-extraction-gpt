import {VStack, Heading, Box, Card} from '@chakra-ui/react';
import Input from "@/app/components/Input";
import Output from "@/app/components/Output";

export default function Home() {
    return (
        <Box as="main" minHeight="100vh" display="flex" alignItems="start" justifyContent="center">
            <VStack
                spacing={4}
                width="80%"  // Set width to 80% of the viewport width
                maxW="none"  // Remove the max width restriction
                px={5}
                py={8}
            >
                <Heading size="lg" textAlign="center">
                    Call Log Interpreter
                </Heading>
                <Card p={4} width="100%">
                    <Input/>
                </Card>
                <Card p={4} width="100%">
                    <Output/>
                </Card>
            </VStack>
        </Box>
    );
}
