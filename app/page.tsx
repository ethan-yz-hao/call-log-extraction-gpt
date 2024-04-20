import {Heading, VStack} from "@chakra-ui/react";
import Input from "@/app/components/Input";
import Output from "@/app/components/Output";

export default function Home() {
    return (
        <main>
            <VStack>
                <Heading width="full" textAlign="center">Call Log Interpreter</Heading>
                <Input />
                <Output />
            </VStack>
        </main>
    );
}
