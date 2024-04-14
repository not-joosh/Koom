import { AnimatePresence, motion } from "framer-motion";
export const VerticalBlob = () => {
    return (
        <AnimatePresence>
            <motion.div
                className='fixed bottom-full right-0 left-0 w-screen h-screen z-20 bg-slate-600'
                initial={{y:'100%', height: '100%'}}
                animate={{y:'0%', height: '0%'}}
                transition={{delay:0.6, duration: 0.8, ease:'easeInOut'}}
            />
            <motion.div
                className='fixed bottom-full right-0 left-0 w-screen h-screen z-30  bg-slate-200'
                initial={{y:'100%', height: '100%'}}
                animate={{y:'0%', height: '0%'}}
                transition={{delay:0.4, duration: 0.8, ease:'easeInOut'}}
            />
            <motion.div         
                className='fixed bottom-full right-0 left-0 w-screen h-screen z-40  bg-zinc-800'
                initial={{y:'100%', height: '100%'}}
                animate={{y:'0%', height: '0%'}}
                transition={{delay:0.2, duration: 0.8, ease:'easeInOut'}}
            />
            <motion.div
                className='fixed bottom-full right-0 left-0 w-screen h-screen z-50 bg-zinc-900'
                initial={{y:'100%', height: '100%'}}
                animate={{y:'0%', height: '0%'}}
                transition={{duration: 0.8, ease:'easeInOut'}}
            />
        </AnimatePresence>
    );
};