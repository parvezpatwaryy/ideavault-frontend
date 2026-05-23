"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "../lib/auth-client";

export default function AddIdeaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    detailedDescription: "",
    category: "Tech", 
    tags: "",
    imageUrl: "",
    budget: "",
    targetAudience: "",
    problemStatement: "",
    proposedSolution: "",
  });

  useEffect(() => {
    if (!isPending && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, pathname, router, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const finalData = {
      ...formData,
      userEmail: user.email, 
      userName: user.name || user.email,         
      createdAt: new Date(),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Your startup idea has been saved!");
        e.target.reset();
        router.push("/ideas"); 
      } else {
        toast.error(data.message || "Failed to save your idea.");
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (isPending || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
      <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-8">
        💡 Share a New Startup Idea
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Idea Title *</label>
          <input
            type="text"
            name="title"
            required
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder="e.g., AI Smart Waste Management"
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category *</label>
            <select
              name="category"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100"
              onChange={handleChange}
            >
              <option value="Tech">Tech</option>
              <option value="AI">AI</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
              placeholder="https://example.com/image.jpg"
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Short Description *</label>
          <input
            type="text"
            name="shortDescription"
            required
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder="A one-line summary of your startup"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Detailed Description *</label>
          <textarea
            name="detailedDescription"
            required
            rows="4"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder="Describe your idea, business model, and expected impact"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags</label>
            <input
              type="text"
              name="tags"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
              placeholder="AI, SaaS, B2B"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Estimated Budget</label>
            <input
              type="number"
              name="budget"
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
              placeholder="5000"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Audience *</label>
            <input
              type="text"
              name="targetAudience"
              required
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
              placeholder="Students, founders, SMEs"
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Problem Statement *</label>
          <textarea
            name="problemStatement"
            required
            rows="3"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder="What problem does your startup solve?"
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Proposed Solution *</label>
          <textarea
            name="proposedSolution"
            required
            rows="3"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder="How does your startup solve this problem?"
            onChange={handleChange}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-md mt-4"
        >
          Submit Idea
        </button>
      </form>
    </div>
  );
}
