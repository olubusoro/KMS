import React, {useState, useEffect} from "react";
import FetchData from "../Utils/FetchData";
import { Table, TableHeader, TableHeaderCell,TableBody , TableRow, TableCell } from "./ui/table";
import { Card } from "./ui/card";

const AccessRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "https://localhost:7161";

  const fetchRequests = async () => {
    try {
      const role = await FetchData(`${baseUrl}/api/users/role`);//localStorage.getItem("UserRole");
      console.log("User Role:", role.message);
      var deptRequests = [];
      
      if (role.message === "DeptAdmin"){
        deptRequests = await FetchData(`${baseUrl}/api/access-requests/department`);
        console.log('deptRequests fetched')
      }
      var privRequests = await FetchData(`${baseUrl}/api/access-requests/private`);

      const allRequests = [...deptRequests, ...privRequests];

      // Remove duplicates by id
      const uniqueRequests = allRequests.filter(
        (req, index, self) => index === self.findIndex((r) => r.id === req.id)
      );

      setRequests(uniqueRequests);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id, action) => {
    const endpoint =
      action === "approved"
        ? `${baseUrl}/api/access-requests/${id}/approve`
        : `${baseUrl}/api/access-requests/${id}/deny`;

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? {...r, status: action} : r))
        );
        alert(`Request ${action}`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Access Requests for Your Posts</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No pending access requests.</p>
      ) : (
        <Card>
        <div className="overflow-x-auto">
          <Table className="min-w-full text-left text-sm border-collapse border border-gray-300">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHeaderCell className="p-3 border border-gray-300">Post</TableHeaderCell>
                <TableHeaderCell className="p-3 border border-gray-300">Requested By</TableHeaderCell>
                <TableHeaderCell className="p-3 border border-gray-300">Reason</TableHeaderCell>
                <TableHeaderCell className="p-3 border border-gray-300">Status</TableHeaderCell>
                <TableHeaderCell className="p-3 border border-gray-300">Action</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-gray-50">
                  <TableCell className="p-3 border border-gray-300">
                    {req.postTitle}
                  </TableCell>
                  <TableCell className="p-3 border border-gray-300">
                    {req.requesterName}
                  </TableCell>
                  <TableCell className="p-3 border border-gray-300">{req.reason}</TableCell>
                  <TableCell className="p-3 border border-gray-300 capitalize">
                    {req.status}
                  </TableCell>
                  <TableCell className="p-3 border border-gray-300 space-x-2">
                    <button
                      onClick={() => updateRequestStatus(req.id, "approved")}
                      disabled={req.status !== "Pending"}
                      className="px-4 py-1 rounded bg-green-600 text-white text-sm disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateRequestStatus(req.id, "denied")}
                      disabled={req.status !== "Pending"}
                      className="px-4 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-50"
                      >
                      Deny
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      )}
    </div>
  );
};

export default AccessRequest;
