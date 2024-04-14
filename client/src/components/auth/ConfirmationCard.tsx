
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@chakra-ui/react";
import { FormLabel, Input, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HOMEROUTE } from "../../lib/routes";

/*===============           AUTH SCHEMAS            ================*/
export const ConfirmationCardSchema = yup.object().shape({
    password: yup.string().required("*ID Number is required"),
});

/*===============           FORM DATA INTERFACES            ================*/
interface ConfirmationFormData {
    password: string;
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

export const ConfirmationCard = (RetrievedData: UserData) => {
    const toast = useToast();
    const navigate = useNavigate();
    const [isValidUSC, setIsValidUSC] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(ConfirmationCardSchema),
    });

    const handleConfirmationSubmit = async (ConfirmationFormData: ConfirmationFormData) => {
        try {
            const date = new Date();
            const month = date.toLocaleString("default", { month: "long" });
            const day = date.getDate();
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
            const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
            const time = `${formattedHours}:${paddedMinutes} ${ampm}`;
    
            const confirmationData = {
                ...RetrievedData,
                password: ConfirmationFormData.password,
                day_entered: day,
                month_entered: month,
                year_entered: year,
                time_str_entered: time
            };
    
            // console.log(confirmationData)
            const response = await axios.post("http://localhost/koom/api/confirmlogin.php", confirmationData);
            if (response.status === 200 && response.data.message === "Login successful" && response.data.user) {
                // Store attendence_id as token and account_type in localStorage
                console.log(response.data.user)
                localStorage.setItem("token", response.data.attendance_id);
                localStorage.setItem("account_type", response.data.user.account_type);
                localStorage.setItem("user_id", response.data.user.id);
                
                // Show success toast
                toast({
                    title: "Login successful",
                    description: "Welcome back!",
                    status: "success",
                    duration: 5000,
                    position: 'top',
                    isClosable: true,
                });
                
                // Redirect the user to the home page or perform any other action
                navigate(HOMEROUTE);
            } else {
                if (response.status === 401 && response.data.message === "Invalid credentials") {
                    // Show error message for incorrect password
                    toast({
                        title: "Error logging in",
                        description: "Incorrect password. Please try again.",
                        status: "error",
                        duration: 5000,
                        position: 'top',
                        isClosable: true,
                    });
                } else {
                    // Show error message for other errors
                    toast({
                        title: "Error logging in",
                        description: "An error occurred. Please try again.",
                        status: "error",
                        duration: 5000,
                        position: 'top',
                        isClosable: true,
                    });
                }
            }
        } catch (error: unknown) {
            // Handle any other error
            toast({
                title: "An error occurred.",
                description: "Incorrect password. Please try again.",
                status: "error",
                duration: 5000,
                position: 'top',
                isClosable: true,
            });
        }
    };
    
    
    return (
        <div className="flex justify-center items-center h-screen">
            <motion.div className="py-4"                             
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scaleX: 0, scaleY: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card> {/*THIS PART, we are just wating for the user to confirm, then we will continue */}
                    <CardBody>
                        <div className="mx-auto max-w-md space-y-6 w-72 md:w-96"> {/* Increase max-w-md for wider card */}
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl font-bold">CONFIRMATION</h1>
                                <p className="text-gray-500 dark:text-gray-400">Is this you?</p>
                                <div className="text-center ">
                                    <div className="flex">
                                        {/*@ts-ignore*/}
                                        <p className="font-bold inline">First Name:</p>
                                        {/*@ts-ignore*/}
                                        <span className="italic ml-2">{RetrievedData.RetrievedData.first_name}</span> {/* Add italic class */}
                                    </div>
                                    <div className="flex">
                                        {/*@ts-ignore*/}
                                        <p className="font-bold inline">Middle Name:</p>
                                        {/*@ts-ignore*/}
                                        <span className="italic ml-2">{RetrievedData.RetrievedData.middle_name}</span> {/* Add italic class */}
                                    </div>
                                    <div className="flex">
                                        {/*@ts-ignore*/}
                                        <p className="font-bold inline">Last Name:</p>
                                        {/*@ts-ignore*/}
                                        <span className="italic ml-2">{RetrievedData.RetrievedData.last_name}</span> {/* Add italic class */}
                                    </div>
                                    <div className="flex">
                                        {/*@ts-ignore*/}
                                        <p className="font-bold inline">Address:</p>
                                        {/*@ts-ignore*/}
                                        <span className="italic ml-2">{RetrievedData.RetrievedData.address}</span> {/* Add italic class */}
                                    </div>
                                    <div className="flex">
                                        {/*@ts-ignore*/}
                                        <p className="font-bold inline">Barangay:</p>
                                        {/*@ts-ignore*/}
                                        <span className="italic ml-2">{RetrievedData.RetrievedData.barangay}</span> {/* Add italic class */}
                                    </div>
                                    <div className="flex">
                                        {/*@ts-ignore*/}
                                        <p className="font-bold inline">City:</p>
                                        {/*@ts-ignore*/}
                                        <span className="italic ml-2">{RetrievedData.RetrievedData.city}</span> {/* Add italic class */}
                                    </div>
                                    <div className="flex">
                                        {/*@ts-ignore*/}
                                        <p className="font-bold inline">Province:</p>
                                        {/*@ts-ignore*/}
                                        <span className="italic ml-2">{RetrievedData.RetrievedData.province}</span> {/* Add italic class */}
                                    </div>
                                    <div className="flex">
                                        {/*@ts-ignore*/}
                                        <p className="font-bold inline">Contact Number:</p>
                                        {/*@ts-ignore*/}
                                        <span className="italic ml-2">{RetrievedData.RetrievedData.contact_number}</span> {/* Add italic class */}
                                    </div>
                                    <div className="flex">
                                        {/*@ts-ignore*/}
                                        <p className="font-bold inline">Email:</p>
                                        {/*@ts-ignore*/}
                                        <span className="italic ml-2">{RetrievedData.RetrievedData.email}</span> {/* Add italic class */}
                                    </div>
                                </div>


                            </div>
                            <form className="space-y-4" onSubmit={handleSubmit(handleConfirmationSubmit)}>
                                <div className="space-y-2">
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Input className='bg-red-300' id="password" required type="password" {...register('password')} />
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    whileFocus={{ scale: 1.02 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Button className="w-full" type="submit">
                                        Confirm
                                    </Button>
                                </motion.div>
                            </form>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
};