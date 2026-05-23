"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { authClient } from "../lib/auth-client";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export default function MyIdeasPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [myIdeas, setMyIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = user?.email; 

  useEffect(() => {
    if (!isPending && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, pathname, router, user]);

  const fetchMyIdeas = useCallback(() => {
    if (!userEmail) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-ideas?email=${encodeURIComponent(userEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        setMyIdeas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching my ideas:", err);
        setLoading(false);
      });
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      fetchMyIdeas();
    }
  }, [fetchMyIdeas, userEmail]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this startup idea!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas/${id}`, {
            method: "DELETE",
          });
          const data = await response.json();

          if (data.deletedCount > 0) {
            Swal.fire("Deleted!", "Your idea has been deleted.", "success");
            setMyIdeas(myIdeas.filter((idea) => idea._id !== id));
          }
        } catch (error) {
          console.error("Error deleting idea:", error);
          Swal.fire("Error!", "Failed to delete the idea.", "error");
        }
      }
    });
  };

  const handleUpdate = async (idea) => {
    const { value: updatedIdea } = await Swal.fire({
      title: "Update Startup Idea",
      width: "720px",
      html: `
        <div style="display:grid;gap:12px;text-align:left">
          <input id="swal-title" class="swal2-input" placeholder="Idea title" value="${escapeHtml(idea.title)}">
          <input id="swal-shortDescription" class="swal2-input" placeholder="Short description" value="${escapeHtml(idea.shortDescription)}">
          <textarea id="swal-detailedDescription" class="swal2-textarea" placeholder="Detailed description">${escapeHtml(idea.detailedDescription)}</textarea>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <input id="swal-category" class="swal2-input" placeholder="Category" value="${escapeHtml(idea.category)}" style="margin:0;width:auto">
            <input id="swal-budget" class="swal2-input" placeholder="Budget" value="${escapeHtml(idea.budget)}" style="margin:0;width:auto">
          </div>
          <input id="swal-targetAudience" class="swal2-input" placeholder="Target audience" value="${escapeHtml(idea.targetAudience)}">
          <textarea id="swal-problemStatement" class="swal2-textarea" placeholder="Problem statement">${escapeHtml(idea.problemStatement)}</textarea>
          <textarea id="swal-proposedSolution" class="swal2-textarea" placeholder="Proposed solution">${escapeHtml(idea.proposedSolution)}</textarea>
          <input id="swal-imageUrl" class="swal2-input" placeholder="Image URL" value="${escapeHtml(idea.imageUrl)}">
          <input id="swal-tags" class="swal2-input" placeholder="Tags" value="${escapeHtml(idea.tags)}">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      preConfirm: () => {
        const updated = {
          title: document.getElementById("swal-title").value.trim(),
          shortDescription: document.getElementById("swal-shortDescription").value.trim(),
          detailedDescription: document.getElementById("swal-detailedDescription").value.trim(),
          category: document.getElementById("swal-category").value.trim(),
          budget: document.getElementById("swal-budget").value.trim(),
          targetAudience: document.getElementById("swal-targetAudience").value.trim(),
          problemStatement: document.getElementById("swal-problemStatement").value.trim(),
          proposedSolution: document.getElementById("swal-proposedSolution").value.trim(),
          imageUrl: document.getElementById("swal-imageUrl").value.trim(),
          tags: document.getElementById("swal-tags").value.trim(),
        };

        if (!updated.title || !updated.shortDescription || !updated.category || !updated.targetAudience) {
          Swal.showValidationMessage("Title, short description, category, and target audience are required.");
          return false;
        }

        return updated;
      },
    });

    if (updatedIdea) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas/${idea._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...idea, ...updatedIdea, updatedAt: new Date() }),
        });
        
        const data = await response.json();
        if (data.modifiedCount > 0 || data.acknowledged) {
          toast.success("Idea updated successfully.");
          fetchMyIdeas();
        } else {
          toast.error("No idea was updated.");
        }
      } catch (error) {
        console.error("Error updating idea:", error);
        toast.error("Failed to update idea.");
      }
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
    <div className="max-w-6xl mx-auto my-12 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-8">
        💼 My Submitted Ideas
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : myIdeas.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">
          You have not shared any innovative startup ideas yet! 💡
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left border-collapse bg-white dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-900 dark:text-white">Idea Title</th>
                <th className="px-6 py-4 font-medium text-gray-900 dark:text-white">Category</th>
                <th className="px-6 py-4 font-medium text-gray-900 dark:text-white">Target Audience</th>
                <th className="px-6 py-4 font-medium text-gray-900 dark:text-white text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 border-t border-gray-200 dark:border-gray-800">
              {myIdeas.map((idea) => (
                <tr key={idea._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white max-w-xs truncate">
                    {idea.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 uppercase">
                      {idea.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{idea.targetAudience}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleUpdate(idea)}
                        className="px-3 py-1.5 bg-amber-500 text-white font-medium rounded-lg text-xs hover:bg-amber-600 transition-colors shadow-sm"
                      >
                        ✏️ Edit
                      </button>
                     
                      <button
                        onClick={() => handleDelete(idea._id)}
                        className="px-3 py-1.5 bg-red-600 text-white font-medium rounded-lg text-xs hover:bg-red-700 transition-colors shadow-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
