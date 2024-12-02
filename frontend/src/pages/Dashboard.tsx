import React, { useEffect, useState } from "react";
import { getUserMetrics, addMetric } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import GoalCard from "../components/GoalCard";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

interface Metric {
  date: string;
  weight: number | null;
  workoutCompleted: boolean;
  caloriesConsumed: number | null;
  waterIntake: number | null;
  steps: number | null;
  mood: number | null;
  notes: string;
  waist: number | null;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newMetric, setNewMetric] = useState<Metric>({
    date: "",
    weight: null,
    workoutCompleted: false,
    caloriesConsumed: null,
    waterIntake: null,
    steps: null,
    mood: null,
    notes: "",
    waist: null,
  });

  // Sample data for goals
  const goals = [
    {
      name: 'Lose Weight',
      targetValue: 150,
      currentValue: 140,
      unit: 'lbs',
      deadline: '2024-12-31T00:00:00Z',
      isAchieved: false,
    },
    {
      name: 'Run 5k',
      targetValue: 5,
      currentValue: 3,
      unit: 'km',
      deadline: '2024-10-15T00:00:00Z',
      isAchieved: false,
    },
    {
      name: 'Drink More Water',
      targetValue: 3000,
      currentValue: 3000,
      unit: 'ml',
      deadline: '2024-08-01T00:00:00Z',
      isAchieved: true,
    },
  ];


  const fetchMetrics = async () => {
    try {
      const { data } = await getUserMetrics(); // API call
      setMetrics(data); // Update metrics state
      setLoading(false); // Stop loading spinner
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("Unauthorized. Logging out...");
        logout(); // Clear auth state
        navigate("/login", { replace: true }); // Redirect to login
      } else {
        console.error("Failed to fetch metrics:", error);
        setLoading(false); // Stop loading spinner
      }
    }
  };
  
  const handleAddMetric = async (e: React.FormEvent) => {
    e.preventDefault();

    const metricToSend = {
      ...newMetric,
      date: new Date(newMetric.date).toISOString(),
    };

    try {
      await addMetric(metricToSend);
      fetchMetrics();
      setShowModal(false);
      resetNewMetric();
    } catch (error) {
      console.error("Failed to add metric:", error);
    }
  };

  const resetNewMetric = () => {
    setNewMetric({
      date: "",
      weight: null,
      workoutCompleted: false,
      caloriesConsumed: null,
      waterIntake: null,
      steps: null,
      mood: null,
      notes: "",
      waist: null,
    });
  };

  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      console.warn('No token found. Redirecting to login...');
      logout();
      navigate("/login", { replace: true });
      return;
    }

    fetchMetrics();

    const intervalId = setInterval(fetchMetrics, 60000);
    return () => clearInterval(intervalId);
  }, [user, navigate, logout]);

  // Prepare data for charts
  const chartLabels = metrics.map((metric) =>
    new Date(metric.date).toLocaleDateString()
  );
  const weights = metrics.map((metric) => metric.weight || 0);
  const steps = metrics.map((metric) => metric.steps || 0);
  const waterIntake = metrics.reduce(
    (total, metric) => total + (metric.waterIntake || 0),
    0
  );
  const workoutsCompleted = metrics.filter(
    (metric) => metric.workoutCompleted
  ).length;
  const workoutsMissed = metrics.length - workoutsCompleted;

  // Data for Pie Chart
  const pieData = {
    labels: ["Workouts Completed", "Workouts Missed"],
    datasets: [
      {
        data: [workoutsCompleted, workoutsMissed],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  // Data for Bar Chart
  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Steps",
        data: steps,
        backgroundColor: "#42A5F5",
      },
    ],
  };

  // Data for Line Chart
  const lineData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Weight (lbs)",
        data: weights,
        borderColor: "#FF6384",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 items-center justify-center">
    <div className="w-full px-4 py-4 mx-auto">
  
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome, {user?.name || "Guest"}!
          </p>
          {/* <div className="space-x-4">
            <Link
              to="/profile"
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Settings
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Add Metric
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div> */}
        </header>

        {loading ? (
          <div className="text-center">Loading metrics...</div>
        ) : metrics.length === 0 ? (
          <>
          <p className="text-gray-600 dark:text-gray-400">
            No metrics available. Start tracking today!
          </p>
             <button
             onClick={() => setShowModal(true)}
             className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
           >
             Add Metric
           </button>
          </>
          
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-full  mx-auto">
              <div className="mb-2 py-2 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <h2 className="text-xl font-bold mb-4">Your Metrics</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  Add Metric
                </button>
              </div>

              {/* Scrollable table container */}
              <div className="max-h-96 overflow-y-auto">
                <table className="table-auto w-full">
                  <thead className="sticky top-0 bg-gray-200 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Weight</th>
                      <th className="px-4 py-2">Workout Completed</th>
                      <th className="px-4 py-2">Calories</th>
                      <th className="px-4 py-2">Water</th>
                      <th className="px-4 py-2">Steps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-4 py-2">
                          {new Date(metric.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{metric.weight} lbs</td>
                        <td className="px-4 py-2">
                          {metric.workoutCompleted ? (
                            <span className="text-green-500">Yes</span>
                          ) : (
                            <span className="text-red-500">No</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {metric.caloriesConsumed} kcal
                        </td>
                        <td className="px-4 py-2">{metric.waterIntake} oz</td>
                        <td className="px-4 py-2">{metric.steps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Goals Section */}
          <div className="mt-8 mb-8 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 ">
            {/* <h2 className="text-xl font-bold mb-4">Your Goals</h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal, index) => (
                <GoalCard
                  key={index}
                  name={goal.name}
                  targetValue={goal.targetValue}
                  currentValue={goal.currentValue}
                  unit={goal.unit}
                  deadline={goal.deadline}
                  isAchieved={goal.isAchieved}
                />
              ))}
            </div>
          </div>

            {/* Charts Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pie Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full overflow-hidden">
                <h3 className="text-lg font-bold mb-4 text-center">
                  Workout Completion
                </h3>
                <div className="relative w-full h-64 max-w-full">
                  <Pie
                    data={pieData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full overflow-hidden">
                <h3 className="text-lg font-bold mb-4 text-center">
                  Steps Over Time
                </h3>
                <div className="relative w-full h-64 max-w-full">
                  <Bar
                    data={barData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full overflow-hidden">
                <h3 className="text-lg font-bold mb-4 text-center">
                  Weight Progress
                </h3>
                <div className="relative w-full h-64 max-w-full">
                  <Line
                    data={lineData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Add Metric Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Add Metric</h2>Modal Form
              Fields
              <form onSubmit={handleAddMetric}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    value={newMetric.date.split("T")[0]}
                    onChange={(e) =>
                      setNewMetric({
                        ...newMetric,
                        date: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : "",
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Weight</label>
                  <input
                    type="number"
                    placeholder="Weight (lbs)"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    value={newMetric.weight || ""}
                    onChange={(e) =>
                      setNewMetric({
                        ...newMetric,
                        weight: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Waist</label>
                  <input
                    type="number"
                    placeholder="Waist (inches)"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    value={newMetric.waist || ""}
                    onChange={(e) =>
                      setNewMetric({
                        ...newMetric,
                        waist: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Workout Completed
                  </label>
                  <input
                    type="checkbox"
                    checked={newMetric.workoutCompleted}
                    onChange={(e) =>
                      setNewMetric({
                        ...newMetric,
                        workoutCompleted: e.target.checked,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Calories Consumed
                  </label>
                  <input
                    type="number"
                    placeholder="Calories (kcal)"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    value={newMetric.caloriesConsumed || ""}
                    onChange={(e) =>
                      setNewMetric({
                        ...newMetric,
                        caloriesConsumed: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Water Intake
                  </label>
                  <input
                    type="number"
                    placeholder="Water (oz)"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    value={newMetric.waterIntake || ""}
                    onChange={(e) =>
                      setNewMetric({
                        ...newMetric,
                        waterIntake: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Steps</label>
                  <input
                    type="number"
                    placeholder="Steps"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    value={newMetric.steps || ""}
                    onChange={(e) =>
                      setNewMetric({
                        ...newMetric,
                        steps: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Mood</label>
                  <input
                    type="number"
                    placeholder="Mood (1-10)"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    value={newMetric.mood || ""}
                    onChange={(e) =>
                      setNewMetric({
                        ...newMetric,
                        mood: e.target.value
                          ? parseInt(e.target.value, 10)
                          : null, // Parse to integer or set to null
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Notes</label>
                  <textarea
                    placeholder="Add any notes"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    value={newMetric.notes}
                    onChange={(e) =>
                      setNewMetric({ ...newMetric, notes: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetNewMetric();
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Save
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

export default Dashboard;
