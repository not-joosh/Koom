
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@chakra-ui/react";
import { FormLabel, Input, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@chakra-ui/react";

/*===============           AUTH SCHEMAS            ================*/
export const ConfirmationCardSchema = yup.object().shape({
    password: yup.string().required("*ID Number is required"),
});

/*===============           FORM DATA INTERFACES            ================*/
interface ConfirmationFormData {
    password: string;
};

export const ConfirmationCard = (password: string) => {
    const toast = useToast();
    const [isValidUSC, setIsValidUSC] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(ConfirmationCardSchema),
    });

    const handleConfirmationSubmit = (ConfirmationFormData: ConfirmationFormData) => {
        try {
            // We will firstly try to see if that login is correct by sending a request to the server.
            console.log(ConfirmationFormData);

        } catch(error: unknown) {
            if(error instanceof Error) {
                toast({
                    title: "An error occurred.",
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            };
        };
    };
    
    return (
        <>
            <motion.div className=" py-4">
                <Card> {/*THIS PART, we are just wating for the user to confirm, then we will continue */}
                    <CardBody>
                        <div className="mx-auto max-w-sm space-y-6">
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl font-bold">CONFIRMATION</h1>
                                <p className="text-gray-500 dark:text-gray-400">Please provide your ID Number</p>
                            </div>
                            <form className="space-y-4" onSubmit={handleSubmit(handleConfirmationSubmit)}>
                                <div className="space-y-2">
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Input className = ' bg-red-300' id="password" required type="password" {...register('password')} />
                                </div>
                                <Button className="w-full" type="submit">
                                    Confirm
                                </Button>
                            </form>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>
        </>
    );
};