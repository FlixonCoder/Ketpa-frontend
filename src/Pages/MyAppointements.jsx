import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaTimes, FaSyncAlt } from "react-icons/fa";

const MyAppointements = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("upcoming"); // upcoming | past | cancelled | all
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_newest"); // date_newest | date_oldest
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const [refreshFlag,setRefreshFlag] = useState(0)

  const getUsersAppointment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token }, // or { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        const normalized = normalizeAppointments(data.appointments || []);
        setAppointments(normalized);
      } else {
        toast.error(data.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setCancelling(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message || "Appointment cancelled");
        setRefreshFlag(f => f+1)
        // Optimistic update
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, status: "cancelled" } : a))
        );
        // Or full refresh:
        // await getUsersAppointment();
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Failed to cancel appointment");
    } finally {
      setCancelling(false);
      setConfirmCancelId(null);
    }
  };

  useEffect(() => {
    if (token) {
      getDoctorsData();   // fetch only once when token changes
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getUsersAppointment();  // re-fetch appointments on cancel/refresh
    } else {
      setAppointments([]);
      setLoading(false);
    }
  }, [token, refreshFlag]);

  // Respect backend flags only: cancelled > iscompleted true/false
  const withEffectiveStatus = useMemo(() => {
    return appointments.map((a) => {
      let effective = a.status;
      if (effective !== "cancelled") {
        if (typeof a.isCompletedFlag === "boolean") {
          effective = a.isCompletedFlag ? "completed" : "upcoming";
        } else {
          effective = a.status || "upcoming";
        }
      }
      return { ...a, effectiveStatus: effective };
    });
  }, [appointments]);

  const filtered = useMemo(() => {
    let list = withEffectiveStatus;

    // Filter by tab
    if (tab === "upcoming") list = list.filter((a) => a.effectiveStatus === "upcoming");
    else if (tab === "past") list = list.filter((a) => a.effectiveStatus === "completed");
    else if (tab === "cancelled") list = list.filter((a) => a.effectiveStatus === "cancelled");

    // Search
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((a) => {
        const hay = [
          a.doctor?.name,
          a.doctor?.clinicName,
          Array.isArray(a.doctor?.speciality) ? a.doctor.speciality.join(", ") : a.doctor?.speciality,
          a.doctor?.address?.line1,
          a.doctor?.address?.line2,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    // Sort by our local timestamp (built from slotDate+slotTime)
    list = [...list].sort((a, b) => {
      const da = Date.parse(a.dateTime);
      const db = Date.parse(b.dateTime);
      if (isNaN(da) && isNaN(db)) return 0;
      if (isNaN(da)) return 1;
      if (isNaN(db)) return -1;
      return sortBy === "date_newest" ? db - da : da - db;
    });

    return list;
  }, [withEffectiveStatus, tab, query, sortBy]);

  const counts = useMemo(
    () => ({
      all: withEffectiveStatus.length,
      upcoming: withEffectiveStatus.filter((a) => a.effectiveStatus === "upcoming").length,
      past: withEffectiveStatus.filter((a) => a.effectiveStatus === "completed").length,
      cancelled: withEffectiveStatus.filter((a) => a.effectiveStatus === "cancelled").length,
    }),
    [withEffectiveStatus]
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero with themed background */}
      <section
        className="relative isolate bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${assets.hero_bg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b  from-black/30 via-black/40 to-black/60 rounded-lg" />
        <div className="relative mx-auto max-w-6xl px-6 py-10 text-white">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My appointments</h1>
          <p className="mt-1 text-white/90">Manage and track your visits in one place</p>
        </div>
      </section>

      {/* Toolbar */}
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <Tab
              active={tab === "upcoming"}
              onClick={() => setTab("upcoming")}
              label={`Upcoming (${counts.upcoming})`}
            />
            <Tab active={tab === "past"} onClick={() => setTab("past")} label={`Completed (${counts.past})`} />
            <Tab
              active={tab === "cancelled"}
              onClick={() => setTab("cancelled")}
              label={`Cancelled (${counts.cancelled})`}
            />
            <Tab active={tab === "all"} onClick={() => setTab("all")} label={`All (${counts.all})`} />
          </div>

          {/* Search + Sort + Refresh */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end md:w-auto">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
              <FaSearch className="text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by vet, clinic, or location"
                className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-gray-500 focus:outline-none"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:border-[#545FF1] focus:outline-none focus:ring-2 focus:ring-[#545FF1]"
            >
              <option value="date_newest">Newest first</option>
              <option value="date_oldest">Oldest first</option>
            </select>
            <button
              onClick={getUsersAppointment}
              disabled={!token || loading}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                loading
                  ? "cursor-not-allowed border-gray-200 text-gray-400"
                  : "border-gray-200 text-gray-900 hover:border-gray-300"
              }`}
              title={token ? "Refresh appointments" : "Login required"}
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* List */}
        <div className="mt-4 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-base font-semibold">No appointments found</p>
              <p className="mt-1 text-gray-600">
                {token ? "Try changing the filters or check back later." : "Login to see your appointments."}
              </p>
              <a
                href="/find-vets"
                className="mt-4 inline-block rounded-lg bg-[#545FF1] px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-[#545FF1]/20"
              >
                Find a vet
              </a>
            </div>
          ) : (
            filtered.map((a) => {
              const isUpcoming = a.effectiveStatus === "upcoming";
              const isCancelled = a.effectiveStatus === "cancelled";
              const isCompleted = a.effectiveStatus === "completed";

              return (
                <div key={a.id} className="grid gap-4 px-6 py-4 sm:grid-cols-12 sm:items-start">
                  {/* Avatar */}
                  <div className="sm:col-span-2">
                    <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-200">
                      {a.doctor?.image ? (
                        <img
                          src={a.doctor.image}
                          alt={a.doctor?.name || "Doctor"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="sm:col-span-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{a.doctor?.name || "Doctor"}</h3>
                      <StatusChip status={a.effectiveStatus} />
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {a.doctor?.speciality && (
                        <p className="font-medium text-[#545FF1]">{a.doctor.speciality}</p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-700">
                        <span className="inline-flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-500" />
                          {/* Directly show what backend provided: slotDate + slotTime */}
                          {a.originalDisplayTime}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-500" />
                          {a.doctor?.address?.line1}
                          {a.doctor?.address?.line2 ? `, ${a.doctor.address.line2}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-stretch justify-start gap-2 sm:col-span-3">
                    {isUpcoming && !isCancelled && (
                      <>
                        <button
                          className="rounded-lg border border-gray-200 bg-white cursor-default px-3 py-2 text-sm font-semibold text-gray-900 transition hover:border-gray-300"
                        >
                          Payment Cash
                        </button>
                        <button
                          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => setConfirmCancelId(a.id)}
                          disabled={cancelling}
                        >
                          Cancel appointment
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <a
                        href="/find-vets"
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 transition hover:border-gray-300"
                      >
                        Book again
                      </a>
                    )}

                    {isCancelled && (
                      <a
                        href="/find-vets"
                        className="rounded-lg bg-[#545FF1] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-[#545FF1]/20 transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        Rebook
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cancel modal */}
      {confirmCancelId && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setConfirmCancelId(null)} />
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-base font-semibold">Cancel appointment?</h4>
                <button
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                  onClick={() => setConfirmCancelId(null)}
                >
                  <FaTimes />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                This cannot be undone. You can always rebook later.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:border-gray-300"
                  onClick={() => setConfirmCancelId(null)}
                >
                  Keep appointment
                </button>
                <button
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => cancelAppointment(confirmCancelId)}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling..." : "Confirm cancel"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyAppointements;

/* UI bits */
function Tab({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
        active
          ? "border-[#545FF1] bg-indigo-50 text-[#545FF1]"
          : "border-gray-200 text-gray-900 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

function StatusChip({ status }) {
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
        Cancelled
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
        Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-[#545FF1] ring-1 ring-inset ring-[#545FF1]/20">
      Upcoming
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="grid gap-4 px-6 py-4 sm:grid-cols-12 sm:items-start">
      <div className="sm:col-span-2">
        <div className="h-24 w-24 animate-pulse rounded-xl bg-gray-100" />
      </div>
      <div className="sm:col-span-7">
        <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
        <div className="mt-3 flex gap-4">
          <div className="h-3 w-36 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-48 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
      <div className="sm:col-span-3">
        <div className="h-9 w-full animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

/* Helpers */
// Normalize backend appointments into the UI shape.
// Uses slotDate + slotTime for display; builds a local timestamp only for sorting.
function normalizeAppointments(list) {
  return (list || []).map((apt, i) => {
    const doctor = apt.docData || apt.doctor || apt.doctorId || {};
    let speciality = doctor?.speciality;
    if (Array.isArray(speciality)) speciality = speciality.join(", ");

    const originalDisplayTime = buildDisplayTime(apt.slotDate, apt.slotTime);
    const dateTime = buildLocalTimestamp(apt.slotDate, apt.slotTime, apt.dateTime || apt.date, apt.time);

    // cancelled > iscompleted flag > fallback
    const completedFlagRaw = apt.iscompleted ?? apt.isCompleted;
    const hasCompletedFlag = typeof completedFlagRaw === "boolean";
    const status =
      apt.cancelled || apt.isCancelled
        ? "cancelled"
        : hasCompletedFlag
        ? completedFlagRaw
          ? "completed"
          : "upcoming"
        : apt.status || "upcoming";

    return {
      id: apt._id || apt.id || `apt_${i}`,
      originalDisplayTime, // shown in UI
      dateTime, // used only for sorting
      status,
      isCompletedFlag: hasCompletedFlag ? completedFlagRaw : undefined,
      doctor: {
        _id: doctor?._id || doctor?.id,
        name: doctor?.name || "Doctor",
        image: doctor?.image,
        speciality,
        clinicName: doctor?.clinicName || "",
        address: {
          line1: doctor?.address?.line1 || "",
          line2: doctor?.address?.line2 || "",
        },
      },
    };
  });
}

// Build "DD Mon YYYY | HH:MM AM/PM"
function buildDisplayTime(slotDate, slotTime) {
  const readable = parseSlotDateToDisplay(slotDate);
  return [readable, slotTime].filter(Boolean).join(" | ");
}

// Build a local timestamp string for sorting (no timezone shifts)
function buildLocalTimestamp(slotDate, slotTime, rawDate, rawTime) {
  // prefer explicit slot date/time
  const dateIso = parseSlotDateToIso(slotDate) || parseDateToIso(rawDate);
  const time24 = parseTimeTo24(slotTime || rawTime);
  if (dateIso && time24) return `${dateIso}T${time24}:00`;
  // fallback to something parseable but not shown in UI
  return "invalid";
}

// Parse "DD_MM_YYYY" -> "YYYY-MM-DD"
function parseSlotDateToIso(slotDate) {
  if (!slotDate || typeof slotDate !== "string") return null;
  const parts = slotDate.split("_");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

// Parse "DD_MM_YYYY" -> "DD Mon YYYY"
function parseSlotDateToDisplay(slotDate) {
  if (!slotDate || typeof slotDate !== "string") return "";
  const parts = slotDate.split("_");
  if (parts.length !== 3) return slotDate;
  const [dd, mm, yyyy] = parts;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const idx = Math.max(1, parseInt(mm, 10)) - 1;
  const mon = months[idx] || mm;
  return `${dd} ${mon} ${yyyy}`;
}

// Parse common date strings -> "YYYY-MM-DD"
function parseDateToIso(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
}

// Parse "HH:MM" or "HH:MM AM/PM" -> "HH:MM" 24h
function parseTimeTo24(timeStr) {
  if (!timeStr) return null;

  const m24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    const hh = String(Math.min(parseInt(m24[1], 10), 23)).padStart(2, "0");
    const mm = String(Math.min(parseInt(m24[2], 10), 59)).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  const m12 = timeStr.trim().toUpperCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (m12) {
    let hh = parseInt(m12[1], 10);
    const mm = m12[2] ? parseInt(m12[2], 10) : 0;
    const mer = m12[3];
    if (mer === "PM" && hh < 12) hh += 12;
    if (mer === "AM" && hh === 12) hh = 0;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }

  return null;
}