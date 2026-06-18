import { useEffect, useState } from "react";
import FetchData from "../Utils/FetchData";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { FaEdit } from "react-icons/fa";


const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5085";

    const fetchDepartments = async () => {
        try{
        const data = await FetchData(`${baseUrl}/api/departments`);
        setDepartments(data);
    }finally{
        setLoading(false);
    }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchDepartments();
        }
        fetchData();
    }, []);

    const handleEdit = (department) => {
      setSelectedDepartment(department);
      setEditForm({
        id: department.id,
        name: department.name,
        description: department.description,
      });
    };

    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    const handleOnSubmit = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/departments`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        });
        if (!response.ok) {
          console.error("Failed to update department");
        }
        await fetchDepartments();
        setSelectedDepartment(null);
        setEditForm(null);
      } catch (error) {
        console.error("Error updating department:", error);
      }
    }

    return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Departments</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : departments.length === 0 ? (
        <p className="text-gray-500">No Departments found.</p>
      ) : (
        <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border border-gray-300">Name</th>
                <th className="p-3 border border-gray-300">Description</th>
                <th className="p-3 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300">
                    {dept.name}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {dept.description}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <Button variant="primary" onClick={()=>handleEdit(dept)}><FaEdit className="inline-block" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      )}
      {selectedDepartment && editForm && (
        <Modal isOpen={!!selectedDepartment} onClose={() => { setSelectedDepartment(null); setEditForm(null); }}>
          <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Edit Department</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              handleOnSubmit(selectedDepartment.id);
            }}
            >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <Button type="submit" variant="primary">Save Changes</Button>
          </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DepartmentList;
