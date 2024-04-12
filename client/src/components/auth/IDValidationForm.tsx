import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@chakra-ui/react";
import { FormLabel, Input, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@chakra-ui/react";
import { ConfirmationCard } from "./ConfirmationCard";

/*===============           AUTH SCHEMAS            ================*/
export const GeneralIDValidationSchema = yup.object().shape({
    usc_id_num: yup.string().required("*ID Number is required"),
});

/*===============           FORM DATA INTERFACES            ================*/
interface IDValidationFormData {
    usc_id_num: string;
};

export const IDValidationForm = () => {
    const toast = useToast();
    const [isValidUSC, setIsValidUSC] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(GeneralIDValidationSchema),
    });

    const handleIDValidationSubmit = (IDValidationData: IDValidationFormData) => {
        try {
            console.log(IDValidationData);
            setIsValidUSC(true);
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
            {!isValidUSC? (
                <motion.div className=" py-4">
                    <Card>
                        <CardBody>
                            <div className="mx-auto max-w-sm space-y-6">
                                <div className="space-y-2 text-center">
                                    <h1 className="text-3xl font-bold">USC LOGIN</h1>
                                    <p className="text-gray-500 dark:text-gray-400">Please provide your ID Number</p>
                                </div>
                                <form className="space-y-4" onSubmit={handleSubmit(handleIDValidationSubmit)}>
                                    <div className="space-y-2">
                                        <FormLabel htmlFor="email">USC ID Number</FormLabel>
                                        <Input id="email" required {...register('usc_id_num')}/>
                                    </div>
                                    <Button className="w-full" type="submit">
                                        Confirm
                                    </Button>
                                </form>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>
            )
            :
            (
               <ConfirmationCard />
            )}
        </>
    );
};