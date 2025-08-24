import React, { useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaPaperPlane,
  FaPaw,
} from "react-icons/fa";

export default function ContactPage() {
  const SUPPORT_EMAIL = "ketpaforpets@gmail.com";
  const SUPPORT_PHONE = "+91 96208 17650";

  const initialForm = {
    fullName: "",
    email: "",
    phone: "",
    petName: "",
    petType: "",
    subject: "",
    contactMethod: "email",
    message: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ sending: false, sent: false });

  const inputBase =
    "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#545FF1] focus:ring-2 focus:ring-[#545FF1]/40 outline-none";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Please share a few details.";
    return e;
    // Phone optional; subject optional; pet info optional.
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setStatus({ sending: true, sent: false });

    const subject = form.subject
      ? `Ketpa Contact: ${form.subject}`
      : "Ketpa Contact";
    const body = [
      `Name: ${form.fullName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "—"}`,
      `Pet: ${form.petName || "—"} (${form.petType || "—"})`,
      `Preferred contact: ${form.contactMethod}`,
      "",
      "Message:",
      form.message,
    ].join("\n");

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Open email client
    window.location.href = mailto;

    // UX feedback
    setTimeout(() => {
      setStatus({ sending: false, sent: true });
      setForm(initialForm);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero with themed background */}
      <section
        className="relative isolate bg-cover bg-center rounded-xl"
        style={{ backgroundImage: `url(${assets.hero_bg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
      >
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30 rounded-xl" /> */}
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
              Contact Ketpa
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Let’s chat! We’re all ears (and paws)
            </h1>
            <p className="mt-3 text-white/90">
              Got questions? Need help? Want to share a cute pet photo? Reach out and
              we’ll get back to you faster than a cat knocking things off a table.
            </p>

            {/* Quick actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <FaPhoneAlt /> Call us
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <FaEnvelope /> Email us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Contact form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold">Drop us a line! 📩</h2>
              <p className="mt-1 text-gray-600">
                Tell us about you and your furry friend—how can we help?
              </p>

              {status.sent && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  Thanks! We opened your email client with a pre‑filled message. If it didn’t open,
                  email us at <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a>.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Your name
                    </label>
                    <input
                      name="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors.fullName ? "border-red-400 ring-2 ring-red-200" : ""
                      }`}
                      placeholder="The human’s name"
                      aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors.email ? "border-red-400 ring-2 ring-red-200" : ""
                      }`}
                      placeholder="your.email@example.com"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Phone (optional)
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="For quick follow‑ups"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="">Choose a topic</option>
                      <option>Find a vet</option>
                      <option>Adoption</option>
                      <option>Order support</option>
                      <option>Partnerships</option>
                      <option>General question</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Pet’s name (optional)
                    </label>
                    <input
                      name="petName"
                      type="text"
                      value={form.petName}
                      onChange={handleChange}
                      className={inputBase}
                      placeholder="The real boss of the house 🐾"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Pet type
                    </label>
                    <select
                      name="petType"
                      value={form.petType}
                      onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="">Choose your sidekick</option>
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Bird</option>
                      <option>Rabbit</option>
                      <option>Reptile</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Preferred contact method */}
                <div>
                  <span className="mb-1 block text-sm font-medium text-gray-900">
                    Preferred contact
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: "email", label: "Email" },
                      { value: "phone", label: "Phone" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold ${
                          form.contactMethod === opt.value
                            ? "border-[#545FF1] bg-indigo-50 text-[#545FF1]"
                            : "border-gray-200 text-gray-900 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="contactMethod"
                          value={opt.value}
                          checked={form.contactMethod === opt.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputBase} ${
                      errors.message ? "border-red-400 ring-2 ring-red-200" : ""
                    }`}
                    placeholder="Tell us your story, ask a question, or just say hi!"
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status.sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-[#545FF1]/20 transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FaPaperPlane />
                  {status.sending ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
            {/* Fun fact */}
            <div className="rounded-2xl mt-5 border border-indigo-200 bg-indigo-50 p-6 text-indigo-900 shadow-sm">
              <div className="mb-3 mt-3 flex items-center justify-center gap-2 text-primary">
                <FaPaw />
                <h4 className="font-semibold">Fun fact!</h4>
              </div>
              <p className="mb-5 flex items-center justify-center">
                Our office has 5 resident cats, 2 dogs, and 1 very judgmental parrot named
                Sherlock.
              </p>
            </div>
          </div>

          {/* Contact info & extras */}
          <div className="lg:col-span-5">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {/* Phone */}
              <InfoCard
                icon={<FaPhoneAlt />}
                title="Call us"
                subtitle="For urgent pet emergencies"
                emphasis={SUPPORT_PHONE}
                // note="Available 24/7"
              />
              {/* Email */}
              <InfoCard
                icon={<FaEnvelope />}
                title="Email us"
                subtitle="For general inquiries"
                emphasis={SUPPORT_EMAIL}
                note="We reply within 4 hours"
              />
              {/* HQ */}
              <InfoCard
                icon={<FaMapMarkerAlt />}
                title="Headquarters"
                subtitle={
                  <>
                    Koramangala, Bangalore
                    <br />
                    Karnataka 560034, India
                  </>
                }
              />
              {/* Hours */}
              <InfoCard
                icon={<FaClock />}
                title="Office hours"
                subtitle={
                  <>
                    Mon–Fri: 9 AM – 6 PM
                    <br />
                    Sat: 10 AM – 4 PM
                    <br />
                    Sun: Closed
                  </>
                }
              />

              {/* Map (optional) */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <div className="h-56 w-full">
                  <iframe
                    title="Ketpa HQ Map"
                    src="https://www.google.com/maps?q=Koramangala%2C%20Bengaluru&output=embed"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small CTA strip */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-gray-700">
            Prefer chatting later? No problem—email us anytime at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-primary underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

/* Reusable info card */
function InfoCard({ icon, title, subtitle, emphasis, note }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mt-1 text-primary">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
        {emphasis && (
          <p className="mt-1 font-semibold text-primary">{emphasis}</p>
        )}
        {note && <p className="text-xs text-gray-400">{note}</p>}
      </div>
    </div>
  );
}