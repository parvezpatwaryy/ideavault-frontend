"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingIdeas, setTrendingIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  const slides = [
    {
      title: "Bring Your Next Big Tech Idea to Life",
      description: "Share, validate, and collaborate with innovators and entrepreneurs worldwide. Turn concepts into reality.",
    },
    {
      title: "Crowdsource Feedback for Your Startup",
      description: "Get real, case-insensitive, actionable insights and reviews from developers and tech enthusiasts.",
    },
    {
      title: "Discover Trending Micro-SaaS Concepts",
      description: "Explore what the world is building today. Filter by technology, education, or AI categories seamlessly.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trending-ideas`)
      .then((res) => res.json())
      .then((data) => {
        setTrendingIdeas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trending ideas:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white h-[500px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-3xl transition-all duration-700 ease-in-out">
            <span className="inline-block px-3 py-1 bg-indigo-500/30 text-indigo-300 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
              🚀 Spark Your Creativity
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 min-h-[120px] sm:min-h-[auto]">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              {slides[currentSlide].description}
            </p>
            <div>
              <a
                href="#trending-section"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Explore Ideas &rarr;
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-indigo-500 w-8" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </section>

      <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              ["6+", "Trending ideas"],
              ["3", "Discovery slides"],
              ["24/7", "Community feedback"],
              ["100%", "Responsive design"],
            ].map(([value, label]) => (
              <div key={label} className="py-4">
                <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="trending-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
            🔥 Trending Ideas
          </h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : trendingIdeas.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg">
            No trending ideas found in the database! 💡
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingIdeas.map((idea) => (
              <div
                key={idea._id}
                className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={idea.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"} 
                    alt={idea.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/90 text-indigo-700 dark:bg-indigo-950/90 dark:text-indigo-300 backdrop-blur-sm">
                    {idea.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {idea.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-3 flex-1 leading-relaxed">
                      {idea.shortDescription || idea.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800/60 text-xs text-gray-500 dark:text-gray-400 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-400 dark:text-gray-500">Target:</span>{" "}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{idea.targetAudience}</span>
                      </div>
                      {idea.budget && (
                        <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                          Budget: {idea.budget}
                        </div>
                      )}
                    </div>
                    
                    {idea.authorName && (
                      <div className="text-gray-400 dark:text-gray-500">
                        By: <span className="font-semibold text-gray-700 dark:text-gray-300">{idea.authorName}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/ideas/${idea._id}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-200 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">💡 Discover by Frameworks & Niches</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Filter out startup ideas specific to your technical expertise or interest areas.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Artificial Intelligence", "Health-Tech", "SaaS & Tools", "E-Education", "Fintech", "Web3 / Crypto"].map((cat, i) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-between mx-auto font-bold mb-3 justify-center group-hover:scale-110 transition-transform">
                  {i === 0 ? "🤖" : i === 1 ? "🏥" : i === 2 ? "🛠️" : i === 3 ? "🎓" : i === 4 ? "💳" : "🪙"}
                </div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{cat}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">How IdeaVault Works</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Move from rough idea to community-validated concept with a simple workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["Share", "Publish your startup idea with the problem, solution, audience, and estimated budget."],
              ["Validate", "Collect comments from other users and refine weak points before building."],
              ["Track", "Manage your own ideas and interactions from private dashboard pages."],
            ].map(([title, description], index) => (
              <div key={title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 mt-2">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
