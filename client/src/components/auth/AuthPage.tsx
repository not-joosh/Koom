import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HOMEROUTE } from "../../lib/routes";

export const AuthPage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isGuest, setIsGuest] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        // First we should check if they are already logged in
        // If they are, redirect them to the home page
        // If they are not, show the login form
        const token = localStorage.getItem("token");
        if (token) {
            navigate(HOMEROUTE);
        }
    }, []);

    const handleAuthSelection = () => {
        try {

        } catch(error: Error) {
            console.error(error);
        };
    };

    return (
        <div>
            
            {isSigningUp ? (
                <div>
                    <h1>Register Form</h1>
                </div>
            )
            :
            (
                <div>
                    <h1>Login Form</h1>
                </div>
            )}
        </div>
    );
};