import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const BRAND = "#013cfc";
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

// Helpers
const normalize = (str) => (str ?? "").toString().toLowerCase().trim();

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

const toAddressString = (addr) => {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  if (Array.isArray(addr)) return addr.filter(Boolean).join(", ");
  if (typeof addr === "object") {
    const order = ["line1", "line2", "street", "area", "city", "state", "zip", "postalCode", "pincode", "country"];
    const parts = [];
    for (const key of order) {
      const v = addr[key];
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

const getSpecialities = (doc) => {
  const s = doc?.speciality;
  if (Array.isArray(s)) return s.filter(Boolean);
  if (typeof s === "string") return s.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
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

const matchesQuery = (doc, q) => {
  if (!q) return true;
  const nq = normalize(q);
  const hay = [
    doc?.name,
    doc?.clinicName,
    toAddressString(doc?.address),
    getSpecialities(doc).join(" "),
    doc?.degree,
    doc?.about,
  ]
    .map(normalize)
    .join(" • ");
  const terms = nq.split(/\s+/).filter(Boolean);
  return terms.every((t) => hay.includes(t));
};

const scoreDoctor = (doc, q) => {
  if (!q) return 0;
  const nq = normalize(q);
  const name = normalize(doc?.name);
  const clinic = normalize(doc?.clinicName);
  const specs = normalize(getSpecialities(doc).join(" "));
  const addr = normalize(toAddressString(doc?.address) || "");
  let score = 0;
  if (name.includes(nq)) score += 100;
  if (clinic.includes(nq)) score += 80;
  if (specs.includes(nq)) score += 60;
  if (addr.includes(nq)) score += 40;

  const terms = nq.split(/\s+/).filter(Boolean);
  for (const t of terms) {
    if (name.includes(t)) score += 20;
    if (clinic.includes(t)) score += 16;
    if (specs.includes(t)) score += 12;
    if (addr.includes(t)) score += 10;
  }

  score += Math.min(numberFrom(doc?.experience, 0), 40);
  return score;
};

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "fees_asc", label: "Fees (Low to High)" },
  { value: "fees_desc", label: "Fees (High to Low)" },
  { value: "exp_desc", label: "Experience (High to Low)" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
];

/* ---------- NEW: StarRating (supports decimals 0–5) ---------- */
function StarRating({ value = 0, size = 14 }) {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  const pad = (n) => Math.max(0, Math.min(1, n));

  return (
    <span className="inline-flex items-center" aria-label={`${clamped.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = pad(clamped - i) * 100; // percent for this star
        return (
          <span key={i} className="relative mr-[2px] inline-block" style={{ width: size, height: size }}>
            {/* Base (empty) star */}
            <svg viewBox="0 0 20 20" className="absolute inset-0 text-gray-300" width={size} height={size} fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.803 2.037a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.348l-2.384 1.726c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* Filled portion */}
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${filled}%` }}>
              <svg viewBox="0 0 20 20" className="text-amber-400" width={size} height={size} fill="currentColor" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.803 2.037a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.348l-2.384 1.726c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}

// Doctor card
function DoctorCard({ doctor, onClick }) {
  const specs = getSpecialities(doctor);
  const feesDisplay = formatFees(doctor?.fees);
  const addressText = toAddressString(doctor?.address);

  // NEW: rating support (0–5 including decimals)
  const rawRating = doctor?.rating;
  const ratingValueRaw = numberFrom(rawRating, null);
  const ratingValue = ratingValueRaw == null ? null : Math.max(0, Math.min(5, ratingValueRaw));

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-50">
        {doctor?.image ? (
          <img
            src={doctor.image}
            alt={doctor?.name || "Doctor"}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900">{doctor?.name}</h3>
          {feesDisplay && (
            <span
              className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ color: BRAND, backgroundColor: "#545FF11A", border: "1px solid #545FF140" }}
            >
              {feesDisplay}
            </span>
          )}
        </div>

        {/* NEW: Rating row (only if rating present) */}
        {ratingValue != null && (
          <div className="flex items-center gap-2">
            <StarRating value={ratingValue} />
            <span className="text-xs font-medium text-gray-700">{ratingValue.toFixed(1)}</span>
          </div>
        )}

        {(doctor?.clinicName || addressText) && (
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{doctor?.clinicName}</span>
            {doctor?.clinicName && addressText ? " • " : ""}
            <span className="line-clamp-1">{addressText}</span>
          </div>
        )}

        {specs.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {specs.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ color: BRAND, border: "1px solid #545FF159" }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {doctor?.experience != null && (
          <div className="mt-auto text-sm text-gray-500">
            {numberFrom(doctor.experience, 0)} yrs experience
          </div>
        )}
      </div>

      <div className="flex items-center justify-end border-t border-gray-100 p-3">
        <button
          type="button"
          disabled={!doctor.available}
          title={doctor.available ? "Book an appointment" : "Doctor not available"}
          className={`rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition 
            ${doctor.available 
              ? 'hover:-translate-y-0.5 hover:shadow-md' 
              : 'bg-gray-400 cursor-not-allowed hover:translate-y-0 hover:shadow-sm'
            }`}
          style={
            doctor.available
              ? { backgroundColor: BRAND, boxShadow: "0 0 0 1px rgba(84,95,241,0.2) inset" }
              : {}
          }
          onClick={(e) => {
            if (!doctor.available) return;
            e.stopPropagation();
            onClick?.();
          }}
        >
          Book
        </button>
      </div>
    </div>
  );
}

function Filters({ allSpecialties, selectedSpecialties, setSelectedSpecialties, clearAll }) {
  const toggle = (arr, v) =>
    arr.some((x) => normalize(x) === normalize(v))
      ? arr.filter((x) => normalize(x) !== normalize(v))
      : [...arr, v];

  return (
    <div className="space-y-5">
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Specialties
        </h4>
        <div className="grid grid-row-2 gap-2">
          {allSpecialties.map((s) => {
            const active = selectedSpecialties.some((x) => normalize(x) === normalize(s));
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSpecialties((prev) => toggle(prev, s))}
                className={`rounded-lg border px-3 py-1 text-sm font-semibold ${
                  active ? "text-white" : "border-gray-200 text-gray-900 hover:border-gray-300"
                }`}
                style={active ? { backgroundColor: BRAND, borderColor: BRAND } : undefined}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {clearAll && (
        <>
          <div className="h-px w-full bg-gray-200" />
          <button
            type="button"
            onClick={clearAll}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Reset filters
          </button>
        </>
      )}
    </div>
  );
}

export default function KetpaFindVets() {
  const navigate = useNavigate();
  const { speciality: specialityParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { doctors = [] } = useContext(AppContext) || {};

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedSpecialties, setSelectedSpecialties] = useState(
    (searchParams.get("spc") || "").split(",").filter(Boolean)
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");
  const [showFilters, setShowFilters] = useState(false);

  // Prevent browser from restoring scroll to previous position on refresh
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0 });
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
  }, []);

  const allSpecialties = useMemo(() => {
    const map = new Map();
    doctors.forEach((d) => {
      getSpecialities(d).forEach((s) => {
        const key = normalize(s);
        if (!map.has(key)) map.set(key, s);
      });
    });
    return Array.from(map.values()).sort((a, b) => collator.compare(a, b));
  }, [doctors]);

  useEffect(() => {
    if (specialityParam && !selectedSpecialties.some((s) => normalize(s) === normalize(specialityParam))) {
      setSelectedSpecialties((prev) => [...prev, decodeURIComponent(specialityParam)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialityParam]);

  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (selectedSpecialties.length) params.spc = selectedSpecialties.join(",");
    if (sortBy && sortBy !== "relevance") params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [query, selectedSpecialties, sortBy, setSearchParams]);

  const activeFiltersCount = selectedSpecialties.length;

  const clearAll = () => {
    setQuery("");
    setSelectedSpecialties([]);
    setSortBy("relevance");
  };

  const filtered = useMemo(() => {
    let list = Array.isArray(doctors) ? [...doctors] : [];
    list = list.filter((d) => matchesQuery(d, query));
    if (selectedSpecialties.length) {
      list = list.filter((d) => {
        const docSpecs = getSpecialities(d).map(normalize);
        return selectedSpecialties.some((s) => docSpecs.includes(normalize(s)));
      });
    }
    if (sortBy === "relevance") {
      list.sort((a, b) => scoreDoctor(b, query) - scoreDoctor(a, query));
    } else if (sortBy === "fees_asc") {
      list.sort((a, b) => numberFrom(a?.fees, Number.POSITIVE_INFINITY) - numberFrom(b?.fees, Number.POSITIVE_INFINITY));
    } else if (sortBy === "fees_desc") {
      list.sort((a, b) => numberFrom(b?.fees, Number.NEGATIVE_INFINITY) - numberFrom(a?.fees, Number.NEGATIVE_INFINITY));
    } else if (sortBy === "exp_desc") {
      list.sort((a, b) => numberFrom(b?.experience, -1) - numberFrom(a?.experience, -1));
    } else if (sortBy === "name_asc") {
      list.sort((a, b) => collator.compare(a?.name || "", b?.name || ""));
    } else if (sortBy === "name_desc") {
      list.sort((a, b) => collator.compare(b?.name || "", a?.name || ""));
    }
    return list;
  }, [doctors, query, selectedSpecialties, sortBy]);

  const getDoctorId = (d, idx) => d?._id ?? d?.id ?? idx;

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ paddingTop: "var(--nav-h, 10px)" }}>
      {/* Sticky search/sort header under navbar */}
      <div id="#findVets" className="sticky z-30 border-b border-gray-200 bg-white/80 backdrop-blur" style={{ top: "var(--nav-h, 64px)" }}>
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="text-lg font-bold md:text-md">Find Vets</div>
            </div>

            <div className="w-full md:max-w-3xl">
              {/* Allow wrapping so buttons don't leak on small screens */}
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, clinic, speciality, or location…"
                  aria-label="Search vets"
                  className="min-w-[160px] flex-1 bg-transparent px-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none md:min-w-0"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort results"
                  className="w-[150px] shrink-0 rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm font-semibold text-gray-900 focus:outline-none sm:w-[180px]"
                  style={{ outlineColor: BRAND }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowFilters(true)}
                  className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-gray-300 lg:hidden"
                >
                  Filters{activeFiltersCount ? ` (${activeFiltersCount})` : ""}
                </button>
              </div>

              {/* Active filter chips */}
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSpecialties.map((s) => (
                  <span
                    key={`spc-${s}`}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-900"
                  >
                    {s}
                    <button
                      aria-label={`Remove ${s} filter`}
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setSelectedSpecialties((prev) => prev.filter((x) => normalize(x) !== normalize(s)))
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedSpecialties.length > 0 && (
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ color: BRAND, backgroundColor: "#545FF11A" }}
                    onClick={clearAll}
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar (desktop) */}
          <aside
            className="sticky hidden h-fit rounded-xl border border-gray-200 bg-white p-4 lg:col-span-3 lg:block"
            style={{ top: "calc(var(--nav-h, 64px) + 12px)" }}
          >
            <Filters
              allSpecialties={allSpecialties}
              selectedSpecialties={selectedSpecialties}
              setSelectedSpecialties={setSelectedSpecialties}
              clearAll={clearAll}
            />
          </aside>

          {/* Results */}
          <main className="lg:col-span-9">
            <div className="mb-3 text-sm text-gray-600">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6">
                <div className="mb-1 text-base font-semibold">No vets match your search</div>
                <div className="mb-3 text-sm text-gray-600">
                  Try adjusting your query or selecting a different specialty.
                </div>
                <button
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  style={{ backgroundColor: BRAND, boxShadow: "0 0 0 1px rgba(84,95,241,0.2) inset" }}
                  onClick={clearAll}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((doc, idx) => (
                  <DoctorCard
                    key={getDoctorId(doc, idx)}
                    doctor={doc}
                    onClick={() => navigate(`/appointment/${doc._id}`)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {/* Overlay (below navbar) */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          showFilters ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ top: "var(--nav-h, 64px)" }}
        onClick={() => setShowFilters(false)}
      />
      {/* Panel (below navbar) */}
      <div
        className={`fixed right-0 z-50 w-[100vw] max-w-md transform bg-white transition-transform duration-200 ease-out lg:hidden ${
          showFilters ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "var(--nav-h, 64px)", height: "calc(100vh - var(--nav-h, 64px))" }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-full flex-col">
          {/* Drawer header */}
          <div className="shrink-0 border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Filters</div>
              <button
                className="text-sm font-semibold"
                style={{ color: BRAND }}
                onClick={clearAll}
              >
                Clear all
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-auto p-4">
            <Filters
              allSpecialties={allSpecialties}
              selectedSpecialties={selectedSpecialties}
              setSelectedSpecialties={setSelectedSpecialties}
            />
          </div>

          {/* Action bar (never cut off; safe-area aware) */}
          <div
            className="shrink-0 border-t border-gray-200 p-4"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
          >
            <div className="flex gap-3">
              <button
                className="w-1/2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900"
                onClick={() => setShowFilters(false)}
              >
                Cancel
              </button>
              <button
                className="w-1/2 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm"
                style={{ backgroundColor: BRAND, boxShadow: "0 0 0 1px rgba(84,95,241,0.2) inset" }}
                onClick={() => {
                  setShowFilters(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}