const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    cache: "no-store",
    ...options
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`HTTP ${response.status}: ${errorText || "Request failed"}`);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  listPosts: () => request("/posts/"),
  getPost: (id) => request(`/posts/${id}/`),
  createPost: (payload) =>
    request("/posts/", { method: "POST", body: JSON.stringify(payload) }),
  createComment: (payload) =>
    request("/comments/", { method: "POST", body: JSON.stringify(payload) }),
  likePost: (postId, userId) =>
    request(`/posts/${postId}/like/`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId })
    }),
  likeComment: (commentId, userId) =>
    request(`/comments/${commentId}/like/`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId })
    }),
  leaderboard: () => request("/leaderboard/"),
  users: () => request("/users/"),
  createUser: (payload) =>
    request("/users/", { method: "POST", body: JSON.stringify(payload) })
};
