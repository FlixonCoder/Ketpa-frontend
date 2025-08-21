import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../Components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Appointments = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]); // Array of arrays per day
  const [slotIndex, setSlotIndex] = useState(0); // Which day
  const [slotTime, setSlotTime] = useState(""); // Which time within day
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchDocInfo = async () => {
    const info = doctors.find((doc) => doc._id === docId);
    setDocInfo(info || null);
  };

  // Build next 7 days of available slots (10:00 to 21:00, every 30 mins), skipping booked ones
  const getAvailableSlots = async () => {
    if (!docInfo) return;
    setLoadingSlots(true);
    try {
      const slotsByDay = [];
      const booked = docInfo.slots_booked || {};

      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        const start = new Date(currentDate);
        if (i === 0) {
          // For today, start from now rounded up to nearest slot, but not earlier than 10:00
          const now = new Date();
          start.setHours(Math.max(10, now.getHours()), now.getMinutes() > 30 ? 30 : 0, 0, 0);
          if (now.getMinutes() > 30 && start.getHours() === now.getHours()) {
            // If we were at :30, move to :30 otherwise we already set
          }
          if (start.getHours() < 10) start.setHours(10, 0, 0, 0);
        } else {
          start.setHours(10, 0, 0, 0);
        }

        const end = new Date(currentDate);
        end.setHours(21, 0, 0, 0);

        const timeSlots = [];
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // 1..12
        const year = currentDate.getFullYear();
        const slotDateKey = `${day}_${month}_${year}`;

        const isBooked = (timeStr) => {
          // Booked times are stored in the same "toLocaleTimeString" format used when generating
          return booked[slotDateKey] && booked[slotDateKey].includes(timeStr);
        };

        const iter = new Date(start);
        while (iter < end) {
          const formattedTime = iter.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          if (!isBooked(formattedTime)) {
            timeSlots.push({
              datetime: new Date(iter),
              time: formattedTime,
            });
          }
          // Next 30-minute slot
          iter.setMinutes(iter.getMinutes() + 30);
        }

        slotsByDay.push(timeSlots);
      }

      setDocSlots(slotsByDay);
      setSlotIndex(0);
      setSlotTime("");
    } catch (e) {
      console.error(e);
      toast.error("Failed to load slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    // Validate selection
    const daySlots = docSlots[slotIndex] || [];
    if (!daySlots.length) {
      toast.error("No available slots for the selected day");
      return;
    }
    if (!slotTime) {
      toast.error("Please select a time slot");
      return;
    }

    try {
      // Build slotDate from the selected day's first slot datetime (all slots share the same date)
      const date = daySlots[0].datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    // Reset selected time when changing the day
    setSlotTime("");
  }, [slotIndex]);

  if (!docInfo) return null;

  const hasSlots = docSlots.some((d) => d.length > 0);
  const selectedDaySlots = docSlots[slotIndex] || [];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero section with background */}
      <section
        className="relative isolate bg-cover bg-center  rounded-2xl"
        style={{ backgroundImage: `url(${assets.hero_bg})` }}
      >
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60 rounded-2xl" /> */}
        <div className="relative mx-auto max-w-6xl px-6 py-10 text-white">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <img
              src={docInfo.image}
              alt={docInfo.name}
              className="h-48 w-48 rounded-2xl object-cover ring-4 ring-white/60"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-3xl font-bold tracking-tight sm:text-4xl">
                  {docInfo.name}
                </h1>

                <div className="relative group flex items-center">
                  <img
                    src={assets.verified_icon}
                    alt="Verified"
                    className="h-5 w-5 cursor-pointer"
                  />

                  {/* Tooltip */}
                  <div className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-3 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    Certification ID: {docInfo.certificationId}
                  </div>
                </div>
              </div>

              <p className="mt-1 text-white/90">
                {docInfo.degree} • {docInfo.speciality}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-white/90 px-3 py-1 font-semibold text-gray-900 ring-1 ring-inset ring-white/20">
                  {docInfo.experience}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white ring-1 ring-inset ring-white/20">
                  Appointment fee: {currencySymbol}
                  {docInfo.fees}
                </span>
              </div>
              <div className="mt-4">
                <a
                  href={docInfo.available ? "#booking" : undefined}
                  title={docInfo.available ? "Book an appointment" : "Doctor not available"}
                  className={`inline-block rounded-lg px-5 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset transition 
                    ${docInfo.available
                      ? "bg-white ring-primary/20 text-black hover:-translate-y-0.5 hover:shadow-md"
                      : "bg-gray-400 cursor-not-allowed text-white ring-gray-300 hover:translate-y-0 hover:shadow-sm"
                    }`}
                  onClick={(e) => {
                    if (!docInfo.available) {
                      e.preventDefault(); // stops navigation
                    }
                  }}
                >
                  Book an appointment
                </a>
              </div>

            </div>
          </div>

          {/* About block */}
          <div className="mt-6 max-w-3xl rounded-2xl bg-white/10 p-4 text-white backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span>About</span>
              <img src={assets.info_icon} alt="Info" className="h-4 w-4 opacity-90" />
            </div>
            <p className="mt-1 text-sm text-white/90">{docInfo.about}</p>
          </div>
        </div>
      </section>

      {/* Booking section */}
      {docInfo.available ? (
      <section id="booking" className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Booking slots</h2>

          {/* Day chips */}
          <div className="mt-4 flex w-full gap-3 overflow-x-auto pb-2">
            {loadingSlots ? (
              <DayChipSkeleton />
            ) : (
              docSlots.map((daySlots, index) => {
                const labelDate =
                  daySlots[0]?.datetime ||
                  new Date(new Date().setDate(new Date().getDate() + index));
                const dow = daysOfWeek[labelDate.getDay()];
                const dom = labelDate.getDate();

                const selected = slotIndex === index;
                return (
                  <button
                    type="button"
                    key={`day_${index}`}
                    onClick={() => setSlotIndex(index)}
                    className={`min-w-[72px] rounded-xl px-3 py-3 text-center text-sm font-semibold transition ${
                      selected
                        ? "bg-primary text-white ring-1 ring-primary/30"
                        : "border border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    <div>{dow}</div>
                    <div className={selected ? "opacity-90" : "text-gray-600"}>{dom}</div>
                  </button>
                );
              })
            )}
          </div>

          {/* Time chips */}
          <div className="mt-4">
            {loadingSlots ? (
              <TimeChipSkeleton />
            ) : selectedDaySlots.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                No available slots for this day. Please choose another day.
              </div>
            ) : (
              <div className="flex w-full flex-wrap gap-3">
                {selectedDaySlots.map((slot, index) => {
                  const selected = slotTime === slot.time;
                  return (
                    <button
                      type="button"
                      key={`time_${slot.time}_${index}`}
                      onClick={() => setSlotTime(slot.time)}
                      className={`flex-shrink-0 rounded-full px-5 py-2 text-sm transition ${
                        selected
                          ? "bg-primary text-white ring-1 ring-primary/30"
                          : "border border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {slot.time.toLowerCase()}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-6">
            <button
              onClick={bookAppointment}
              disabled={loadingSlots || !hasSlots || !slotTime}
              className={`rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition ${
                loadingSlots || !hasSlots || !slotTime
                  ? "cursor-not-allowed bg-primary/50 text-white/90"
                  : "bg-primary text-white ring-1 ring-inset ring-primary/20 hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              {loadingSlots ? "Loading..." : "Book an appointment"}
            </button>
          </div>
        </div>
      </section>
    ) : (
      <section id="booking" className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Doctor is currently not accepting appointments
          </h2>
        </div>
      </section>
    )}


      {/* Related vets */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </section>
    </div>
  );
};

export default Appointments;

/* Skeleton UI bits */
function DayChipSkeleton() {
  return (
    <div className="flex gap-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="min-w-[72px] rounded-xl border border-gray-200 bg-gray-100 py-6"></div>
      ))}
    </div>
  );
}

function TimeChipSkeleton() {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-9 w-24 rounded-full border border-gray-200 bg-gray-100"></div>
      ))}
    </div>
  );
}