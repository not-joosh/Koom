import { useState, useEffect } from "react";
import { TestingPage } from "./testing-page";
export const LandingPage = () => {
    return (
        <div>
            <TestingPage isQuery = {false} query = {""}/>
        </div>
    );
};
