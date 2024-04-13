import { useEffect, useState } from "react";
import { TransitionBlob } from "../components/motion/TransitionBlob";
import { useNavigate } from "react-router-dom";
import { LANDINGROUTE } from "../lib/routes";
export const HomePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "KOOM | Home";
        // Checking local storage to see if they are authenthicated
        // if not, redirect to landing page
        if (localStorage.getItem("token") === null)
            navigate(LANDINGROUTE);
    }, []);
    return (
        <>
            <TransitionBlob />
            <div>
                <h1>Home Page</h1>
            </div>
        </>
    );
};