import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const About = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* HERO with hero_bg */}
      <section
        className="relative isolate bg-fixed bg-cover bg-center rounded-2xl"
        style={{ backgroundImage: `url(${assets.hero_bg})`, backgroundAttachment: "fixed", backgroundSize: "cover", backgroundPosition: "center"}}
        aria-label="About Ketpa hero"
      >
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60 rounded-2xl" /> */}
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-3xl text-center text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
              About Ketpa
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Pet care, simplified—for Bengaluru
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Ketpa brings together verified veterinarians, responsible adoption, and curated
              essentials so pet parents in Bengaluru can care with confidence—right from one friendly
              platform.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <a
                href="/login"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-[#545FF1]/20 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Get started
              </a>
              <a
                href="/find-vets"
                className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Find a vet
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* One-liner / Elevator pitch */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="relative -mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-indigo-900 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#545FF1]">
            In one line
          </p>
          <p className="mt-1 text-base">
            Ketpa is an all-in-one platform that helps pet parents in Bengaluru find trusted vets,
            discover adoption opportunities, and shop curated essentials—simple, reliable, and built
            for real life.
          </p>
        </div>
      </section>

      {/* Mission + Story */}
      <section id="mission" className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-primary">Our mission</h2>
            <p className="mt-3 text-gray-600">
              We’re on a mission to make pet care joyful and stress‑free by unifying trusted people,
              products, and tools in one place. From the first hello to lifelong wellness, Ketpa
              grows with you and your best friend.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Our story</h3>
            <p className="mt-3 text-gray-600">
              Caring for a pet should feel easy, not overwhelming. That’s why we built Ketpa—an
              integrated platform designed for the vibrant community of pet lovers in Bengaluru. We
              connect you to verified veterinarians, ethical adoption partners, and high‑quality
              essentials in a single, user‑friendly space. Whether you’re welcoming a new companion
              or keeping an old friend happy and healthy, Ketpa is here to help—every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* How Ketpa helps */}
      <section className="mx-auto max-w-6xl px-6 pb-6">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">How Ketpa helps</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary">
              <StethoscopeIcon />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Vet Connections</h3>
            <p className="mt-2 text-gray-600">
              Find the right care fast. Browse a verified directory of veterinarians in Bengaluru,
              check reviews and availability, and book appointments in a few taps—no phone tag, no
              guesswork.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary">
              <BellIcon />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Adoption Alerts</h3>
            <p className="mt-2 text-gray-600">
              Meet your next family member, responsibly. Get updates from trusted shelters and
              community listings, follow animals you love, and connect with caretakers to complete
              safe, joyful adoptions.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary">
              <BagIcon />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Curated E‑commerce</h3>
            <p className="mt-2 text-gray-600">
              Shop smarter for the ones who can’t shop for themselves. Explore a handpicked
              selection of food, toys, and accessories—quality products chosen with health, comfort,
              and value in mind.
            </p>
          </div>
        </div>
      </section>

      {/* Built for Bengaluru */}
      <section className="mx-auto max-w-6xl px-6 pb-14 sm:pb-16">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-primary">
              <MapPinIcon />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Built for Bengaluru</h3>
              <p className="mt-1 text-gray-600">
                We’re launching in Bengaluru first to stay close to our community—listening,
                learning, and improving quickly. More cities are on the way as we grow with you.
              </p>
            </div>
          </div>
          <a
            href="/find-vets"
            className="w-[120px] h-[50px] rounded-lg bg-primary px-4 py-2 text-sm font-semibold flex items-center justify-center text-white shadow-sm ring-1 ring-inset ring-[#545FF1]/20 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Find a vet
          </a>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6 pb-8 sm:pb-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">What we stand for</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ValueCard
            title="Trust & Safety"
            desc="Verified vets, ethical adoption, and clear information at every step."
            icon={<ShieldIcon />}
          />
          <ValueCard
            title="Community First"
            desc="We prioritize people, pets, and long‑term well‑being over quick wins."
            icon={<UsersIcon />}
          />
          <ValueCard
            title="Simplicity by Design"
            desc="Clean, intuitive experiences that save time and reduce stress."
            icon={<SparklesIcon />}
          />
          <ValueCard
            title="Compassion at Scale"
            desc="Thoughtful choices that lead to happier pets and happier homes."
            icon={<HeartHandsIcon />}
          />
        </div>
      </section>

      {/* Team with soft themed bg */}
      <section
        className="relative py-16 rounded-2xl"
        style={{
          backgroundImage: `url(${assets.hero_bw})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gray-200 opacity-80 backdrop-blur-[4px] rounded-2xl" />
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center text-3xl font-semibold text-gray-900">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <img
                src={assets.profile_pic}
                alt="Team member Krishna"
                className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-primary object-cover"
              />
              <h3 className="text-lg font-bold text-gray-900">Krishna Shetty</h3>
              <p className="text-primary mb-2 font-medium">Founding Team</p>
              <p className="text-sm text-gray-600">
                Product-focused professional dedicated to designing reliable, user-friendly solutions that transform everyday pet care.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <img
                src={assets.profile_pic}
                alt="Team member Sarah"
                className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-primary object-cover"
              />
              <h3 className="text-lg font-bold text-gray-900">Sarah Zia Rasheed</h3>
              <p className="text-primary mb-2 font-medium">Founding Team</p>
              <p className="text-sm text-gray-600">
                Community-driven innovator connecting pet owners, vets, and shelters through impactful technology and strategic collaboration.
              </p>
            </div>

            {/* Card 3 (placeholder / open role) */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <img
                src={assets.profile_pic}
                alt="Team member Atharva"
                className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-primary object-cover"
              />
              <h3 className="text-lg font-bold text-gray-900">Atharva Jorapur</h3>
              <p className="text-primary mb-2 font-medium">Founding Team</p>
              <p className="text-sm text-gray-600">
                Visionary leader driving Ketpa’s growth, fostering innovation, and delivering meaningful solutions for the pet care ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="sr-only">Numbers we’re proud of</h2>
        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
          <StatCard value="500+" label="Pets adopted into loving homes" />
          <StatCard value="200+" label="Verified veterinarians in our network" />
          <StatCard value="1,000+" label="Happy customers in our community" />
        </div>
      </section>

      {/* Closing CTA with hero_bg */}
      <section className="relative overflow-hidden" aria-label="Join Ketpa">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-2xl"
          style={{ backgroundImage: `url(${assets.hero_bg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-primary rounded-2xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 text-center text-white">
          <h2 className="text-2xl font-semibold">This is just the beginning</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/90">
            Join us in making pet ownership simple, joyful, and stress‑free—starting in Bengaluru
            and growing with you.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="/login"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Get started on Ketpa
            </a>
            <a
              href="/find-vets"
              className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Find a vet
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

/* Small UI helpers */
const StatCard = ({ value, label }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
    <h3 className="text-4xl font-bold text-primary">{value}</h3>
    <p className="mt-2 text-gray-600">{label}</p>
  </div>
);

const ValueCard = ({ title, desc, icon }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-600">{desc}</p>
    </div>
  </div>
);

/* Icons */
const StethoscopeIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 3a1 1 0 0 0-1 1v5a4 4 0 0 0 8 0V4a1 1 0 1 0-2 0v5a2 2 0 0 1-4 0V4a1 1 0 0 0-1-1zM18 11a3 3 0 0 0-3 3v3a3 3 0 1 0 2 0v-3a1 1 0 1 1 2 0 1 1 0 1 0 2 0 3 3 0 0 0-3-3z" />
  </svg>
);

const BellIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a6 6 0 0 0-6 6v3.1l-1.8 3.6A1 1 0 0 0 5 16h14a1 1 0 0 0 .9-1.3L18 11.1V8a6 6 0 0 0-6-6zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z" />
  </svg>
);

const BagIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 7V6a5 5 0 0 1 10 0v1h2a1 1 0 0 1 1 1v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a1 1 0 0 1 1-1h2zm2 0h6V6a3 3 0 0 0-6 0v1z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l8 4v6c0 5-3.4 9.6-8 10-4.6-.4-8-5-8-10V6l8-4z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM8 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm8 2c-3 0-6 1.5-6 4v1h12v-1c0-2.5-3-4-6-4zM8 15c-2.97 0-6 1.48-6 4v1h6v-1.5a5 5 0 0 1 2.2-4.1A10.2 10.2 0 0 0 8 15z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4zm8 10l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM5 13l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
  </svg>
);

const HeartHandsIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.1 9.1l1.8-1.7a4.2 4.2 0 016 6l-5.9 5.6a2.8 2.8 0 01-3.8 0l-5.9-5.6a4.2 4.2 0 116-6l1.8 1.7z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 112.5-2.5A2.5 2.5 0 0112 11.5z" />
  </svg>
);

export default About;