import { useState, useEffect } from "react";
import { TestingPage } from "./testing-page";
import { motion } from "framer-motion";
import { IDValidationForm } from "../components/auth/IDValidationForm";
export const LandingPage = () => {
    return (
        <motion.div 
        className="w-full max-w-md mx-auto"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
            {/**USER IS A USC MEMBER */}
            <IDValidationForm />
        </motion.div>
    );
};
