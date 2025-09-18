import React, { useState } from "react";
import CreateAccount from "../components/buttons/CreateAccount";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, addUser, updateUser, deleteUser } from "../services/users";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    designation: "Staff",
    department: "IT",
  });

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // 👈 for edit modal
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Add user
  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: (newUser) => {
      queryClient.setQueryData(["users"], (old = []) => [...old, newUser]);
      alert("Account Created Successfully");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        designation: "Staff",
        department: "IT",
      });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setEditingUser(null); // close edit modal
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const disableMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const designations = ["Select Role", "Super Admin", "Admin", "Staff"];
  const departments = ["Select Department", "HR", "IT", "Finance", "Sales"];

  // Group users by department
  const groupedUsers = users.reduce((acc, user) => {
    if (!acc[user.department]) acc[user.department] = [];
    acc[user.department].push(user);
    return acc;
  }, {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailError || passwordError || confirmError) {
      alert("Please fix validation errors before submitting.");
      return;
    }
    mutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      designation: formData.designation,
      department: formData.department,
    });
  };

  // Helper for department badge colors
  const getDepartmentBadge = (department) => {
    switch (department) {
      case "HR":
        return "bg-yellow-100 text-yellow-800";
      case "IT":
        return "bg-gray-800 text-white";
      case "Finance":
        return "bg-orange-100 text-orange-800";
      case "Sales":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const departmentGradients = {
    HR: "from-pink-200 via-pink-300 to-rose-200",
    IT: "from-blue-200 via-indigo-300 to-cyan-200",
    Finance: "from-yellow-200 via-orange-300 to-amber-200",
    Sales: "from-green-200 via-emerald-300 to-teal-200",
  };

  return (
    <div className="p-6">
      {/* Button to open Create Account modal */}
      <CreateAccount onClick={() => setOpen(true)} />

      {/* Create Account Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold">Create Account</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* name */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border rounded-lg p-2"
              />
              {/* email */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="border rounded-lg p-2"
              />
              {/* designation */}
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="border rounded-lg p-2"
              >
                {designations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
              {/* department */}
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="border rounded-lg p-2"
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              {/* password */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border rounded-lg p-2"
              />
              {/* confirm password */}
              <input
                type="password"
                name="confirmpassword"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={handleChange}
                required
                className="border rounded-lg p-2"
              />
              {/* buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 text-white px-4 py-2 rounded-lg"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department Cards and User Table */}
      <div className="mt-10 bg-white shadow-lg rounded-xl p-6 bg-cyan-500/10">
        <h3 className="text-xl font-semibold mb-4">User Accounts</h3>
        {isLoading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No accounts added yet.</p>
        ) : (
          <>
            {selectedDepartment === null ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
                {Object.keys(groupedUsers).map((dept) => (
                  <div
                    key={dept}
                    className={`p-[2px] rounded-xl bg-gradient-to-r ${
                      departmentGradients[dept] || "from-gray-200 to-gray-300"
                    }`}
                  >
                    <div
                      onClick={() => setSelectedDepartment(dept)}
                      className="cursor-pointer rounded-xl p-6 text-center text-white"
                    >
                      <h4 className="font-bold text-lg">{dept}</h4>
                      <p>{groupedUsers[dept].length} users</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="mb-4 px-4 py-2 bg-gray-200 rounded-lg"
                >
                  ← Back
                </button>
                <h3 className="text-xl font-bold mb-4">
                  {selectedDepartment} Department
                </h3>
                <table className="w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">Email</th>
                      <th className="px-4 py-2 border">Designation</th>
                      <th className="px-4 py-2 border">Department</th>
                      <th className="px-4 py-2 border">Created</th>
                      <th className="px-4 py-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedUsers[selectedDepartment].map((user, i) => (
                      <tr key={user.id || i}>
                        <td className="px-4 py-2 border">{user.name}</td>
                        <td className="px-4 py-2 border">{user.email}</td>
                        <td className="px-4 py-2 border">{user.designation}</td>
                        <td className="px-4 py-2 border">{user.department}</td>
                        <td className="px-4 py-2 border">{user.createdAt}</td>
                        <td className="px-4 py-2 border space-x-2 text-center">
                          <button
                            onClick={() => setEditingUser(user)} // 👈 open edit modal
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => disableMutation.mutate(user._id)}
                            className="text-yellow-500 hover:text-yellow-700"
                          >
                            🚫
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(user._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold mb-4">Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate({
                  id: editingUser._id,
                  updates: {
                    name: editingUser.name,
                    email: editingUser.email,
                    designation: editingUser.designation,
                    department: editingUser.department,
                  },
                });
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                className="border rounded-lg p-2"
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="border rounded-lg p-2"
              />
              <select
                value={editingUser.designation}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, designation: e.target.value })
                }
                className="border rounded-lg p-2"
              >
                {designations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
              <select
                value={editingUser.department}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, department: e.target.value })
                }
                className="border rounded-lg p-2"
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
