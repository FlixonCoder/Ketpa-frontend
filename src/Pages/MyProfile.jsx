import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure <Toaster /> is mounted in your app root
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets_frontend/assets";

const BRAND = "#013cfc";

// Normalize userData shape to avoid undefined access
const normalizeUserData = (u = {}) => ({
  image: u.image ?? "data:image/png;base64,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",
  name: u.name ?? "",
  email: u.email ?? "",
  phone: u.phone ?? "",
  address: {
    line1: u.address?.line1 ?? "",
    line2: u.address?.line2 ?? "",
  },
  gender: u.gender ?? "",
  dob: u.dob ?? "",
  pet: u.pet ?? "",
  aboutPet: u.aboutPet ?? "",
});

export default function MyProfile() {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);

  // Safe version for rendering
  const safeUser = useMemo(() => normalizeUserData(userData || {}), [userData]);

  const [draft, setDraft] = useState(safeUser);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  // File for upload and preview URL for avatar
  const [image, setImage] = useState(false);
  const previewUrlRef = useRef(null);

  // Keep draft in sync with userData when not editing
  useEffect(() => {
    if (!isEdit) setDraft(safeUser);
  }, [safeUser, isEdit]);

  // Cleanup preview blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const inputBase =
    "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#545FF1] focus:ring-2 focus:ring-[#545FF1]/30 outline-none";

  const startEdit = () => {
    setDraft(safeUser);
    setIsEdit(true);
    setImage(false);
  };

  const cancelEdit = () => {
    setDraft(safeUser);
    setIsEdit(false);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setImage(false);
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke any previous preview URL
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setImage(file); // store the file for upload
    setDraft((prev) => ({ ...prev, image: url })); // show preview
  };

  // Use draft to build the payload, not userData (to avoid stale context reads)
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", draft.name ?? "");
      formData.append("phone", draft.phone ?? "");
      formData.append("address", JSON.stringify(draft.address ?? {}));
      formData.append("gender", draft.gender ?? "");
      formData.append("dob", draft.dob ?? "");
      formData.append("aboutPet", draft.aboutPet ?? "");
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated");
        // Optimistic update (optional): reflect changes immediately
        setUserData((prev) => ({
          ...(prev || {}),
          ...draft,
          // If backend returns a new image URL, loadUserProfileData will override this
        }));
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    await updateUserProfileData();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Themed hero header */}
      <section
        className="relative isolate bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${assets.hero_bg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b rounded-lg from-black/60 via-black/40 to-black/20" />
        <div className="relative mx-auto max-w-6xl px-6 py-10 text-white">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Profile</h1>
          <p className="mt-1 text-white/90">Manage your info and preferences</p>
        </div>
      </section>

      {/* Main layout */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: Profile card */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative h-28 w-28">
                  <img
                    src={isEdit ? draft.image : safeUser.image}
                    alt="Profile"
                    className="h-28 w-28 rounded-full border border-gray-200 object-cover ring-4 ring-white"
                  />
                  {isEdit && (
                    <>
                      <label
                        htmlFor="avatar"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#545FF1] shadow ring-1 ring-inset ring-[#545FF1]/20 hover:bg-white"
                      >
                        Change photo
                      </label>
                      <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatar}
                      />
                    </>
                  )}
                </div>
                <div className="min-w-0">
                  {isEdit ? (
                    <input
                      className={`${inputBase} font-semibold`}
                      value={draft.name}
                      onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  ) : (
                    <h2 className="truncate text-xl font-semibold">{safeUser.name}</h2>
                  )}
                  <p className="truncate text-sm text-gray-600">{safeUser.email}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                {!isEdit ? (
                  <button
                    onClick={startEdit}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:border-gray-300"
                  >
                    Edit profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:border-gray-300"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-[#545FF1]/20 transition hover:-translate-y-0.5 hover:shadow-md ${
                        saving ? "bg-[#545FF1]/60 cursor-not-allowed" : "bg-[#545FF1]"
                      }`}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 rounded-lg bg-indigo-50 p-4 text-sm text-indigo-900">
                Keep your details up to date so vets and shelters can reach you easily.
              </div>
            </div>
          </aside>

          {/* Right: Details sections */}
          <main className="lg:col-span-8">
            {/* Contact information */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Contact information</h3>
                {!isEdit && (
                  <button
                    onClick={startEdit}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:border-gray-300"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">Email</label>
                  {isEdit ? (
                    <input
                      disabled
                      className={`${inputBase} bg-gray-50`}
                      value={draft.email}
                    />
                  ) : (
                    <p className="text-gray-700">{safeUser.email}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Email is linked to your account.</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">Phone</label>
                  {isEdit ? (
                    <input
                      className={inputBase}
                      value={draft.phone}
                      onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  ) : (
                    <p className="text-gray-700">{safeUser.phone}</p>
                  )}
                </div>

                {/* Address line 1 */}
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-gray-900">
                    Address line 1
                  </label>
                  {isEdit ? (
                    <input
                      className={inputBase}
                      value={draft.address.line1}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          address: { ...p.address, line1: e.target.value },
                        }))
                      }
                      placeholder="Street, area"
                    />
                  ) : (
                    <p className="text-gray-700">{safeUser.address.line1}</p>
                  )}
                </div>

                {/* Address line 2 */}
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-gray-900">
                    Address line 2
                  </label>
                  {isEdit ? (
                    <input
                      className={inputBase}
                      value={draft.address.line2}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          address: { ...p.address, line2: e.target.value },
                        }))
                      }
                      placeholder="City, State"
                    />
                  ) : (
                    <p className="text-gray-700">{safeUser.address.line2}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Basic information */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Basic information</h3>
                {!isEdit && (
                  <button
                    onClick={startEdit}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:border-gray-300"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Gender */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">Gender</label>
                  {isEdit ? (
                    <select
                      className={inputBase}
                      value={draft.gender}
                      onChange={(e) => setDraft((p) => ({ ...p, gender: e.target.value }))}
                    >
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-binary</option>
                      <option>Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-gray-700">{safeUser.gender}</p>
                  )}
                </div>

                {/* DOB */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">Birth date</label>
                  {isEdit ? (
                    <input
                      type="date"
                      className={inputBase}
                      value={draft.dob}
                      onChange={(e) => setDraft((p) => ({ ...p, dob: e.target.value }))}
                    />
                  ) : (
                    <p className="text-gray-700">{safeUser.dob}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Pet Information */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Pet Information</h3>
                {!isEdit && (
                  <button
                    onClick={startEdit}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:border-gray-300"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* PET */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-900">Pet</label>
                  {isEdit ? (
                    <input
                      disabled
                      className={`${inputBase} bg-gray-50`}
                      value={draft.pet}
                    />
                  ) : (
                    <p className="text-gray-700">{safeUser.pet}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Pet type cannot be changed.</p>
                </div>

                {/* ABOUT PET */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-900">About Pet</label>
                  {isEdit ? (
                    <textarea
                      value={draft.aboutPet}
                      onChange={(e) => setDraft((p) => ({ ...p, aboutPet: e.target.value }))}
                      className={`${inputBase} min-h-[100px]`}
                      placeholder="Write about your pet..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{safeUser.aboutPet}</p>
                  )}
                </div>
              </div>
            </section>


            {/* Actions for mobile (duplicate for better UX) */}
            {isEdit && (
              <div className="mt-6 flex gap-3 sm:hidden">
                <button
                  onClick={cancelEdit}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:border-gray-300"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-[#545FF1]/20 transition hover:-translate-y-0.5 hover:shadow-md ${
                    saving ? "bg-[#545FF1]/60 cursor-not-allowed" : "bg-[#545FF1]"
                  }`}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}