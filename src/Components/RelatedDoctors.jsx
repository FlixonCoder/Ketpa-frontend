import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors = [] } = useContext(AppContext);
  const navigate = useNavigate();

  const [relDoc, setRelDocs] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDocs(doctorsData);
    } else {
      setRelDocs([]);
    }
  }, [doctors, speciality, docId]);

  const goToDoctor = (id) => {
    navigate(`/appointment/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Top vets to book
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Browse trusted vets available in your area
        </p>
      </div>

      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {relDoc.slice(0, 8).map((item) => (
          <button
            key={item._id}
            type="button"
            onClick={() => goToDoctor(item._id)}
            className="group text-left overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label={`View ${item.name}'s profile`}
          >
            <div className="relative h-44 w-full bg-gray-50">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  No image
                </div>
              )}
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                Available
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2">
                <p className="truncate text-base font-semibold text-gray-900">
                  {item.name}
                </p>
                <img
                  src={assets.verified_icon}
                  alt="Verified"
                  className="h-4 w-4 opacity-90"
                />
              </div>
              <p className="mt-0.5 truncate text-sm text-gray-600">
                {Array.isArray(item.speciality)
                  ? item.speciality.join(", ")
                  : item.speciality}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {item.experience && (
                  <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {item.experience}
                  </span>
                )}
                {item.fees !== undefined && (
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/15">
                    Fee: ₹{item.fees}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {relDoc.length === 0 && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-700">
          No related vets found. Explore more to find the right match.
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            navigate("/find-vets");
            window.scrollTo({
              top: document.getElementById("findVets")?.offsetTop || 0,
              behavior: "smooth",
            });
          }}

          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-primary/20 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Browse all vets
        </button>
      </div>
    </section>
  );
};

export default RelatedDoctors;