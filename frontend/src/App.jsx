import { Routes, Route } from "react-router-dom";
import RegisterForm from "./pages/RegisterForm";

// success page shown after payment
const Success = () => (
  <div className="min-h-screen flex items-center justify-center bg-green-50">
    <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
      <p className="text-gray-600">Your PDF has been sent to your email. Please check your inbox.</p>
    </div>
  </div>
);

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