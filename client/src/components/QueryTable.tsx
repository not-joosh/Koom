
import { useState, useEffect } from "react";
import { UserType } from "../lib/types";
import { motion } from "framer-motion";
import axios from "axios";

interface QueryTableProps {
    isQuery: boolean;
    query: string;
};

export const QueryTable = ({ isQuery, query }: QueryTableProps) => {
    const [data, setData] = useState([] as UserType[]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        if (isQuery) {
            axios.get(`http://localhost/pdo/api/usersHandler.php?query=${query}`).then((response) => {
                setData(response.data);
                console.log(response.data);
            });
        } else {
            axios.get("http://localhost/pdo/api/usersHandler.php").then((response) => {
                setData(response.data);
                console.log(response.data);
            });
        }

        return () => {
            setIsMounted(false);
        };
    }, [isQuery, query]);

    return (
        <motion.table
            className="min-w-full divide-y divide-gray-200 border border-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: isMounted ? 1 : 0 }}
            exit={{ opacity: 0 }}
        >
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">First Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Middle Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Last Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Barangay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Province</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Contact Number</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((user: UserType) => (
                    <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{user.first_name || <span className="text-red-500 italic">N/A</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{user.middle_name || <span className="text-red-500 italic">N/A</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{user.last_name || <span className="text-red-500 italic">N/A</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{user.city || <span className="text-red-500 italic">N/A</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{user.barangay || <span className="text-red-500 italic">N/A</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{user.province || <span className="text-red-500 italic">N/A</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{user.email || <span className="text-red-500 italic">N/A</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{user.contact_number || <span className="text-red-500 italic">N/A</span>}</td>
                    </tr>
                ))}
            </tbody>
        </motion.table>
    );
};
