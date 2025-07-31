import React, { useState } from "react";
import EditModal from "./EditModal";
import { BiRotateLeft } from "react-icons/bi";
import DeleteModal from "./DeleteDialogModal";
import { Card } from "./ui/card";

const Table = ({ data, title }) => {
  const [editItem, setEditItem] = useState(null);

    const exclude = ["id", "createdAt"];
    const fields = data && data[0]
        ? Object.keys(data[0])
            .filter(key => !exclude.includes(key))
            .map(key => ({
                name: key,
                label: key.charAt(0).toUpperCase() + key.slice(1),
                required: true // or set based on your needs
            }))
        : [];
        function formatDate(value) {
            // Checks for ISO date string and formats it
            if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
                const date = new Date(value);
                return date.toLocaleString(); // You can customize the format if you want
            }
            return value;
        }
    const handleEditSubmit = (updatedItem) => {
        // Handle the updated item here (e.g., send to API or update state)
        // You may want to call a prop callback to update parent state
        // For now, just log it:
        console.log("Updated item:", updatedItem);
    };

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="p-4 text-gray-500">No data available.</div>;
  }

  const ids = data.map(obj => obj.id);
  const cleanData = data.map(({ id, ...rest }, idx) => ({
    SNo: idx + 1,
    ...rest
  }));

  return (
    <Card>
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white text-xs sm:text-sm md:text-base">
        <thead>
          <tr>
            {Object.keys(cleanData[0]).map((key) => (
              <th
              key={key}
                className="px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-2 border-b-2 border-gray-200 text-left font-semibold text-gray-700 whitespace-nowrap"
                >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}{title && title.toLowerCase() === "user" && (
              <th className="px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-2 border-b-2 border-gray-200 text-left font-semibold text-gray-700 whitespace-nowrap">
              Actions
            </th>)}
          </tr>
        </thead>
        <tbody>
          {cleanData.map((item, index) => (
            <tr
            key={index}
            className="hover:bg-gray-100 transition-colors duration-200"
            >
              {Object.values(item).map((value, idx) => (
                <td
                  key={idx}
                  className="px-1 py-1 sm:px-2 sm:py-2 md:px-4 md:py-2 border-b border-gray-200 text-gray-700 whitespace-nowrap"
                >
                  {formatDate(value)}
                </td>
              ))}{title && title.toLowerCase() === "user" && (
              <td className="py-1 sm:py-2 border-b border-gray-200 whitespace-nowrap">
                {title && title.toLowerCase() === "user" && (
                  <a
                  href="#"
                  title="Reset Password"
                  aria-label="Reset Password"
                  className="inline-flex items-center px-1 sm:px-2 md:px-3 py-1 text-base sm:text-lg text-gray-600 hover:text-blue-500 transition"
                  >
                    <span>
                      <BiRotateLeft className="inline-block mr-1 sm:mr-2 text-gray-500 hover:text-blue-500 transition" />
                    </span>
                  </a>
                )}
                <button
                  className="px-1 sm:px-2 md:px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  onClick={() => setEditItem(item)}
                >
                  Edit
                </button>
                <DeleteModal title={title} />
              </td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {editItem && (
        <EditModal
        open={!!editItem}
        title={title ? `Edit ${title}` : "Edit Item"}
        fields={fields}
        initialData={editItem}
        onClose={() => setEditItem(null)}
        onSubmit={handleEditSubmit}
        />
      )}
    </div>
      </Card>
  );
};



export default Table;
