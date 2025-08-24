import React, { useContext, useEffect, useMemo, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { FaCheckCircle } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BRAND = "#013cfc";

// Simple validators
const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());
const isPhone = (v) => !v || /^\+?[0-9 ()-]{7,}$/.test(v);
const isStrongPassword = (v) => (v || "").length >= 6; // adjust if needed

const Login = () => {
  const { token, setToken, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up"); // 'Sign Up' | 'Login' | 'VerifyOtp'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pet, setPet] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputBase =
    "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#013cfc] focus:ring-2 focus:ring-[#013cfc]/30 outline-none transition";

  // Validation
  const errors = useMemo(() => {
    const e = {};
    if (state === "Sign Up") {
      if (!name || name.trim().length < 2) e.name = "Please enter your full name.";
      if (!isEmail(email)) e.email = "Enter a valid email.";
      if (!isPhone(phone)) e.phone = "Enter a valid phone number.";
      if (!isStrongPassword(password)) e.password = "Password must be at least 6 characters.";
      if (confirmPassword !== password) e.confirmPassword = "Passwords do not match.";
      // pet is optional; add validation if needed
    } else if (state === "Login") {
      if (!isEmail(email)) e.email = "Enter a valid email.";
      if (!password) e.password = "Password is required.";
    } else if (state === "VerifyOtp") {
      if (!otp || otp.length !== 6) e.otp = "Enter the 6-digit OTP.";
      if (!isEmail(email)) e.email = "Email is missing or invalid.";
    }
    return e;
  }, [state, name, email, phone, password, confirmPassword, otp]);

  const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

  // Redirect on auth
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  // OTP cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    if (!isEmail(email)) {
      toast.error("Enter a valid email first.");
      return;
    }
    try {
      setResendLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/user/resend-otp`, { email });
      if (data.success) {
        toast.success("OTP resent to your email");
        setResendCooldown(30);
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!canSubmit || submitting) {
      if (!canSubmit) toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setSubmitting(true);
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          password,
          email,
          phone,
          confirmPassword,
          pet,
        });
        if (data?.success) {
          toast.success("OTP sent to your email. Please verify.");
          setState("VerifyOtp");
          setResendCooldown(30);
        } else {
          toast.error(data?.message || "Registration failed");
        }
      } else if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          password,
          email,
        });
        if (data?.success) {
          localStorage.setItem("token", data.token);
          toast.success(data.message || "Logged in");
          setToken(data.token);
        } else {
          toast.error(data?.message || "Login failed");
        }
      } else if (state === "VerifyOtp") {
        const { data } = await axios.post(`${backendUrl}/api/user/verify-otp`, {
          email,
          otp,
        });
        if (data?.success) {
          localStorage.setItem("token", data.token);
          toast.success("Email verified successfully!");
          setToken(data.token);
        } else {
          toast.error(data?.message || "Verification failed");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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
          {/* Left panel */}
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {state === "Sign Up" ? "Create Account" : state === "Login" ? "Login" : "Verify Email"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {state === "VerifyOtp"
                      ? "Enter the OTP sent to your email"
                      : `Please ${state === "Sign Up" ? "sign up" : "log in"} to book appointment`}
                  </p>
                </div>
                {/* Quick toggle */}
                <div className="hidden gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => setState("Login")}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      state === "Login" ? "bg-[#013cfc] text-white" : "border border-gray-200 text-gray-700"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setState("Sign Up")}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      state === "Sign Up" ? "bg-[#013cfc] text-white" : "border border-gray-200 text-gray-700"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Sign Up Fields */}
              {state === "Sign Up" && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Riya Sharma"
                      className={`${inputBase} ${errors.name ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && <p id="name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className={`${inputBase} ${errors.email ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "su-email-error" : undefined}
                    />
                    {errors.email && <p id="su-email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className={`${inputBase} ${errors.phone ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && <p id="phone-error" className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>

                  <div className="relative">
                    <label className="mb-1 block text-sm font-medium text-gray-900">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={(e) => setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock"))}
                      placeholder="Create a password"
                      className={`${inputBase} pr-11 ${errors.password ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-9 text-gray-500"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                    {capsLockOn && (
                      <p className="mt-1 text-xs text-amber-600">Caps Lock is on</p>
                    )}
                    {errors.password && <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  </div>

                  <div className="relative">
                    <label className="mb-1 block text-sm font-medium text-gray-900">Confirm Password</label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className={`${inputBase} pr-11 ${errors.confirmPassword ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-3 top-9 text-gray-500"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                    {errors.confirmPassword && <p id="confirm-error" className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">Pet - Species</label>
                    <input
                      type="text"
                      value={pet}
                      onChange={(e) => setPet(e.target.value)}
                      placeholder="e.g., Dog - Golden Retriever"
                      className={inputBase}
                    />
                  </div>
                </>
              )}

              {/* Login Fields */}
              {state === "Login" && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className={`${inputBase} ${errors.email ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "login-email-error" : undefined}
                    />
                    {errors.email && <p id="login-email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <div className="relative">
                    <label className="mb-1 block text-sm font-medium text-gray-900">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={(e) => setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock"))}
                      placeholder="Your password"
                      className={`${inputBase} pr-11 ${errors.password ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "login-password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-9 text-gray-500"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                    {capsLockOn && <p className="mt-1 text-xs text-amber-600">Caps Lock is on</p>}
                    {errors.password && <p id="login-password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  </div>
                </>
              )}

              {/* OTP Verification */}
              {state === "VerifyOtp" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className={`${inputBase} ${errors.otp ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`}
                    aria-invalid={!!errors.otp}
                    aria-describedby={errors.otp ? "otp-error" : undefined}
                  />
                  {errors.otp && <p id="otp-error" className="mt-1 text-xs text-red-600">{errors.otp}</p>}

                  {/* Resend OTP */}
                  <p className="mt-2 text-sm text-gray-600">
                    Didn’t get the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendLoading || resendCooldown > 0}
                      className={`font-medium ${
                        resendLoading || resendCooldown > 0
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#013cfc] hover:underline"
                      }`}
                    >
                      {resendLoading ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                    </button>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className={`w-full rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset transition ${
                  !canSubmit || submitting
                    ? "bg-[#013cfc]/60 cursor-not-allowed ring-[#013cfc]/10"
                    : "bg-[#013cfc] ring-[#013cfc]/20 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing...
                  </span>
                ) : state === "Sign Up" ? (
                  "Create Account"
                ) : state === "Login" ? (
                  "Login"
                ) : (
                  "Verify OTP"
                )}
              </button>

              {/* Toggle */}
              {state === "Sign Up" && (
                <p className="text-sm text-gray-700">
                  Already have an account?{" "}
                  <span className="cursor-pointer font-semibold text-[#013cfc] underline" onClick={() => setState("Login")}>
                    Login here
                  </span>
                </p>
              )}
              {state === "Login" && (
                <p className="text-sm text-gray-700">
                  Create a new account?{" "}
                  <span className="cursor-pointer font-semibold text-[#013cfc] underline" onClick={() => setState("Sign Up")}>
                    Click here
                  </span>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full"
        style={{ background: `radial-gradient(closest-side, ${BRAND}33, transparent 70%)` }}
        aria-hidden="true"
      />
    </div>
  );
};

export default Login;