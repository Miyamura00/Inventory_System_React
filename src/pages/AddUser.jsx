  import React, { useState } from "react";
  import CreateAccount from "../components/buttons/CreateAccount";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { fetchUsers, addUser, updateUser, deleteUser } from "../services/users";
  import { Edit, Trash2, Ban, Unlock } from "lucide-react"; // ✅ icons

  const AddUser = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
      designation: "Staff",
      department: "IT",
    });

    const [open, setOpen] = useState(false); // Create account modal
    const [editingUser, setEditingUser] = useState(null); // Edit modal
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
        resetForm();
        setOpen(false);
      },
      onError: (error) => {
        console.error("Registration Error:", error);
        alert(error.response?.data?.message || "Failed to create account.");
      },
    });

    // Update user
    const updateMutation = useMutation({
      mutationFn: updateUser,
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        setEditingUser(null);
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

    // Disable / enable user
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

    // Group users by department
    const groupedUsers = (users || []).reduce((acc, user) => {
      const dept = user.department || "Unassigned";
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(user);
      return acc;
    }, {});

    // Badge colors
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

    // Reset form
    const resetForm = () => {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        designation: "Staff",
        department: "IT",
      });
      setEmailError("");
      setPasswordError("");
      setConfirmError("");
    };

    // Create Account submit handler
    const handleSubmit = (e) => {
      e.preventDefault();

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setEmailError("Please enter a valid email.");
        return;
      } else {
        setEmailError("");
      }

      // Password validation
      if (formData.password.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
        return;
      } else {
        setPasswordError("");
      }

      // Confirm password validation
      if (formData.password !== formData.confirmpassword) {
        setConfirmError("Passwords do not match.");
        return;
      } else {
        setConfirmError("");
      }

      mutation.mutate(formData);
    };

    // Edit form submit handler
    const handleEditSubmit = (e) => {
      e.preventDefault();
      if (!editingUser) return;

      const updates = {
        name: editingUser.name,
        email: editingUser.email,
        designation: editingUser.designation,
        department: editingUser.department,
      };
      if (editingUser.password && editingUser.password.trim()) {
        updates.password = editingUser.password;
      }
      console.log("Updating user:", editingUser.id, updates);
      updateMutation.mutate({ id: editingUser.id, updates });
    };

  return (
    <div className="p-6">
      {/* Create Account Button */}
      <CreateAccount onClick={() => setOpen(true)} />

      {/* Accounts Section */}
      <div className="mt-10 bg-white shadow-lg rounded-xl p-6 bg-cyan-500/10">
        <h3 className="text-xl font-semibold mb-4">User Accounts</h3>
        {isLoading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No accounts added yet.</p>
        ) : (
          <>
            {selectedDepartment === null ? (
              // Department cards
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(groupedUsers).map((dept) => (
                  <div
                    key={dept}
                    className={`p-[2px] rounded-xl bg-gradient-to-r ${
                      departmentGradients[dept] || "from-gray-200 to-gray-300"
                    }`}
                  >
                    <div
                      onClick={() => setSelectedDepartment(dept)}
                      className="cursor-pointer rounded-xl p-6 text-center text-white shadow-lg hover:-translate-y-1 transition border border-gray-100"
                    >
                      <h4 className="font-bold text-lg">{dept}</h4>
                      <p className="text-sm opacity-90">
                        {groupedUsers[dept].length} users
                      </p>
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
                      <tr
                        key={user._id || i}
                        className={user.disabled ? "opacity-60" : ""}
                      >
                        <td className="px-4 py-2 border">{user.name}</td>
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
                          {/* Edit */}
                          <button
                            onClick={() =>
                              setEditingUser({ ...user, password: "" })
                            }
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit size={18} />
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
                            {user.disabled ? (
                              <Unlock size={18} />
                            ) : (
                              <Ban size={18} />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete ${user.name}?`
                                )
                              ) {
                                deleteMutation.mutate(user._id);
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
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

      {/* ✅ Create Account Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold mb-4">Create Account</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border rounded-lg p-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border rounded-lg p-2"
                required
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="border rounded-lg p-2"
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}

              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmpassword: e.target.value,
                  })
                }
                className="border rounded-lg p-2"
                required
              />
              {confirmError && (
                <p className="text-red-500 text-sm">{confirmError}</p>
              )}

              <select
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
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
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
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
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Edit User Modal */}
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
                  setEditingUser({
                    ...editingUser,
                    designation: e.target.value,
                  })
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
                  setEditingUser({
                    ...editingUser,
                    department: e.target.value,
                  })
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

              <input
                type="password"
                placeholder="New password (leave blank to keep)"
                value={editingUser.password || ""}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    password: e.target.value,
                  })
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
