import { useEffect, useMemo, useState } from "react";
import { api } from "./api/client.js";
import CommentTree from "./components/CommentTree.jsx";
import Leaderboard from "./components/Leaderboard.jsx";

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newUser, setNewUser] = useState("");
  const [loadingPost, setLoadingPost] = useState(false);

  const activeUserId = useMemo(() => Number(selectedUserId) || null, [selectedUserId]);

  const loadBase = async () => {
    try {
      const [usersData, postsData, leaderboardData] = await Promise.all([
        api.users(),
        api.listPosts(),
        api.leaderboard()
      ]);
      setUsers(usersData);
      setPosts(postsData.results || postsData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Failed to load base data:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadBase().catch(error => {
      console.error("Failed to load initial data:", error);
    });
    // Refresh leaderboard every 10 seconds for real-time updates
    const interval = setInterval(async () => {
      try {
        const leaderboardData = await api.leaderboard();
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Failed to refresh leaderboard:", error);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadPost = async (postId) => {
    setLoadingPost(true);
    try {
      const post = await api.getPost(postId);
      setSelectedPost(post);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    if (!newUser.trim()) return;
    try {
      const user = await api.createUser({ username: newUser });
      setUsers((prev) => [...prev, user]);
      setSelectedUserId(String(user.id));
      setNewUser("");
    } catch (error) {
      console.error("Failed to create user:", error);
      let message = "Failed to create user. Check console for details.";
      if (
        error?.message?.includes("username") &&
        error?.message?.toLowerCase().includes("already exists")
      ) {
        message = "This username already exists. Try another username.";
      }
      alert(message);
    }
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (!newPost.trim() || !activeUserId) return;
    try {
      await api.createPost({ content: newPost, author_id: activeUserId });
      setNewPost("");
      await loadBase();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Check console for details.");
    }
  };

  const handleCreateComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim() || !activeUserId || !selectedPost) return;
    try {
      await api.createComment({
        post: selectedPost.id,
        content: newComment,
        author_id: activeUserId
      });
      setNewComment("");
      await loadPost(selectedPost.id);
      await loadLeaderboard();
    } catch (error) {
      console.error("Failed to create comment:", error);
      alert("Failed to create comment. Check console for details.");
    }
  };

  const handleReply = async (parentId, content) => {
    if (!activeUserId || !selectedPost) return;
    try {
      await api.createComment({
        post: selectedPost.id,
        parent: parentId,
        content,
        author_id: activeUserId
      });
      await loadPost(selectedPost.id);
      await loadLeaderboard();
    } catch (error) {
      console.error("Failed to create reply:", error);
      alert("Failed to create reply. Check console for details.");
    }
  };

  const handleLikePost = async (postId) => {
    if (!activeUserId) return;
    try {
      await api.likePost(postId, activeUserId);
      await loadBase();
      if (selectedPost?.id === postId) {
        await loadPost(postId);
      }
    } catch (error) {
      console.error("Failed to like post:", error);
      alert("Failed to like post. Check console for details.");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!activeUserId) return;
    try {
      await api.likeComment(commentId, activeUserId);
      if (selectedPost) {
        await loadPost(selectedPost.id);
      }
      await loadLeaderboard();
    } catch (error) {
      console.error("Failed to like comment:", error);
      alert("Failed to like comment. Check console for details.");
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await api.leaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">Community Feed</h1>
            <p className="text-sm text-slate-400">Threaded discussions + 24h karma</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm"
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            <form className="flex items-center gap-2" onSubmit={handleCreateUser}>
              <input
                className="w-28 rounded-lg bg-slate-800 px-2 py-2 text-sm"
                value={newUser}
                onChange={(event) => setNewUser(event.target.value)}
                placeholder="New user"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-6">
          <form
            className="rounded-2xl bg-slate-900/70 p-4 shadow-lg"
            onSubmit={handleCreatePost}
          >
            <h2 className="text-lg font-semibold">Create a post</h2>
            <textarea
              className="mt-3 w-full rounded-lg bg-slate-800 p-3 text-sm text-slate-100"
              rows={3}
              placeholder="Share something with the community"
              value={newPost}
              onChange={(event) => setNewPost(event.target.value)}
            />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{activeUserId ? "Posting as selected user" : "Select a user"}</span>
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950"
              >
                Post
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl bg-slate-900/70 p-4 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{post.author.username}</p>
                    <p className="mt-2 text-base text-slate-100">{post.content}</p>
                  </div>
                  <button
                    className="text-xs text-emerald-300 hover:text-emerald-200"
                    onClick={() => handleLikePost(post.id)}
                  >
                    +5 ({post.like_count})
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <button
                    className="text-emerald-300 hover:text-emerald-200"
                    onClick={() => loadPost(post.id)}
                  >
                    View thread ({post.comment_count})
                  </button>
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <Leaderboard entries={leaderboard} />

          <div className="rounded-2xl bg-slate-900/70 p-4 shadow-lg">
            <h2 className="text-lg font-semibold">Thread</h2>
            {!selectedPost && (
              <p className="mt-2 text-sm text-slate-400">
                Select a post to see the threaded comments.
              </p>
            )}
            {selectedPost && (
              <div className="mt-3 space-y-4">
                <div className="rounded-xl bg-slate-800/80 p-3">
                  <p className="text-sm text-slate-400">{selectedPost.author.username}</p>
                  <p className="mt-2 text-slate-100">{selectedPost.content}</p>
                </div>

                <form className="space-y-2" onSubmit={handleCreateComment}>
                  <textarea
                    className="w-full rounded-lg bg-slate-800 p-2 text-sm text-slate-100"
                    rows={2}
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950"
                  >
                    Comment
                  </button>
                </form>

                {loadingPost ? (
                  <p className="text-sm text-slate-400">Loading thread...</p>
                ) : (
                  <CommentTree
                    nodes={selectedPost.comments || []}
                    onReply={handleReply}
                    onLike={handleLikeComment}
                  />
                )}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
