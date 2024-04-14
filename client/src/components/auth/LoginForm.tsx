// import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"

/*===============           DEPENDENCIES            ===============*/
import { Card, CardBody, CardFooter, CardHeader, Input, FormLabel, Button, Link} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HOMEROUTE } from "../../lib/routes";
import { RegistrationForm } from "./RegistrationForm";
import * as yup from "yup"; 
import { yupResolver } from "@hookform/resolvers/yup"; 
import { useForm } from "react-hook-form"; 
import { useToast } from "@chakra-ui/react";
import { IDValidationForm } from "./IDValidationForm";
import axios from "axios";

/*===============           AUTH SCHEMAS            ================*/

export const GeneralLoginSchema = yup.object().shape({
    email: yup.string().email("*Must be a valid email").required("*Email is required"),
    password: yup.string().min(6, "*Passwords are at least 6 Characters.").required("*Password is required"),
});

export const USCLoginSchema = yup.object().shape({
    usc_id_num: yup.string().min(6, "*Student Number is at least 6 Characters.").required("*Student Number is required"),
    password: yup.string().min(6, "*Passwords are at least 6 Characters.").required("*Password is required"),
});

/*===============           FORM DATA INTERFACES            ================*/
export interface GeneralLoginFormData {
    email: string;
    password: string;
};

export interface USCLoginFormData {
    usc_id_num: string;
    password: string;
};

export const LoginForm = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [isSignup, setIsSignup] = useState(false);
    const [isUSC, setIsUSC] = useState(false);
    const [isValidUSC, setIsValidUSC] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(GeneralLoginSchema),
    });

    const handleLoginSubmit = (GeneralLoginData: GeneralLoginFormData) => {
        try {
            axios.post("http://localhost/koom/api/loginAuthHandler.php", GeneralLoginData)
                .then((response) => {
                    console.log(response.data);
    
                    // Check if login was successful
                    if (response.data.message === "Login successful" && response.data.user) {
                        // Store the user data in localStorage (except password)
                        localStorage.setItem("userID", response.data.user.id);
                        localStorage.setItem("user", JSON.stringify(response.data.user));
    
                        // Redirect the user to the home page or perform any other action
                        // navigate(HOMEROUTE);
    
                        // Show success message
                        toast({
                            title: "Login successful",
                            description: "Welcome back!",
                            status: "success",
                            duration: 5000,
                            position: 'top',
                            isClosable: true,
                        });
                    } else {
                        // Show error message
                        toast({
                            title: "Error logging in",
                            description: "Invalid credentials. Please try again.",
                            status: "error",
                            duration: 9000,
                            position: 'top',
                            isClosable: true,
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error logging in:", error.response?.data);
                    // Handle error with toast or any other method
                    const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
                    toast({
                        title: "Error logging in",
                        description: errorMessage,
                        status: "error",
                        duration: 9000,
                        position: 'top',
                        isClosable: true,
                    });
                });
            console.log(GeneralLoginData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: "An error occurred.",
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    position: 'top',
                    isClosable: true,
                });
            }
        }
    };
    

    useEffect(() => {
        // First we should check if they are already logged in
        // If they are, redirect them to the home page
        // If they are not, show the login form
        const token = localStorage.getItem("token");
        if (token) {
            navigate(HOMEROUTE);
        }
    }, []);

    return (
        <motion.div
            key="1"
            className="flex items-center min-h-screen px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/**USER IS NOT A USC MEMBER NOR REGISTERED */}
            {!isSignup && !isUSC? (
                <motion.div
                    className="w-full max-w-sm mx-auto"
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <Card>
                        <CardHeader className="space-y-2 text-center">
                            <h1 className="text-3xl">TAP IN</h1>
                            <CardBody>University of San Carlos </CardBody>
                        </CardHeader>
                        <form onSubmit={handleSubmit(handleLoginSubmit)}> {/**LOGIN FORM FOR GUESTS */}
                            <CardBody className="space-y-4">
                                <div className="space-y-2">
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <Input id="email" placeholder="m@example.com" required type="email" {...register('email')}/>
                                </div>
                                <div className="space-y-2">
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Input id="password" required type="password" {...register('password')} />
                                </div>
                                <Button type = "submit" className="w-full">Sign in</Button>
                            </CardBody>
                            </form>
                  
                        <CardFooter className="flex flex-col space-y-4">
                            <div className="text-center text-sm">
                                <span className="!text-sky-800" >
                                    Don't Have an account? <Link onClick={() => setIsSignup(true)} className = "!text-blue-500">Register</Link>
                                </span><br />
                                <span className="!text-sky-800">
                                    Associated to USC? <Link onClick={() => setIsUSC(true)} className="!text-red-600">Continue Here</Link>
                                </span>
                            </div>
                        </CardFooter>

                    </Card>

                </motion.div>
            )
            : 
            (
                <>
                    {isSignup && !isUSC? ( 
                        <motion.div 
                        className="w-full max-w-md mx-auto"
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/**USER WANTS TO REGISTER BUT NOT AS A USC MEMBER */}
                            <RegistrationForm />
                        </motion.div>
                    )
                    :
                    ( 
                        <motion.div 
                        className="w-full max-w-md mx-auto"
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}>
                            {/**USER IS A USC MEMBER */}
                            <IDValidationForm />
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
  );
};