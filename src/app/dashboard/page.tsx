import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, Clock, ExternalLink } from "lucide-react";

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

  const baseUrl =
    process.env.VERCEL_URL !== undefined
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/phishing/history`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch history");
  }

  const { data }: { data: HistoryEntry[] } = await res.json();

  const safeCount = data.filter((entry) => !entry.isPhishing).length;
  const threatCount = data.filter((entry) => entry.isPhishing).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Security Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Track your URL scanning history and security insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Clock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.length}</div>
              <p className="text-xs text-slate-500 mt-1">URLs analyzed</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safe URLs</CardTitle>
              <ShieldCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {safeCount}
              </div>
              <p className="text-xs text-slate-500 mt-1">Verified as safe</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Threats Blocked
              </CardTitle>
              <ShieldAlert className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {threatCount}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Potential threats detected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Scan History</span>
            </CardTitle>
            <CardDescription>
              Your recent URL security scans and results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <div className="text-center py-12">
                <ShieldCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
                  No scans yet
                </h3>
                <p className="text-slate-500">
                  Start by scanning your first URL to see your history here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.map((entry) => (
                  <Card
                    key={entry._id}
                    className={`border ${
                      entry.isPhishing
                        ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10"
                        : "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10"
                    }`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          {entry.isPhishing ? (
                            <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                {entry.url}
                              </p>
                              <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0" />
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                              <span>
                                {new Date(entry.createdAt).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(entry.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge
                            variant={
                              entry.isPhishing ? "destructive" : "default"
                            }
                            className="text-xs"
                          >
                            {(
                              Number.parseFloat(entry.confidence) * 100
                            ).toFixed(1)}
                            %
                          </Badge>
                          <Badge
                            variant={
                              entry.isPhishing ? "destructive" : "secondary"
                            }
                            className="text-xs"
                          >
                            {entry.isPhishing ? "Threat" : "Safe"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
