import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "./ui/table";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import FetchData from "../Utils/FetchData";

export default function AdminFeedbackView() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5173";
  const [feedbacks, setFeedbacks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await FetchData(`${baseUrl}/api/feedbacks`);
      setFeedbacks(data);
      setLoading(false);
      console.log("Feedbacks fetched:", data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Feedback</h2>
      <Card className="p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading feedbacks...</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No feedbacks found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableCell className="font-bold">User Name</TableCell> */}
                <TableCell className="font-bold">S/N</TableCell>
                <TableCell className="font-bold">Subject</TableCell>
                <TableCell className="font-bold">Type</TableCell>
                <TableCell className="font-bold">Submitted At</TableCell>
                <TableCell className="font-bold">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((fb) => (
                <TableRow key={fb.id}>
                  {/* <TableCell>{fb.userName}</TableCell> */}
                  <TableCell>{feedbacks.indexOf(fb) + 1}</TableCell>
                  <TableCell>{fb.subject}</TableCell>
                  <TableCell>{fb.type}</TableCell>
                  <TableCell>{new Date(fb.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => setSelected(fb)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Feedback Details</h2>
            <div className="mb-4">
              <p><strong className="text-gray-700">User:</strong> {selected.username}</p>
              <p><strong className="text-gray-700">Subject:</strong> {selected.subject}</p>
              <p><strong className="text-gray-700">Type:</strong> {selected.type}</p>
              <p><strong className="text-gray-700">Submitted At:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Details:</h3>
              <p className="text-gray-700 mb-2.5 bg-gray-100 p-3 rounded-xl wrap-break-word">{selected.message}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
