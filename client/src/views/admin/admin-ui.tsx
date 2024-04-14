import { Table, Thead, Tbody, Tr, Th, Td, Input, Button, useColorMode } from "@chakra-ui/react";
import { useState, useEffect, SVGProps } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

interface AdminUiProps {
  // Defining the function to signout
  signOut: () => void;
}

export const AdminUi = ({ signOut }: AdminUiProps) => {
  const toast = useToast();
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
        const checkMatch = (value: string | null) => {
          console.log(value);
          if (value === "" || value === null || value === undefined) {
            return query.toLowerCase() === "pending";
          }
          return (value ?? "").toLowerCase().includes(query.toLowerCase());
        };

        const fullName = `${log.user.first_name} ${log.user.last_name}`;

        // Combine month, day, and year into a single string for date search
        const dateStr = `${log.month_entered} ${log.day_entered}, ${log.year_entered}`;

        // Check for match in each field, treating null as an empty string
        return (
          checkMatch(fullName) || // Search through combined full name
          checkMatch(log.user.city ?? "") ||
          checkMatch(log.user.barangay ?? "") ||
          checkMatch(log.user.province ?? "") ||
          checkMatch(log.attendance_id?.toString() ?? "") ||
          checkMatch(log.user.id?.toString() ?? "") ||
          checkMatch(dateStr) || // Search through combined date string
          checkMatch(log.time_str_entered ?? "") ||
          checkMatch(log.time_str_exit ?? "")
        );
      });

      // Sort the filtered logs based on sort direction
      const sortedFiltered = sortDirection === "asc" ? filtered.sort((a, b) => a.attendance_id - b.attendance_id) : filtered.sort((a, b) => b.attendance_id - a.attendance_id);

      setFilteredLogs(sortedFiltered);
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



  const handleSort = (direction: "asc" | "desc") => {
    const sortedLogs = [...filteredLogs].sort((a, b) => {
      if (direction === "asc") {
        setSortDirection("asc");
        return a.attendance_id - b.attendance_id;
      } else {
        setSortDirection("desc");
        return b.attendance_id - a.attendance_id;
      }
    });

    setFilteredLogs(sortedLogs);
  };

  useEffect(() => {
    // checking ui color mode () chakra-ui-color-mode

    // Function to fetch data
    
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost/koom/api/adminQuery.php");
        setAttendanceLogs(response.data);
        setFilteredLogs(response.data); // Initially, set filtered logs to all logs
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 5000,
            position: "top",
            isClosable: true,
          });
        }
      }
    };
  
    // Fetch data initially
    fetchData();
  
    // Set interval to fetch data every 2-3 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 2 * 60 * 1000); // 2 minutes in milliseconds
  
    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <Button
            className="!bg-black !text-white hover:!bg-gray-800"
            onClick={signOut}
          >
            Sign out
          </Button>
          <h2 className="text-lg font-bold">Attendance Logs</h2>
        </div>
        <div className="flex items-center justify-end gap-4">
          <div className="flex justify-end">
            <Button
              className={`mx-4 ${
                sortDirection === "asc"
                  ? "!bg-blue-700 !text-white"
                  : "!bg-blue-100 !text-white !opacity-70"
              } hover:!bg-black`}
              onClick={() => handleSort("asc")}
            >
              Oldest
            </Button>
            <Button
              className={`${
                sortDirection === "desc"
                  ? "!bg-blue-700 !text-white"
                  : "!bg-blue-100 !text-white !opacity-70"
              } hover:!bg-black`}
              onClick={() => handleSort("desc")}
            >
              Latest
            </Button>
          </div>
          <form className="flex items-center gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Input
                className="pl-8 w-64"
                placeholder="Search..."
                type="search"
                onChange={(e) => handleFilter(e.target.value)}
                value={filterQuery}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="border rounded-lg overflow-y-auto max-h-96">
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
            {filteredLogs.map((log) => (
              <Tr key={log.attendance_id}>
                <Td className="text-black">{log.attendance_id}</Td>
                <Td className="text-black">{log.user.id}</Td>
                <Td className="text-black">{log.user.first_name}</Td>
                <Td className="text-black">{log.user.last_name}</Td>
                <Td className="text-black">{log.user.city}</Td>
                <Td className="text-black">{log.user.barangay}</Td>
                <Td className="text-black">{log.user.province}</Td>
                <Td className="text-black">{`${log.month_entered} ${log.day_entered}, ${log.year_entered}`}</Td>
                <Td className="text-black">{log.time_str_entered}</Td>
                <Td className={`text-${log.time_str_exit ? 'black' : '!text-red-500'} ${log.time_str_exit ? '' : 'italic'}`}>{log.time_str_exit || 'Pending'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};