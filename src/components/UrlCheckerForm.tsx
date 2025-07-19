"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  Search,
} from "lucide-react";

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

      // Save result to user history
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

  const confidencePercentage = result
    ? (Number.parseFloat(result.confidence) * 100).toFixed(1)
    : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              URL Security Scanner
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Enter any URL to check if it's safe or potentially malicious
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="url"
                placeholder="https://example.com"
                className="pl-10 h-12 text-base border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing URL...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Scan URL
                </>
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Card
              className={`border-2 ${
                result.isPhishing
                  ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
                  : "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {result.isPhishing ? (
                      <ShieldAlert className="h-8 w-8 text-red-500" />
                    ) : (
                      <ShieldCheck className="h-8 w-8 text-green-500" />
                    )}
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          result.isPhishing
                            ? "text-red-700 dark:text-red-300"
                            : "text-green-700 dark:text-green-300"
                        }`}
                      >
                        {result.isPhishing
                          ? "Potential Threat Detected"
                          : "URL Appears Safe"}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Analysis completed
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={result.isPhishing ? "destructive" : "default"}
                    className="text-sm px-3 py-1"
                  >
                    {confidencePercentage}% confidence
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Confidence Level
                    </span>
                    <span className="font-medium">{confidencePercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        result.isPhishing
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : "bg-gradient-to-r from-green-500 to-green-600"
                      }`}
                      style={{ width: `${confidencePercentage}%` }}
                    />
                  </div>
                </div>

                {result.isPhishing && (
                  <Alert className="mt-4 border-red-200 dark:border-red-800">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Warning:</strong> This URL shows signs of being
                      malicious. Avoid entering personal information or
                      downloading files from this site.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
