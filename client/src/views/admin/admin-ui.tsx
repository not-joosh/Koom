import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, Button, Input } from "@chakra-ui/react"
import { SVGProps, useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { set } from "react-hook-form";

interface AdminUiProps {
  // Defining the function to signout
  signOut: () => void;
}

export const AdminUi = ({signOut}: AdminUiProps) => {
  const toast = useToast();
  const [filterQuery, setFilterQuery] = useState<string>(""); 
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]); // Modified
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]); // Modified
  
  const handleFilter = (query: string) => {
    try {
      setFilterQuery(query);
      // If the query is empty, set the filtered logs to all logs
      if (query === "") {
        setFilteredLogs(attendanceLogs);
        return;
      }
      // Filter the logs based on the query
      const filtered = attendanceLogs.filter((log) => {
        // Convert the query to lowercase for case-insensitive matching
        const queryString = query.toLowerCase();
  
        // Function to check if any part of a string matches the query
        const checkMatch = (value: string | null) => {
          if (value === null) {
            return false; // Return false for null values
          }
          return value.toLowerCase().includes(queryString);
        };
  
        // Check for match in each field, treating null as an empty string
        return (
          checkMatch(log.user.first_name ?? "") ||
          checkMatch(log.user.last_name ?? "") ||
          checkMatch(log.user.city ?? "") ||
          checkMatch(log.user.barangay ?? "") ||
          checkMatch(log.user.province ?? "") ||
          checkMatch(log.attendance_id?.toString() ?? "") || // Convert to string for comparison
          checkMatch(log.user.id?.toString() ?? "") || // Convert to string for comparison
          checkMatch(log.month_entered ?? "") ||
          checkMatch(log.day_entered?.toString() ?? "") || // Convert to string for comparison
          checkMatch(log.year_entered?.toString() ?? "") || // Convert to string for comparison
          checkMatch(log.time_str_entered ?? "") ||
          checkMatch(log.time_str_exit ?? "")
        );
      });
  
      setFilteredLogs(filtered);
    } catch (error: unknown) {
      if (error instanceof Error)
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
    }
  };

  useEffect(() => {
    // Fetch data from the backend, specifically the attendance logs and load them all by default.
    const fetchData = async () => {
      // We will fetch from adminQuery.php, adminQuery.php will return all attendances
      const response = await axios.get("http://localhost/koom/api/adminQuery.php");
      setAttendanceLogs(response.data);
      setFilteredLogs(response.data); // Initially, set filtered logs to all logs
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold">Attendance Logs</h2>
        </div>
        <div className="flex items-center justify-end gap-4"> {/* Modified */}
          <div className="flex justify-end">
            <Button
              className="!bg-black !text-white hover:!bg-gray-800"
              onClick={signOut}
            >
              Sign out
            </Button>
          </div>
          <form className="flex items-center gap-4">
            <div className="relative">
              <Input
                className="pl-8 w-64"
                placeholder="Search..."
                type="search"
                onChange={(e) => handleFilter(e.target.value)}
                value={filterQuery}
              />
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
            {filteredLogs.reverse().map((log) => {
                // console.log(log)
                console.log("test");
                console.log(filteredLogs.reverse())
                return (
                  <Tr key={log.attendance_id}>
                  <Td className = 'text-black'>{log.attendance_id}</Td>
                  <Td className = 'text-black'>{log.user.id}</Td>
                  <Td className = 'text-black'>{log.user.first_name}</Td>
                  <Td className = 'text-black'>{log.user.last_name}</Td>
                  <Td className = 'text-black'>{log.user.city}</Td>
                  <Td className = 'text-black'>{log.user.barangay}</Td>
                  <Td className = 'text-black'>{log.user.province}</Td>
                  <Td className = 'text-black'>{`${log.month_entered} ${log.day_entered}, ${log.year_entered}`}</Td>
                  <Td className = 'text-black'>{log.time_str_entered}</Td>
                  <Td className = 'text-black'>{log.time_str_exit}</Td>
                </Tr>
                );
              })}
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

function setFilteredLogs(dummyData: { attendanceId: string; userId: string; firstName: string; lastName: string; city: string; barangay: string; province: string; date: string; timeIn: string; timeOut: string; }[]) {
  throw new Error("Function not implemented.");
}
