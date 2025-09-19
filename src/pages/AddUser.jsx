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
  const [editingUser, setEditingUser] = useState(null); // <-- edit modal state
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
    onError: (error) => {
      console.error("Registration Error:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to create account. Please try again.");
      }
    },
  });

  // Update user (used for Edit)
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setEditingUser(null); // close edit modal
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Failed to update user");
    },
  });

  // Delete user
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    },
  });

  // Disable / enable user (reuses updateUser)
  const disableMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("Disable/Enable error:", error);
      alert(error.response?.data?.message || "Failed to change user status");
    },
  });

  const designations = ["Select Role", "Super Admin", "Admin", "Staff"];
  const departments = ["Select Department", "HR", "IT", "Finance", "Sales"];

  // Group users by department (safe when users empty)
  const groupedUsers = (users || []).reduce((acc, user) => {
    const dept = user.department || "Unassigned";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(user);
    return acc;
  }, {});

  // Keep your original validation behavior for create form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      } else if (
        users.some((u) => u.email.toLowerCase() === value.toLowerCase())
      ) {
        setEmailError("This email is already registered");
      } else {
        setEmailError("");
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
      } else {
        setPasswordError("");
      }
      if (formData.confirmpassword && value !== formData.confirmpassword) {
        setConfirmError("Passwords do not match");
      } else {
        setConfirmError("");
      }
    }

    if (name === "confirmpassword") {
      if (value !== formData.password) {
        setConfirmError("Passwords do not match");
      } else {
        setConfirmError("");
      }
    }
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

  // Helper for department badge colors (table)
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

  // Helper for designation badge colors
  const getDesignationBadge = (designation) => {
    switch (designation) {
      case "Super Admin":
        return "bg-red-100 text-red-800";
      case "Admin":
        return "bg-blue-100 text-blue-800";
      case "Staff":
        return "bg-green-100 text-green-800";
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

  // Edit form submit handler (from edit modal)
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const updates = {
      name: editingUser.name,
      email: editingUser.email,
      designation: editingUser.designation,
      department: editingUser.department,
    };
    // include password only if provided (for reset)
    if (editingUser.password && editingUser.password.trim() !== "") {
      updates.password = editingUser.password;
    }

    updateMutation.mutate({ id: editingUser._id, updates });
  };

  return (
    <div className="p-6">
      {/* Button to open Create Account modal */}
      <CreateAccount onClick={() => setOpen(true)} />

      {/* Create Account Modal (kept your implementation) */}
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
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={mutation.isLoading}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className={`border rounded-lg p-2 focus:outline-none focus:ring-2
                ${
                  emailError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                disabled={mutation.isLoading}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                disabled={mutation.isLoading}
              >
                {designations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                disabled={mutation.isLoading}
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`border rounded-lg p-2 focus:outline-none focus:ring-2
                ${
                  passwordError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                disabled={mutation.isLoading}
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}

              <input
                type="password"
                name="confirmpassword"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={handleChange}
                required
                className={`border rounded-lg p-2 focus:outline-none focus:ring-2
                ${
                  confirmError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                disabled={mutation.isLoading}
              />
              {confirmError && (
                <p className="text-red-500 text-sm">{confirmError}</p>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={mutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
                  disabled={
                    mutation.isLoading || emailError || passwordError || confirmError
                  }
                >
                  {mutation.isLoading ? "Creating..." : "Register"}
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
          <p className="text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No accounts added yet.</p>
        ) : (
          <>
            {selectedDepartment === null ? (
              // Department cards (kept your gradient wrapper)
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
                      className={`cursor-pointer rounded-xl p-6 text-center text-white
                        shadow-lg transition transform hover:-translate-y-1 
                        border border-gray-100
                        ${dept === "HR" ? "bg-gradient-to-br from-yellow-400 to-yellow-600 animate-glow-yellow" : ""}
                        ${dept === "IT" ? "bg-gradient-to-br from-blue-500 to-blue-700 animate-glow-blue" : ""}
                        ${dept === "Finance" ? "bg-gradient-to-br from-orange-400 to-orange-600 animate-glow-orange" : ""}
                        ${dept === "Sales" ? "bg-gradient-to-br from-purple-500 to-purple-700 animate-glow-purple" : ""}`}
                    >
                      <h4 className="font-bold text-lg">{dept}</h4>
                      <p className="text-sm opacity-90">{groupedUsers[dept].length} users</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Users inside selected department
              <div>
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="mb-4 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  ← Back
                </button>
                <h3 className="text-xl font-bold mb-4">
                  {selectedDepartment} Department
                </h3>
                <table className="w-full border border-gray-200 rounded-lg">
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
                      <tr key={user._id || i} className={user.disabled ? "opacity-60" : ""}>
                        <td className="px-4 py-2 border">
                          <div className="flex items-center gap-2">
                            <span>{user.name}</span>
                            {user.disabled && (
                              <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700">
                                Disabled
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 border">{user.email}</td>
                        <td className="px-4 py-2 border">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDesignationBadge(
                              user.designation
                            )}`}
                          >
                            {user.designation}
                          </span>
                        </td>
                        <td className="px-4 py-2 border">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentBadge(
                              user.department
                            )}`}
                          >
                            {user.department}
                          </span>
                        </td>
                        <td className="px-4 py-2 border">{user.createdAt}</td>
                        <td className="px-4 py-2 border space-x-2 text-center">
                          {/* Edit -> open edit modal */}
                          <button
                            onClick={() => setEditingUser({ ...user, password: "" })}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ✏️
                          </button>

                          {/* Disable / Enable */}
                          <button
                            onClick={() =>
                              disableMutation.mutate({
                                id: user._id,
                                updates: { disabled: !user.disabled },
                              })
                            }
                            className="text-yellow-500 hover:text-yellow-700"
                          >
                            {user.disabled ? "🔓" : "🚫"}
                          </button>

                          {/* Delete with confirm */}
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete ${user.name}? This cannot be undone.`
                                )
                              ) {
                                deleteMutation.mutate(user._id);
                              }
                            }}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setEditingUser(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold mb-4">Edit User</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                className="border rounded-lg p-2"
                required
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="border rounded-lg p-2"
                required
              />
              <select
                value={editingUser.designation}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, designation: e.target.value })
                }
                className="border rounded-lg p-2"
                required
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
                required
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              {/* Optional password reset - only applied if filled */}
              <input
                type="password"
                placeholder="New password (leave blank to keep)"
                value={editingUser.password || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, password: e.target.value })
                }
                className="border rounded-lg p-2"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
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
