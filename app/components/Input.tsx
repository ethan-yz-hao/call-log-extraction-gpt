'use client'
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Icon,
    IconButton,
    Input as ChakraInput,
    List,
    ListItem,
    Text
} from '@chakra-ui/react';
import { DeleteIcon, DragHandleIcon } from '@chakra-ui/icons';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';

interface FormData {
    question: string;
    documents:  string [];
}

const Input = () => {
    const { register, control, handleSubmit, formState: { errors }, reset, trigger } = useForm<FormData>({
        defaultValues: {
            documents: [''],
        },
        mode: "onChange"
    });
    const { fields, append, remove, move } = useFieldArray({
        control,
        // @ts-ignore
        name: "documents"
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch('/submit_question_and_documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log("Data submitted successfully");
                reset();
            } else {
                throw new Error('Failed to submit data');
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        move(result.source.index, result.destination.index);
    };

    const validateUrls = async () => {
        await trigger(['documents']);
    };

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.question}>
                <FormLabel htmlFor="question">Your Question</FormLabel>
                <ChakraInput
                    id="question"
                    placeholder="Type your question here..."
                    {...register("question", {
                        required: "This field is required",
                        minLength: {
                            value: 4,
                            message: "Question must be at least 4 characters long"
                        }
                    })}
                />
                <FormErrorMessage>
                    {errors.question && errors.question.message}
                </FormErrorMessage>

                <FormLabel htmlFor="urls">Urls to Logs:</FormLabel>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="documents">
                        {(provided) => (
                            <List {...provided.droppableProps} ref={provided.innerRef}>
                                {fields.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <ListItem
                                                ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                mb={2}>
                                                <HStack spacing={2}>
                                                    <Icon as={DragHandleIcon} w={6} h={6}/>
                                                    <ChakraInput
                                                        placeholder="Enter URL here..."
                                                        {...register(`documents.${index}`, {
                                                            required: "URL is required",
                                                            pattern: {
                                                                value: /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/,
                                                                message: "Enter a valid URL"
                                                            }
                                                        })}
                                                        onBlur={validateUrls}
                                                    />
                                                    <IconButton aria-label="Delete URL" icon={<DeleteIcon />}
                                                                onClick={() => remove(index)} />
                                                </HStack>
                                                {errors.documents && errors.documents[index] && (
                                                    <Text color="red.500" fontSize="sm" mt={2}>
                                                        {errors.documents[index]?.message}
                                                    </Text>
                                                )}
                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        )}
                    </Droppable>
                </DragDropContext>
            </FormControl>

            <Button mt={4} onClick={() => append('')} colorScheme="teal">
                Add URL
            </Button>

            <Button mt={4} colorScheme="blue" type="submit" isDisabled={Object.keys(errors).length > 0}>
                Submit Question and Documents
            </Button>
        </Box>
    );
};

export default Input;
