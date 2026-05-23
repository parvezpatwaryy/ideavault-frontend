"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ideas?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
        );
        if (res.ok) {
          let data = await res.json();
          if (sortBy === "Newest") {
            data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          } else if (sortBy === "Budget: Low to High") {
            data.sort((a, b) => Number(a.budget || 0) - Number(b.budget || 0));
          } else if (sortBy === "Budget: High to Low") {
            data.sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0));
          }

          setIdeas(data);
        }
      } catch (error) {
        console.error("Error fetching ideas from dataall collection:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchIdeas();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sortBy]);

  return (
    <div className="max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Browse Ideas</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Discover innovative concepts shared by the community.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ideas by title..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100 shadow-sm"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100 shadow-sm cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Environment">Environment</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100 shadow-sm cursor-pointer"
          >
            <option value="Newest">Newest</option>
            <option value="Budget: Low to High">Budget: Low to High</option>
            <option value="Budget: High to Low">Budget: High to Low</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <span className="text-4xl">💡</span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4">No Ideas Found</h3>
          <p className="text-sm text-gray-400 mt-1">Try resetting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ideas.map((idea) => (
            <div
              key={idea._id}
              className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={idea.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600"}
                  alt={idea.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-indigo-600 dark:text-indigo-400 backdrop-blur-md rounded-full shadow-sm">
                  {idea.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {idea.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 flex-grow">
                  {idea.shortDescription}
                </p>
                <div className="mt-5 pt-4 border-t border-gray-50 dark:border-gray-800/50 flex flex-col gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <div className="flex justify-between">
                    <span>Target: <strong className="text-gray-600 dark:text-gray-300 font-medium">{idea.targetAudience || "General"}</strong></span>
                    {idea.budget && (
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Budget: ${idea.budget}</span>
                    )}
                  </div>
                  <div className="text-left mt-1">
                    By: <span className="font-medium text-gray-600 dark:text-gray-300">{idea.userName || "Parvez Patwary"}</span>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    href={`/ideas/${idea._id}`}
                    className="block w-full text-center py-2.5 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/40 dark:hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl text-sm border border-slate-100 dark:border-slate-800/60 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}