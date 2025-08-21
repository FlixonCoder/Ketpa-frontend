import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const BRAND = "#545FF1";

// Helpers
const normalize = (s) => (s ?? "").toString().toLowerCase().trim();

const getSpecialities = (doc) => {
  const s = doc?.speciality;
  if (Array.isArray(s)) return s.filter(Boolean);
  if (typeof s === "string") return s.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
};

const isEmergency = (doc) =>
  getSpecialities(doc).map(normalize).includes("emergency");

const toAddressString = (addr) => {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  if (Array.isArray(addr)) return addr.filter(Boolean).join(", ");
  if (typeof addr === "object") {
    const order = ["line1", "line2", "street", "area", "city", "state", "zip", "postalCode", "pincode", "country"];
    const parts = [];
    for (const k of order) {
      const v = addr[k];
      if (v && typeof v !== "object") parts.push(String(v));
    }
    if (!parts.length) {
      for (const v of Object.values(addr)) {
        if (v && typeof v !== "object") parts.push(String(v));
      }
    }
    return parts.join(", ");
  }
  return String(addr);
};

const numberFrom = (value, fallback = 0) => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (value == null) return fallback;
  if (typeof value === "string") {
    const m = value.match(/(\d+(\.\d+)?)/);
    const n = m ? parseFloat(m[0]) : NaN;
    return Number.isNaN(n) ? fallback : n;
  }
  if (typeof value === "object") {
    const s = JSON.stringify(value);
    const m = s.match(/(\d+(\.\d+)?)/);
    const n = m ? parseFloat(m[0]) : NaN;
    return Number.isNaN(n) ? fallback : n;
  }
  return fallback;
};

const formatFees = (fees) => {
  const amount = numberFrom(fees, null);
  if (amount == null) return "";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `₹${amount}`;
  }
};

const getDoctorId = (d, idx) => d?._id ?? d?.id ?? idx;

// Card
function DoctorCard({ doctor, onBook }) {
  const specs = getSpecialities(doctor);
  const fees = formatFees(doctor?.fees);
  const address = toAddressString(doctor?.address);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 w-full bg-gray-50">
        {doctor?.image ? (
          <img src={doctor.image} alt={doctor?.name || "Doctor"} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[#013cfc]/90 px-2 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
          Emergency
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900">{doctor?.name}</h3>
            {doctor?.clinicName && (
              <p className="mt-0.5 truncate text-sm font-medium text-slate-700">{doctor.clinicName}</p>
            )}
          </div>
          {fees && (
            <span className="whitespace-nowrap rounded-full border border-[#013cfc]/25 bg-[#013cfc]/10 px-2.5 py-1 text-xs font-semibold text-[#013cfc]">
              {fees}
            </span>
          )}
        </div>

        {address && <p className="line-clamp-2 text-sm text-slate-600">{address}</p>}

        {doctor?.experience != null && (
          <p className="mt-auto text-sm text-slate-500">{numberFrom(doctor.experience, 0)} yrs experience</p>
        )}

        {specs?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {specs.slice(0, 3).map((s) => (
              <span key={s} className="rounded-full border border-[#013cfc]/35 bg-white px-2.5 py-1 text-xs font-medium text-[#013cfc]">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end border-t border-gray-100 p-3">
        <button
          type="button"
          onClick={onBook}
          className="rounded-lg bg-[#013cfc] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-[#013cfc]/20 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Book now
        </button>
      </div>
    </article>
  );
}

export default function EmergencyVetsPage() {
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext) || {};

  const emergencies = useMemo(() => {
    const list = Array.isArray(doctors) ? doctors : [];
    // Filter by "Emergency" speciality (case-insensitive). Handles string or array.
    const filtered = list.filter(isEmergency);
    // Sort by experience (desc), then fees (asc), then name
    return [...filtered].sort((a, b) => {
      const expDiff = numberFrom(b?.experience, -1) - numberFrom(a?.experience, -1);
      if (expDiff !== 0) return expDiff;
      const feeDiff = numberFrom(a?.fees, Number.POSITIVE_INFINITY) - numberFrom(b?.fees, Number.POSITIVE_INFINITY);
      if (feeDiff !== 0) return feeDiff;
      return (a?.name || "").localeCompare(b?.name || "");
    });
  }, [doctors]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: BRAND }} />
          Emergency Vets
        </h1>
        <p className="mt-1 text-sm text-slate-600">Doctors specialized in emergency and critical care.</p>
      </div>

      {/* Results */}
      {emergencies.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
          <div className="mb-1 text-base font-semibold text-slate-900">No emergency vets available</div>
          <div className="text-sm text-slate-600">Please check back later or contact support.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {emergencies.map((doc, idx) => (
            <DoctorCard
              key={getDoctorId(doc, idx)}
              doctor={doc}
              onBook={() => navigate(`/appointment/${encodeURIComponent(getDoctorId(doc, idx))}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}