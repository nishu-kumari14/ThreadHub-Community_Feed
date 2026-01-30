export default function Leaderboard({ entries }) {
  return (
    <div className="rounded-2xl bg-slate-900/70 p-4 shadow-lg">
      <h2 className="text-lg font-semibold">Top 5 Karma (24h)</h2>
      <ul className="mt-3 space-y-2">
        {entries.length === 0 ? (
          <li className="text-sm text-slate-400">No activity yet.</li>
        ) : (
          entries.map((entry) => (
            <li
              key={entry.user.id}
              className="flex items-center justify-between rounded-lg bg-slate-800/70 px-3 py-2"
            >
              <span className="font-medium">{entry.user.username}</span>
              <span className="text-sm text-emerald-300">{entry.karma} karma</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
