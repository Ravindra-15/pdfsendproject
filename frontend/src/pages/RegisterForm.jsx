import { useState } from "react";
import axios from "axios";

// base api url — works locally and on vercel
const API_BASE = import.meta.env.VITE_API_URL || "/api";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // update form state on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic validation
    if (!formData.name || !formData.email || !formData.role) {
      setError("Please fill all fields and select a role.");
      return;
    }

    try {
      setLoading(true);

      // send form data to backend to create stripe checkout session
      const res = await axios.post(
        `${API_BASE}/payment/create-checkout-session`,
        formData
      );

      // redirect user to stripe checkout page
      window.location.href = res.data.url;
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        {/* header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📄</div>
          <h1 className="text-2xl font-bold text-gray-800">Get Your PDF</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in your details and pay ₹50 to receive your PDF
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
            />
          </div>

          {/* email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
            />
          </div>

          {/* role dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Your Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 bg-white"
            >
              <option value="">-- Select a role --</option>
              <option value="student">Student</option>
              <option value="working_professional">Working Professional</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* error message */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* pay button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-lg transition duration-200 text-lg"
          >
            {loading ? "Redirecting to payment..." : "Pay ₹50 & Get PDF"}
          </button>

        </form>

        {/* footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          🔒 Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;