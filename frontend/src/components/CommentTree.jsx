import { useState } from "react";

export default function CommentTree({ nodes, onReply, onLike, depth = 0 }) {
  return (
    <ul className={depth === 0 ? "space-y-3" : "space-y-2"}>
      {nodes.map((node) => (
        <CommentNode
          key={node.id}
          node={node}
          onReply={onReply}
          onLike={onLike}
          depth={depth}
        />
      ))}
    </ul>
  );
}

function CommentNode({ node, onReply, onLike, depth }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!replyText.trim()) return;
    onReply(node.id, replyText);
    setReplyText("");
    setShowReply(false);
  };

  return (
    <li className="rounded-xl bg-slate-900/70 p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-300">{node.author.username}</p>
          <p className="mt-1 text-slate-100">{node.content}</p>
        </div>
        <button
          className="text-xs text-emerald-300 hover:text-emerald-200"
          onClick={() => onLike(node.id)}
        >
          +1 ({node.like_count})
        </button>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
        <button onClick={() => setShowReply((prev) => !prev)}>
          Reply
        </button>
      </div>
      {showReply && (
        <form className="mt-2 space-y-2" onSubmit={handleSubmit}>
          <textarea
            className="w-full rounded-lg bg-slate-800 p-2 text-sm text-slate-100"
            rows={2}
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            placeholder="Write a reply"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950"
          >
            Reply
          </button>
        </form>
      )}
      {node.children?.length > 0 && (
        <div className="mt-3 border-l border-slate-800 pl-3">
          <CommentTree
            nodes={node.children}
            onReply={onReply}
            onLike={onLike}
            depth={depth + 1}
          />
        </div>
      )}
    </li>
  );
}
