import { useEffect, useState } from "react";
import { TransitionBlob } from "../components/motion/TransitionBlob";
import { useNavigate } from "react-router-dom";
import { LANDINGROUTE } from "../lib/routes";
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Stack } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "axios";
import { AdminUi } from "./admin/admin-ui";
const MotionButton = motion(Button);

export const HomePage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [dateCheckin, setDateCheckin] = useState<string>("");
    const [timeCheckin, setTimeCheckin] = useState<string>("");
    const [userType, setUserType] = useState<string>("");
    const [userID, setUserID] = useState<number>(0);

    const handleSignOut = () => {
        try {
            // Get the current time in the format HH:mm AM/PM with zero-padding for minutes
            const date = new Date();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const currentTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

            // Get the current date in the format "Month Day, Year"
            const monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            const month = monthNames[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();
            const currentDate = `${month} ${day}, ${year}`;
    
            // Create the data object to send to the backend
            const data = {
                id: localStorage.getItem('token'), // Assuming this is the attendance ID
                time_str_exit: currentTime,
                date_str_exit: currentDate
            };
    
            axios.post("http://localhost/koom/api/attendanceHandler.php?attendanceCheckout", data)
                .then((response) => {
                    console.log(response.data);
                    // Remove tokens and navigate after successful sign-out
                    localStorage.removeItem("token");
                    localStorage.removeItem("account_type");
                    localStorage.removeItem("user_id");
                    toast({
                        title: "Signed out successfully",
                        description: "You have been signed out successfully",
                        status: "success",
                        position: "top",
                        duration: 5000,
                        isClosable: true
                    });
                    navigate(LANDINGROUTE);
                })
                .catch((error) => {
                    console.error("Error signing out:", error);
                    // Handle error with toast or any other method
                    toast({
                        title: "Error signing out",
                        description: error.message,
                        status: "error",
                        duration: 5000,
                        isClosable: true
                    });
                });
        } catch (error: unknown) {
            if(error instanceof Error)
            toast({
                title: "Error signing out",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token") === null)
            navigate(LANDINGROUTE);
        if(localStorage.getItem("user_id"))
            setUserID(parseInt(localStorage.getItem("user_id")!));
        axios.get(`http://localhost/koom/api/usersHandler.php?queryID=${localStorage.getItem('user_id')}`)
            .then(response => {
                console.log(response.data);
                const { last_checkin_date, last_checkin_time } = response.data[0];
                setDateCheckin(last_checkin_date);
                setTimeCheckin(last_checkin_time);
            }).catch(error => {
                if (error instanceof Error) {
                    toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                    });
                }
            }
        );
        // Checking if admin or user
        if(localStorage.getItem("account_type") === "admin") {
            setUserType("admin");
            document.title = "KOOM | Admin Home";
        }
        else {
            setUserType("user");
            document.title = "KOOM | Home";
        }
    }, []);

    return (
        <>
            <TransitionBlob />
            {userType === "admin"? (
                <div className="center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                        <AdminUi signOut={handleSignOut}/>
                    </motion.div>
                </div>
            )
            : 
            (
                <motion.div className="flex justify-center items-center h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    <Card className="mx-auto p-6 max-w-md w-7/12">
                        <CardBody className="text-center space-y-2">
                            Checked in at
                            <div className="text-4xl font-extrabold">{dateCheckin}</div>
                            <div className="text-sm font-medium">{timeCheckin}</div>
                        </CardBody>
                        <hr className="font-bold" />
                        <CardBody className="text-center space-y-2">
                            <div className="text-2xl font-bold">ACCOUNT ID:</div>
                            <div className="text-sm font-bold">{userID}</div>
                            <div className="text-sm font-medium italic">Keep the Account ID for future logins</div>
                        </CardBody>
                        <CardFooter>
                            <div className="flex justify-end">
                                <MotionButton
                                    className="w-full !bg-red-500 hover:!bg-red-600 mr-4"
                                    whileHover={{ scale: 1.1 }}
                                    onClick={handleSignOut}
                                >
                                    Sign out
                                </MotionButton>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}
        </>
    );
};
