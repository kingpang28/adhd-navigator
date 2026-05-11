import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Clock, Heart, Users, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const screeningQuery = trpc.screening.getLatest.useQuery(undefined, { enabled: isAuthenticated });
  const vitalsQuery = trpc.vitals.getLatest.useQuery(undefined, { enabled: isAuthenticated });
  const reportQuery = trpc.referral.generateReport.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-indigo-600">ADHD Pre-Referral Navigator</h1>
            <p className="text-sm text-gray-600">UK Right to Choose Guide</p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Navigate Your ADHD Journey</h2>
            <p className="text-xl text-gray-600 mb-8">
              Clinical screening, vitals assessment, and clinic comparison for UK Right to Choose referrals.
            </p>
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Get Started
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  ASRS v1.1 Screening
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  WHO-compliant ADHD assessment using the official Adult ADHD Self-Report Scale.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-emerald-600" />
                  Vitals Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Record blood pressure and heart rate to ensure medication readiness.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Clinic Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Compare wait times for major UK Right to Choose providers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  Referral Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate a comprehensive report for your GP consultation.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
            <p className="mb-6 text-indigo-100">Complete the screening, record your vitals, and generate a report.</p>
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Sign In to Begin
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">ADHD Pre-Referral Navigator</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name || "User"}</p>
          </div>
          <Button variant="outline" onClick={() => logout()}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Screening Status</CardTitle>
            </CardHeader>
            <CardContent>
              {screeningQuery.data ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{screeningQuery.data.likelihood}</p>
                    <p className="text-xs text-gray-500 mt-1">Likelihood</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Not started</p>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Vitals Status</CardTitle>
            </CardHeader>
            <CardContent>
              {vitalsQuery.data ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{vitalsQuery.data.medicationReadiness}</p>
                    <p className="text-xs text-gray-500 mt-1">Medication Ready</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Not recorded</p>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Referral Status</CardTitle>
            </CardHeader>
            <CardContent>
              {reportQuery.data ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{reportQuery.data.readinessStatus}</p>
                    <p className="text-xs text-gray-500 mt-1">Status</p>
                  </div>
                  {reportQuery.data.readinessStatus === "Referral Ready" ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Incomplete</p>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/screening")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Start Screening
              </CardTitle>
              <CardDescription>ASRS v1.1 Questionnaire</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Complete the WHO Adult ADHD Self-Report Scale. Takes about 5 minutes.</p>
              {screeningQuery.data && <Badge className="bg-green-100 text-green-800">Completed</Badge>}
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/vitals")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-emerald-600" />
                Record Vitals
              </CardTitle>
              <CardDescription>Blood Pressure & Heart Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Enter your baseline vitals for medication readiness assessment.</p>
              {vitalsQuery.data && <Badge className="bg-green-100 text-green-800">Recorded</Badge>}
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/clinics")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Compare Clinics
              </CardTitle>
              <CardDescription>Right to Choose Providers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View wait times and details for major UK ADHD assessment providers.</p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/referral")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Generate Report
              </CardTitle>
              <CardDescription>For GP Consultation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create a comprehensive referral readiness report for your GP.</p>
              {reportQuery.data && reportQuery.data.readinessStatus === "Referral Ready" && (
                <Badge className="bg-green-100 text-green-800">Ready</Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle>About This Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              This ADHD Pre-Referral Navigator helps you prepare for the NHS Right to Choose referral process following
              NICE guidelines.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-1">NICE Compliant</p>
                <p className="text-gray-600">Based on official UK guidelines for ADHD assessment.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">WHO Validated</p>
                <p className="text-gray-600">Uses the ASRS v1.1 questionnaire from WHO.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Your Data</p>
                <p className="text-gray-600">All information is private and secure.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
