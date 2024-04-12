import { useState, useEffect } from "react";
import { UserType } from "../lib/types";
import { motion } from "framer-motion";
import axios from "axios";
import { LoginForm } from "../components/auth/LoginForm";


export const TestingPage = () => {
    const [data, setData] = useState([] as UserType[]);
    const [isMounted, setIsMounted] = useState(false);


    return (
        <LoginForm />
    );
};
