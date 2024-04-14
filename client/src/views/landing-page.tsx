import { motion } from "framer-motion";
import { IDValidationForm } from "../components/auth/IDValidationForm";
import { VerticalBlob } from "../components/motion/VerticalBlob";
export const LandingPage = () => {
    return (
        <>
            <VerticalBlob />
            <motion.div 
            className="w-full max-w-md mx-auto"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
                {/**USER IS A USC MEMBER */}
                <IDValidationForm />
            </motion.div>
        </>
    );
};
