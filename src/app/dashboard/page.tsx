import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type HistoryEntry = {
  _id: string;
  url: string;
  isPhishing: boolean;
  confidence: string;
  createdAt: string;
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session.userId;

  if (!userId) redirect("/sign-in");

  const token = await session.getToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/phishing/history`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch history");
  }

  const { data }: { data: HistoryEntry[] } = await res.json();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Your Phishing Check History</h1>

      {data.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No history found yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {data.map((entry) => (
            <li
              key={entry._id}
              className="border p-3 rounded-lg shadow-sm bg-zinc-100 dark:bg-zinc-800"
            >
              <p className="text-blue-600 break-all">{entry.url}</p>
              <p>
                {entry.isPhishing ? "⚠️ Phishing" : "✅ Safe"} —{" "}
                {(parseFloat(entry.confidence) * 100).toFixed(2)}% confidence
              </p>
              <p className="text-xs text-gray-500">
                {new Date(entry.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
