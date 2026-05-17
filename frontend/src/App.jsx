import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import axios from "axios";
import RegisterForm from "./pages/RegisterForm";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

// success page — calls backend with session_id to trigger email
const Success = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if (!session_id) {
      setStatus("error");
      return;
    }

    // call backend to verify payment and send email
    axios
      .get(`${API_BASE}/payment/payment-success?session_id=${session_id}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-5xl mb-4">⏳</div>
          <h1 className="text-xl font-bold text-gray-700">Processing your order...</h1>
        </div>
      </div>
    );

  if (status === "error")
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-red-500">Something went wrong</h1>
          <p className="text-gray-500 mt-2">Please contact support.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Your PDF has been sent to your email. Please check your inbox.</p>
      </div>
    </div>
  );
};

// cancel page shown if user cancels payment
const Cancel = () => (
  <div className="min-h-screen flex items-center justify-center bg-red-50">
    <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
      <div className="text-6xl mb-4">❌</div>
      <h1 className="text-2xl font-bold text-red-500 mb-2">Payment Cancelled</h1>
      <p className="text-gray-600">Your payment was cancelled. Please try again.</p>
      <a href="/" className="mt-4 inline-block text-blue-500 underline">Go back</a>
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      {/* main form route */}
      <Route path="/" element={<RegisterForm />} />
      {/* stripe redirects to these after payment */}
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
    </Routes>
  );
};

export default App;