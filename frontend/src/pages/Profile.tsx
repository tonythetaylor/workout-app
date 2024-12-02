import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState([
        {
          id: 1,
          date: "2024-12-01",
          type: "Cardio",
          duration: 45, // in minutes
          caloriesBurned: 300,
        },
        {
          id: 2,
          date: "2024-12-02",
          type: "Strength",
          duration: 60,
          caloriesBurned: 500,
        },
      ]); // Mocked workouts data
    const [friends, setFriends] = useState([
      { id: 1, name: "Alice Doe", avatar: "https://via.placeholder.com/50" },
      { id: 2, name: "John Smith", avatar: "https://via.placeholder.com/50" },
    ]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFriend, setNewFriend] = useState({ name: "", avatar: "" });
  
    // Add Friend Handler
    const handleAddFriend = (e: React.FormEvent) => {
      e.preventDefault();
      if (newFriend.name && newFriend.avatar) {
        setFriends([...friends, { id: Date.now(), ...newFriend }]);
        setNewFriend({ name: "", avatar: "" });
        setShowAddModal(false);
      } else {
        alert("Please fill out both fields.");
      }
    };
  
    // Remove Friend Handler
    const handleRemoveFriend = (id: number) => {
      setFriends(friends.filter((friend) => friend.id !== id));
    };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      <div className="container mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{user?.name || "Guest"}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || "Email not available"}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Workouts Summary */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Workouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <h3 className="font-semibold text-lg">{workout.type}</h3>
                <p className="text-sm text-gray-500">
                  Date: {new Date(workout.date).toLocaleDateString()}
                </p>
                <p className="text-sm">Duration: {workout.duration} mins</p>
                <p className="text-sm">Calories Burned: {workout.caloriesBurned} kcal</p>
              </div>
            ))}
          </div>
        </div>

{/* Friends List */}
<div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Friends</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Add Friend
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {friends.length > 0 ? (
              <ul className="space-y-4">
                {friends.map((friend) => (
                  <li
                    key={friend.id}
                    className="flex items-center space-x-4 border-b pb-4"
                  >
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <p className="text-lg font-medium flex-1">{friend.name}</p>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                You have no friends added.
              </p>
            )}
          </div>
        </div>

        {/* Add Friend Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Friend</h2>
              <form onSubmit={handleAddFriend}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                    value={newFriend.name}
                    onChange={(e) =>
                      setNewFriend({ ...newFriend, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Avatar URL</label>
                  <input
                    type="url"
                    className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                    value={newFriend.avatar}
                    onChange={(e) =>
                      setNewFriend({ ...newFriend, avatar: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Add Friend
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}    
      </div>
    </div>
  );
};

export default Profile;
