import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@chakra-ui/react";
import { FormLabel, Input, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@chakra-ui/react";
import { ConfirmationCard } from "./ConfirmationCard";
import axios from "axios";
import { RegistrationForm } from "./RegistrationForm";
import { useNavigate } from "react-router-dom";
import { HOMEROUTE } from "../../lib/routes";

/*===============           AUTH SCHEMAS            ================*/
export const GeneralIDValidationSchema = yup.object().shape({
    usc_id_num: yup.string().required("*ID Number is required"),
});
/*===============           FORM DATA INTERFACES            ================*/
interface IDValidationFormData {
    usc_id_num: string;
};

interface UserData {
    account_type: string;
    address: string;
    password: string;
    barangay: string;
    city: string;
    contact_number: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    middle_name: string;
    province: string;
}

export const IDValidationForm = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [isValidUSC, setIsValidUSC] = useState(false);
    const [information, setInformation] = useState<UserData | null>(null);
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(GeneralIDValidationSchema),
    });

    const handleIDValidationSubmit = async (IDValidationData: IDValidationFormData) => {
        try {
            const response = await axios.post("http://localhost/koom/api/validate.php", {
                usc_id_num: IDValidationData.usc_id_num // Sending as an object with the property
            });
    
            if (response.status === 200) {
                // USC ID is valid
                console.log(response.data);
                toast({
                    title: "Valid USC ID number",
                    description: "User found!",
                    status: "success",
                    duration: 3000,
                    position: "top",
                    isClosable: true,
                });
                
                // 20241290
                setInformation(response.data.user as UserData)
                setIsValidUSC(true);
            } else {
                // USC ID is invalid
                toast({
                    title: "Invalid USC ID number",
                    description: "User not found.",
                    status: "error",
                    duration: 3000,
                    position: "top",
                    isClosable: true,
                });
            }
        } catch (error) {
            /**@ts-ignore */
            console.error("Error validating USC ID:", error.response?.data);
            /**@ts-ignore */
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            toast({
                title: "Error validating USC ID",
                description: errorMessage,
                status: "error",
                duration: 3000,
                position: "top",
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        // Checking to see if this is their first visit or not
        const hasVisited = localStorage.getItem("hasVisited");
        if (hasVisited) {
            setIsFirstVisit(false);
        } 
        const token = localStorage.getItem("token");
        if(token)
            navigate(HOMEROUTE);
    }, [])
    
    
    return (
        <>
            {!isValidUSC && !isFirstVisit ? (
                <div className="flex justify-center items-center h-screen">
                    <motion.div className=" py-4">
                        <Card>
                            <CardBody>
                                <div className="mx-auto max-w-sm space-y-6">
                                    <div className="space-y-2 text-center">
                                        <h1 className="text-3xl font-bold">TAP IN</h1>
                                        <p className="text-gray-500 dark:text-gray-400">Welcome back!</p>
                                    </div>
                                    <form className="space-y-4" onSubmit={handleSubmit(handleIDValidationSubmit)}>
                                        <div className="space-y-2">
                                            <FormLabel htmlFor="email">USC ID Number</FormLabel>
                                            <Input id="email" required {...register('usc_id_num')} />
                                        </div>
                                        <Button className="w-full" type="submit">
                                            Confirm
                                        </Button>
                                    </form>
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                </div>
            ) 
            : 
            (
                <>
                    {!isFirstVisit && isValidUSC ? (
                        // If the user is not new and the USC ID is valid, show the confirmation card
                        <>
                            {/*@ts-ignore*/}
                            <ConfirmationCard RetrievedData={information} />
                        </>
                    ) : (
                        <RegistrationForm />
                    )}
                </>
            )}
        </>
    );
}    