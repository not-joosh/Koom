import { motion, AnimatePresence } from "framer-motion";

export const TransitionBlob = () => {
    return (
        <AnimatePresence>
            <motion.div
                className='fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-zinc-900  '
                initial={{x:'100%', width: '100%'}}
                animate={{x:'0%', width: '0%'}}
                transition={{duration: 0.8, ease:'easeInOut'}}
            />
            <motion.div         
                className='fixed top-0 bottom-0 right-full w-screen h-screen z-20 bg-zinc-800'
                initial={{x:'100%', width: '100%'}}
                animate={{x:'0%', width: '0%'}}
                transition={{delay:0.2, duration: 0.8, ease:'easeInOut'}}
            />
            <motion.div
                className='fixed top-0 bottom-0 right-full w-screen h-screen z-10 bg-slate-200 '
                initial={{x:'100%', width: '100%'}}
                animate={{x:'0%', width: '0%'}}
                transition={{delay:0.4, duration: 0.8, ease:'easeInOut'}}
            />
            <motion.div 
                className='fixed top-0 bottom-0 right-full w-screen h-screen z-0 bg-slate-600'
                initial={{x:'100%', width: '100%'}}
                animate={{x:'0%', width: '0%'}}
                transition={{delay:0.6, duration: 0.8, ease:'easeInOut'}}
            />
        </AnimatePresence>
    );
};