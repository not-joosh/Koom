/*===============           DEPENDENCIES            ===============*/
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Input, FormLabel, Card, CardBody} from "@chakra-ui/react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


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
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(GeneralRegistrationSchema),
    });

    const handleRegistrationSubmit = (RegistrationData: RegistrationFormData) => {
        try {
            // We will send the form to our PHP SQL backend, then we will register the user.
            axios.post(registerAuthURL, RegistrationData);
            let isSuccess = false;
            axios.post(registerAuthURL, RegistrationData).then((response) => {
                console.log(response.data);
                // response can be can be "success" or "failed". we will handle this and throw error
                if (response.data === "success") {
                    isSuccess = true;
                }
            });

            if(isSuccess === false) {
                throw new Error("Registration failed. Please try again.");
            }

            //going to use the contact number to now grab their id and then return it here
            let userId = "";
            axios.get(`http://localhost/pdo/api/usersHandler.php?queryContactNumber=${RegistrationData.contact_number}`).then((response) => {
                // the userId is an object, so i will just need to get the thing "id"
                console.log(response.data);
                // storing the response.data[0].id into userId
                // localStorage.setItem(response.data[0].id; <--- this is what i want to do
                localStorage.setItem("token", response.data[0].id);
            });
            toast({
                title: "Registration successful",
                description: "You have successfully registered",
                status: "success",
                duration: 5000,
                position: 'top',
                isClosable: true,
            });
            // Setting local storage to say the user has logged in
            localStorage.setItem("isAuthenticated", "true");

            // renavigate them to homepage after
            navigate(HOMEROUTE);
        } catch (error: unknown) {
            if(error instanceof Error) {
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