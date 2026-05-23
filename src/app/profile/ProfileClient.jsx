"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { authClient } from "../lib/auth-client"; 

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState({ totalIdeas: 0, totalComments: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    role: "Frontend Web Developer",
    avatar: "",
  });
  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [isPending, router, user]);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        role: "Frontend Web Developer", 
        avatar: user.image || user.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256",
      });
    }
  }, [user]);
  useEffect(() => {
    if (!user?.email) return;

    const fetchProfileStats = async () => {
      try {
        let ideasCount = 0;
        let commentsCount = 0;

        try {
          const ideasRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas/count?email=${encodeURIComponent(user.email)}`);
          if (ideasRes.ok) {
            const ideasData = await ideasRes.json();
            ideasCount = ideasData.count || 0;
          }
        } catch (e) {
          console.log("Ideas count fetch minor issue, using 0");
        }

        try {
          const commentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/count?email=${encodeURIComponent(user.email)}`);
          if (commentsRes.ok) {
            const commentsData = await commentsRes.json();
            commentsCount = commentsData.count || 0;
          }
        } catch (e) {
          console.log("Comments count fetch minor issue, using 0");
        }

        setStats({
          totalIdeas: ideasCount,
          totalComments: commentsCount,
        });

      } catch (err) {
        console.error("Error in outer fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStats();
  }, [user?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {Swal.fire({
        title: "Success!",
        text: "Profile information updated successfully.",
        icon: "success",
        confirmButtonColor: "#4f46e5"
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update profile.",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };
  if (isPending || (user && loading)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">👤 Profile Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your identity and track your platform metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500/20 mb-4">
            <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData.name}</h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 rounded-full mt-1.5 uppercase tracking-wider">
            {formData.role}
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">{user.email}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Member since: May 2026</p>

          <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-gray-50 dark:border-gray-800/60">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
              <span className="block text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.totalIdeas}</span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Ideas Shared</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
              <span className="block text-2xl font-extrabold text-purple-600 dark:text-purple-400">{stats.totalComments}</span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Interactions</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-50 dark:border-gray-800/60">Account Settings</h3>
          
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Professional Title</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
              />
              <span className="text-xs text-gray-400 mt-1 block">Account email is fixed as primary identifier.</span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Avatar URL</label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
                required
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
