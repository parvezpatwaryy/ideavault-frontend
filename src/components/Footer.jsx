"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                IdeaVault
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A crowd-sourced platform to share, validate, and collaborate on startup ideas.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5">
              {[
                ["/", "Home"],
                ["/ideas", "Ideas"],
                ["/add-idea", "Add Idea"],
                ["/my-ideas", "My Ideas"],
                ["/my-interactions", "My Interactions"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Technology</li>
              <li>Artificial Intelligence</li>
              <li>Health</li>
              <li>Education</li>
              <li>Finance</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Email: support@ideavault.dev</li>
              <li>Location: Dhaka, Bangladesh</li>
              <li>Response: Within 24 hours</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Social
            </h3>
            <p className="text-sm text-slate-400 mb-4">Follow project updates and developer work.</p>
            <div className="flex space-x-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 text-slate-300"
                title="X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.8L1.8 2h6.8l4.7 6.2L18.9 2Zm-1.2 17.9h1.8L7.6 4H5.7l12 15.9Z" /></svg>
              </a>
              <a
                href="https://github.com/parvezpatwaryy"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 text-slate-300"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>
              <a
                href="https://www.linkedin.com/in/yusuf-mia"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 text-slate-300"
                title="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} IdeaVault. All rights reserved. Developed by Parvez Patwary.
          </p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
