// import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Card, CardBody, CardFooter, CardHeader, Input, FormLabel, Button, Link} from "@chakra-ui/react";
import { motion } from "framer-motion";

export const LoginForm = () => {
  return (
    <motion.div
            key="1"
            className="flex items-center min-h-screen px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full max-w-sm p-6 rounded-lg border border-gray-200 shadow-lg dark:border-gray-800 bg-white">
                <div className="grid gap-4">
                    <Button className="w-full" size="lg" variant="outline">
                        Guest
                    </Button>
                    <Button className="w-full bg-blue-200 text-black !hover:bg-black" size="lg" variant="outline">
                            USC Affiliate
                    </Button>
                </div>
            </div>
            <motion.div
                className="w-full max-w-sm mx-auto"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
            >
                <Card>
                    <CardHeader className="space-y-2 text-center">
                        <h1 className="text-3xl">Login</h1>
                        <CardBody>Enter your email below to login to your account.</CardBody>
                    </CardHeader>
                    <CardBody className="space-y-4">
                        <div className="space-y-2">
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input id="email" placeholder="m@example.com" required type="email" />
                        </div>
                        <div className="space-y-2">
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Input id="password" required type="password" />
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full">Sign in</Button>
                        <div className="text-center text-sm">
                            <Link className="!text-sky-800" href="#">
                                Don't Have an account? Register
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </motion.div>
  );
};