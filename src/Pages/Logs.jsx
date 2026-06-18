import React from 'react';
import Table from '../Components/Table';
import toast from "react-hot-toast"


const Logs = () => {
  const [logs, setLogs] = React.useState([]);
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5085";

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/logs`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
          toast.log("Logs fetched successfully");
        } else {
          toast.error("Failed to fetch logs");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

  return (
    <div>
      <p className="ml-6 text-2xl"><strong>Audit logs</strong></p>
      <div className='mt-0.5 p-5'>
        <Table data={logs} title={'Log'} />
      </div>
    </div>
  );
}

export default Logs;
