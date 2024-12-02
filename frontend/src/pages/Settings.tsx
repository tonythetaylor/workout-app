import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { updateUser, deleteUser } from "../services/api";
import { getSettings, updateSettings } from "../services/settingService";

export interface User {
  id?: number;
  name: string;
  email: string;
}

const Settings: React.FC = () => {
  const { user, logout, setUser } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch User Settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
      setFormData({ name: data.name || "", email: data.email || "" });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user settings:", error);
      setLoading(false);
    }
  };

  // Handle User Info Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      await updateSettings(formData);
      if (user?.id) {
        setUser({
          ...user,
          name: formData.name,
          email: formData.email,
        });
      }
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      await deleteUser();
      alert("Account deleted successfully.");
      logout();
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      alert(error.response?.data?.message || "Failed to delete account.");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return <div className="text-center mt-6">Loading settings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Update User Information */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={updateLoading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md transition ${
              updateLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {updateLoading ? "Updating..." : "Update Information"}
          </button>
        </form>

        {/* Theme Toggle */}
        <div className="mt-6">
          <button
            onClick={toggleTheme}
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>

        {/* Delete Account */}
        <div className="mt-6">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
          >
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-sm">
              <h2 className="text-xl font-bold mb-4 text-red-500">
                Are you sure?
              </h2>
              <p className="mb-4">
                Deleting your account is irreversible. All data will be lost.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className={`bg-red-500 text-white px-4 py-2 rounded-md transition ${
                    deleteLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-600"
                  }`}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
