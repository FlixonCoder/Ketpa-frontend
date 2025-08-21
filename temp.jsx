import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const BRAND = "#013cfc";

const Login = () => {
  const {token,setToken, backendUrl} = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setState] = useState("Sign Up"); // 'Sign Up' | 'Login'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pet,setPet] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        const {data} = await axios.post(backendUrl + '/api/user/register', {name,password,email,pet})
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        const {data} = await axios.post(backendUrl + '/api/user/login', {password,email})
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token])

  return (
    <div className="relative isolate min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 rounded-3xl bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.hero_bg})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-black/50 via-black/40 to-black/30"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-md md:grid-cols-2">
          {/* Left panel (brand/story) */}
          <div className="relative hidden flex-col justify-between bg-white/0 p-8 text-white md:flex">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                Welcome to Ketpa
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight">Pet care, simplified</h1>
              <p className="mt-2 text-white/90">
                Book verified vets, get adoption alerts, and shop curated essentials—starting in Bengaluru.
              </p>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="mt-0.5 text-emerald-300" />
                <span>Find and book trusted veterinarians quickly</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="mt-0.5 text-emerald-300" />
                <span>Adoption alerts from shelters and the community</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="mt-0.5 text-emerald-300" />
                <span>Curated store for quality food, toys, and accessories</span>
              </li>
            </ul>
            <div className="mt-8 text-xs text-white/80">
              By using Ketpa you agree to our Terms and Privacy Policy.
            </div>
          </div>

          {/* Right panel (form) */}
          <div className="bg-white/90 p-6 backdrop-blur-md sm:p-8">
            <form onSubmit={onSubmitHandler} className="space-y-4">
              {/* Title + Subtitle (matches attached structure) */}
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {state === "Sign Up" ? "Create Account" : "Login"}
                </p>
                <p className="text-sm text-gray-600">
                  Please {state === "Sign Up" ? "sign up" : "log in"} to book appointment
                </p>
              </div>

              {/* Full Name (Sign Up only) */}
              {state === "Sign Up" && (
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-900">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Riya Sharma"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-500 focus:border-[#013cfc] focus:ring-2 focus:ring-[#013cfc]/30"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-500 focus:border-[#013cfc] focus:ring-2 focus:ring-[#013cfc]/30"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-900">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={state === "Sign Up" ? "Create a password" : "Your password"}
                  autoComplete={state === "Sign Up" ? "new-password" : "current-password"}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-500 focus:border-[#013cfc] focus:ring-2 focus:ring-[#013cfc]/30"
                />
              </div>

              {/* Pet */}
              {state === "Sign Up" && (
                <div>
                  <label htmlFor="pet" className="mb-1 block text-sm font-medium text-gray-900">
                    Pet - Species
                  </label>
                  <input
                    id="pet"
                    name="pet"
                    type="text"
                    value={pet}
                    onChange={(e) => setPet(e.target.value)}
                    placeholder="e.g., Dog - Golden Retrievers,   Cat - Maine Coon"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-500 focus:border-[#013cfc] focus:ring-2 focus:ring-[#013cfc]/30"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#013cfc] px-4 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-[#013cfc]/20 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {state === "Sign Up" ? "Create Account" : "Login"}
              </button>

              {/* Toggle Sign Up / Login (matches attached structure) */}
              {state === "Sign Up" ? (
                <p className="text-sm text-gray-700">
                  Already have an account?{" "}
                  <span
                    className="cursor-pointer font-semibold text-[#013cfc] underline"
                    onClick={() => setState("Login")}
                  >
                    Login here
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-700">
                  Create a new account?{" "}
                  <span
                    className="cursor-pointer font-semibold text-[#013cfc] underline"
                    onClick={() => setState("Sign Up")}
                  >
                    Click here
                  </span>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Subtle brand bubble */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${BRAND}33, transparent 70%)`,
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default Login;