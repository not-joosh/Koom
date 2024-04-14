import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, Button, Input } from "@chakra-ui/react"
import { SVGProps, useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";
import { motion } from "framer-motion";

interface AdminUiProps {
  // Defining the function to signout
  signOut: () => void;
}

export const AdminUi = ({signOut}: AdminUiProps) => {
  const [filterQuery, setFilterQuery] = useState<string>(""); 

  useEffect(() => {
    // Fetch data from the backend, specifically the attendance logs and load them all by default.
    
  }, []);
  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold">Attendance Logs</h2>
        </div>
        <div className="flex items-center justify-end gap-4"> {/* Modified */}
          <div className="flex justify-end">

              <Button className = '!bg-black !text-white hover:!bg-gray-800'
                  onClick={signOut}
              >
                  Sign out
              </Button>
          </div>
          <form className="flex items-center gap-4">
            <div className="relative">
              <Input className="pl-8 w-64" placeholder="Search..." type="search" />
              <SearchIcon className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </form>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th w="100px">Attendance ID</Th>
              <Th w="100px">User ID</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>City</Th>
              <Th>Barangay</Th>
              <Th>Province</Th>
              <Th w="150px">Date</Th>
              <Th w="100px">Time In</Th>
              <Th w="100px">Time Out</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>ATT001</Td>
              <Td>USER001</Td>
              <Td>John</Td>
              <Td>Doe</Td>
              <Td>City</Td>
              <Td>Barangay</Td>
              <Td>Province</Td>
              <Td>03/01/2023</Td>
              <Td>08:00 AM</Td>
              <Td>05:00 PM</Td>
            </Tr>
            <Tr>
              <Td>ATT002</Td>
              <Td>USER002</Td>
              <Td>Jane</Td>
              <Td>Smith</Td>
              <Td>City</Td>
              <Td>Barangay</Td>
              <Td>Province</Td>
              <Td>03/01/2023</Td>
              <Td>08:00 AM</Td>
              <Td>05:00 PM</Td>
            </Tr>
            <Tr>
              <Td>ATT003</Td>
              <Td>USER003</Td>
              <Td>Michael</Td>
              <Td>Johnson</Td>
              <Td>City</Td>
              <Td>Barangay</Td>
              <Td>Province</Td>
              <Td>03/01/2023</Td>
              <Td>08:00 AM</Td>
              <Td>05:00 PM</Td>
            </Tr>
            <Tr>
              <Td>ATT004</Td>
              <Td>USER004</Td>
              <Td>Sarah</Td>
              <Td>Wilson</Td>
              <Td>City</Td>
              <Td>Barangay</Td>
              <Td>Province</Td>
              <Td>03/01/2023</Td>
              <Td>08:00 AM</Td>
              <Td>05:00 PM</Td>
            </Tr>
            <Tr>
              <Td>ATT005</Td>
              <Td>USER005</Td>
              <Td>Chris</Td>
              <Td>Lee</Td>
              <Td>City</Td>
              <Td>Barangay</Td>
              <Td>Province</Td>
              <Td>03/01/2023</Td>
              <Td>08:00 AM</Td>
              <Td>05:00 PM</Td>
            </Tr>
          </Tbody>
        </Table>
      </div>
    </div>
    
  );
};

// Search Icon
function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
    );
};