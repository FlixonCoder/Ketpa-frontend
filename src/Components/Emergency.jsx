import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

export default function EmergencyFab({ to = "/emergency" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      aria-label="Book an emergency appointment"
      className="fixed bottom-5 right-5 z-50 group focus:outline-none"
    >
      {/* Glow */}
      <span className="absolute inset-0 -m-2 rounded-full bg-[#545FF1]/30 blur-lg opacity-0 group-hover:opacity-100 transition pointer-events-none" />
      {/* Button */}
      <div className="relative flex items-center gap-3 rounded-full bg-[#545FF1] px-4 py-3 text-white shadow-lg ring-1 ring-[#545FF1]/25 transition hover:-translate-y-0.5">
        <FiAlertTriangle className="text-xl" />
        <span className="hidden sm:inline font-semibold">Emergency</span>
      </div>
    </button>
  );
}