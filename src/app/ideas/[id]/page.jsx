"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";

export default function IdeaDetailsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    if (!isPending && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, pathname, router, user]);

  const fetchDetails = useCallback(async () => {
    if (!id || !user) return;

    try {
      setLoading(true);
      const [ideaRes, commentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ideas/${id}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments?ideaId=${id}`),
      ]);

      if (!ideaRes.ok) {
        throw new Error("Failed to load idea details");
      }

      const ideaData = await ideaRes.json();
      const commentsData = commentsRes.ok ? await commentsRes.json() : [];

      setIdea(ideaData);
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (error) {
      console.error("Error fetching idea details:", error);
      toast.error(error.message || "Failed to load idea details");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Please write a comment first.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: id,
          commentText: commentText.trim(),
          email: user.email,
          name: user.name || user.email,
          timestamp: new Date(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add comment");
      }

      toast.success("Comment added successfully!");
      setCommentText("");
      fetchDetails();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.commentText || "");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingText.trim()) {
      toast.error("Comment text cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentText: editingText.trim() }),
      });

      const data = await response.json();
      if (!response.ok || (!data.modifiedCount && !data.acknowledged)) {
        throw new Error(data.message || "Failed to update comment");
      }

      toast.success("Comment updated successfully!");
      setEditingId(null);
      setEditingText("");
      fetchDetails();
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(error.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok || data.deletedCount === 0) {
        throw new Error(data.message || "Failed to delete comment");
      }

      toast.success("Comment deleted successfully!");
      setComments((current) => current.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.message || "Failed to delete comment");
    }
  };

  if (isPending || !user || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="max-w-4xl mx-auto my-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Idea not found</h1>
      </div>
    );
  }

  const detailItems = [
    ["Category", idea.category],
    ["Target Audience", idea.targetAudience],
    ["Budget", idea.budget ? `$${idea.budget}` : "Not specified"],
    ["Author", idea.authorName || idea.userName || "Unknown"],
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-72 bg-gray-100 dark:bg-gray-800">
            <img
              src={idea.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"}
              alt={idea.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {idea.title}
                </h1>
                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {idea.shortDescription}
                </p>

                <div className="mt-8 space-y-6">
                  <section>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detailed Description</h2>
                    <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {idea.detailedDescription || "No detailed description provided."}
                    </p>
                  </section>
                  <section>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Problem Statement</h2>
                    <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {idea.problemStatement || "No problem statement provided."}
                    </p>
                  </section>
                  <section>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Proposed Solution</h2>
                    <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {idea.proposedSolution || "No proposed solution provided."}
                    </p>
                  </section>
                </div>
              </div>

              <aside className="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 h-fit">
                <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Idea Info</h2>
                <dl className="mt-4 space-y-4">
                  {detailItems.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
                      <dd className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{value || "Not specified"}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </div>
        </div>

        <section className="mt-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comments</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">{comments.length} total</span>
          </div>

          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="4"
              placeholder="Share your feedback..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-3 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              {submitting ? "Posting..." : "Submit Comment"}
            </button>
          </form>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No comments yet. Be the first to share feedback.
              </p>
            ) : (
              comments.map((comment) => {
                const isOwner = comment.email === user.email;

                return (
                  <div
                    key={comment._id}
                    className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{comment.name || "Anonymous"}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : "Just now"}
                        </p>
                      </div>
                      {isOwner && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditComment(comment)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {editingId === comment._id ? (
                      <div className="mt-3">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateComment(comment._id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditingText("");
                            }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {comment.commentText}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
