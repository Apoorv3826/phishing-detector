"use client";

import { useState } from "react";

export default function UrlCheckerForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<null | {
    isPhishing: boolean;
    confidence: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/phishing/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unknown error");
      }

      const data = await res.json();
      setResult(data);

      // ✅ Save result to user history
      await fetch("/api/phishing/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          isPhishing: data.isPhishing,
          confidence: data.confidence,
        }),
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-2xl shadow-lg transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        🔍 Phishing URL Detector
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          placeholder="Enter a URL to check..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          {loading ? "Checking..." : "Check URL"}
        </button>
      </form>

      {error && <p className="text-red-600 dark:text-red-400 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 text-center">
          {result.isPhishing ? (
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              ⚠️ Phishing suspected (confidence:{" "}
              {(parseFloat(result.confidence) * 100).toFixed(2)}%)
            </p>
          ) : (
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              ✅ This URL looks safe!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
