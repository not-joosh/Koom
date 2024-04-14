/*===============           DEPENDENCIES            ===============*/
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Input, FormLabel, Card, CardBody} from "@chakra-ui/react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

/*===============           BACKEND NECESSITIES            ================*/
import axios from "axios";
import { registerAuthURL } from "../../lib/apiConfig";
import { HOMEROUTE } from "../../lib/routes";

/*===============           AUTH SCHEMAS            ================*/
export const GeneralRegistrationSchema = yup.object().shape({
    first_name: yup.string().required("*First Name is required"),
    middle_name: yup.string().required("*Middle Name is required"),
    last_name: yup.string().required("*Last Name is required"),
    email: yup.string().email("*Must be a valid email").required("*Email is required"),
    contact_number: yup.string().required("*Contact Number is required"),
    address: yup.string().required("*Address is required"),
    city: yup.string().required("*City is required"),
    barangay: yup.string().required("*Barangay is required"),
    province: yup.string().required("*Province is required"),
    password: yup.string().min(6, "*Passwords are at least 6 Characters.").required("*Password is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match...").required("Please confirm your password..."),
});

/*===============           FORM DATA INTERFACES            ================*/
export interface RegistrationFormData {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    address: string;
    city: string;
    barangay: string;
    province: string;
    password: string;
    confirmPassword: string;
};

export const RegistrationForm = () => {
    const toast = useToast();
    const isSuccessful = useRef(false);
    const isUnique = useRef(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(GeneralRegistrationSchema),
    });

    const handleRegistrationSubmit = (RegistrationData: RegistrationFormData) => {
        try {
            isSuccessful.current = false;
            const date = new Date();
            const month = date.toLocaleString("default", { month: "long" });
            const day = date.getDate();
            const year = date.getFullYear();
            const hours = date.getHours();
            let minutes = date.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

            // Zero-padding for minutes less than 10
            const minutesNumber = Number(minutes); // Convert minutes to a number
            const paddedMinutes = minutesNumber < 10 ? `0${minutesNumber}` : minutesNumber.toString();
            
            const time = `${formattedHours}:${paddedMinutes} ${ampm}`;
            const attendanceData = {
                user: { RegistrationData },
                day_entered: day,
                month_entered: month,
                year_entered: year,
                time_str_entered: time
            };
    
            // Make both Axios calls
            const emailCheck = axios.get(`http://localhost/koom/api/usersHandler.php?queryEmail=${RegistrationData.email}`);
            const contactCheck = axios.get(`http://localhost/koom/api/usersHandler.php?queryContactNumber=${RegistrationData.contact_number}`);

            // Wait for both requests to complete
            Promise.all([emailCheck, contactCheck])
                .then((responses) => {
                    const emailResponse = responses[0].data;
                    const contactResponse = responses[1].data;
    
                    console.log(emailResponse);
                    console.log(contactResponse);
    
                    if (emailResponse.length === 0 && contactResponse.length === 0) {
                        // Both email and contact number are unique
                        isUnique.current = true;
                    } else {
                        // Either email or contact number is already in use
                        isUnique.current = false;
                    }
    
                    if (!isUnique.current) {
                        throw new Error("The email or contact number is already in use. Please try again.");
                    }
    
                    // Proceed with registration
                    return axios.post(registerAuthURL, attendanceData);
                })
                .then((response) => {
                    console.log(response.data);
    
                    // Handle registration success
                    console.log(typeof response.data);
                    console.log("success" === response.data);
    
                    // After successful registration, get the user ID
                    return axios.get(`http://localhost/koom/api/usersHandler.php?queryContactNumber=${RegistrationData.contact_number}`);
                })
                .then((response) => {
                    // Store the user ID in localStorage
                    localStorage.setItem("token", response.data[0].id);
                    // Notify user of successful registration
                    toast({
                        title: "Registration successful",
                        description: "You have successfully registered",
                        status: "success",
                        duration: 5000,
                        position: 'top',
                        isClosable: true,
                    });
    
                    // Submit attendance data
                    console.log("Attendance data:", attendanceData);
                    return axios.post(`http://localhost/koom/api/attendanceHandler.php?attendanceInitialize`, attendanceData);
                })
                .then((attendanceResponse) => {
                    console.log("Attendance submitted:", attendanceResponse.data);
                    // Redirect user to homepage
                    navigate(HOMEROUTE);
                })
                .catch((error) => {
                    // Handle any errors
                    toast({
                        title: "Registration failed",
                        description: error.message,
                        status: "error",
                        duration: 5000,
                        position: 'top',
                        isClosable: true,
                    });
                });
        } catch (error: unknown) {
            if (error instanceof Error)
                toast({
                    title: "Registration failed",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    position: 'top',
                    isClosable: true,
                });
        }
    };
    

    useEffect(() => {

    }, []);
    return (
        <motion.div className=" py-4">
            <Card>
                <CardBody>
                    <div className="mx-auto max-w-sm space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold">Register</h1>
                            <p className="text-gray-500 dark:text-gray-400">Enter your information to create an account</p>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit(handleRegistrationSubmit)}>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <FormLabel htmlFor="first-name">First name</FormLabel>
                                    <Input id="first-name" placeholder="John" required {...register('first_name')}/>
                                </div>
                                <div className="space-y-2">
                                    <FormLabel htmlFor="middle-name">Middle name</FormLabel>
                                    <Input id="middle-name" placeholder="Doe" required {...register('middle_name')} />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel htmlFor="last-name">Last name</FormLabel>
                                    <Input id="last-name" placeholder="Smith" required {...register('last_name')}/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input id="email" placeholder="m@example.com" required type="email" {...register('email')}/>
                            </div>
                            <div className="space-y-2">
                                <FormLabel htmlFor="contact-number">Contact number</FormLabel>
                                <Input id="contact-number" placeholder="+639123456789" required {...register('contact_number')}/>
                            </div>
                            <div className="space-y-2">
                                <FormLabel htmlFor="address">Address</FormLabel>
                                <Input id="address" placeholder="1234 Elm Street" required {...register('address')}/>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <FormLabel htmlFor="city">City</FormLabel>
                                    <Input id="city" placeholder="City" required {...register('city')}/>
                                </div>
                                <div className="space-y-2">
                                    <FormLabel htmlFor="barangay">Barangay</FormLabel>
                                    <Input id="barangay" placeholder="Barangay" required {...register('barangay')}/>
                                </div>
                                <div className="space-y-2">
                                    <FormLabel htmlFor="province">Province</FormLabel>
                                    <Input id="province" placeholder="Province" required {...register('province')}/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <Input id="password" required type="password" {...register('password')}/>
                            </div>
                            <div className="space-y-2">
                                <FormLabel htmlFor="confirm-password">Confirm password</FormLabel>
                                <Input id="confirm-password" required type="password" {...register('confirmPassword')}/>
                            </div>
                            <Button className="w-full" type="submit">
                                Register
                            </Button>
                        </form>
                    </div>
                </CardBody>
            </Card>
        </motion.div>
    );
};