import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Download, Printer } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatVitals } from "@shared/vitals";

export default function ReferralReport() {
  const reportQuery = trpc.referral.generateReport.useQuery();

  if (reportQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 flex items-center justify-center">
        <p className="text-gray-600">Generating your referral report...</p>
      </div>
    );
  }

  const report = reportQuery.data;

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900">
              Unable to generate report. Please complete screening and vitals first.
            </AlertDescription>
          </Alert>
          <Button onClick={() => (window.location.href = "/")} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isReadyForReferral = report.readinessStatus === "Referral Ready";

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = generateReportContent(report);
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", `ADHD-Referral-Report-${new Date().toISOString().split("T")[0]}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Referral Readiness Report</h1>
          <p className="text-lg text-gray-600">For GP Consultation</p>
        </div>

        {/* Status Alert */}
        {isReadyForReferral ? (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">
              You are ready for a Right to Choose referral. Take this report to your GP consultation.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-900">
              Your referral status requires attention. Please review the details below.
            </AlertDescription>
          </Alert>
        )}

        {/* Referral Status Card */}
        <Card className="mb-6 border-2 border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Referral Status</CardTitle>
              <Badge
                className={
                  isReadyForReferral
                    ? "bg-green-100 text-green-800 text-base px-4 py-2"
                    : "bg-yellow-100 text-yellow-800 text-base px-4 py-2"
                }
              >
                {report.readinessStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              {isReadyForReferral
                ? "All criteria met. You can proceed with requesting a Right to Choose referral from your GP."
                : "Some criteria need attention. Review the details below before requesting a referral."}
            </p>
          </CardContent>
        </Card>

        {/* Screening Results */}
        {report.screening && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Screening Assessment (ASRS v1.1)</CardTitle>
              <CardDescription>Clinical screening results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Likelihood</p>
                  <p className="text-2xl font-bold text-gray-900">{report.screening.likelihood}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Part A Score</p>
                  <p className="text-2xl font-bold text-gray-900">{report.screening.partAScore}/6</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">NICE Guideline Note:</span> A score of 4 or more positive indicators
                  in Part A indicates symptoms highly consistent with adult ADHD and warrants specialist assessment.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vitals Assessment */}
        {report.vitals && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Vitals Assessment</CardTitle>
              <CardDescription>Medication readiness baseline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Medication Readiness</p>
                  <p className="text-lg font-bold text-gray-900">{report.vitals.medicationReadiness}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Baseline Vitals</p>
                  <p className="text-lg font-bold text-gray-900">{formatVitals(report.vitals)}</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-900">
                  <span className="font-semibold">NICE Guideline Note:</span> Baseline blood pressure and heart rate
                  are essential for safe ADHD medication initiation. These measurements are now on record.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* GP Talking Points */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Suggested GP Discussion Points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">ASRS v1.1 Screening Results</p>
                <p className="text-gray-600 text-sm">
                  Show your screening results and explain that you meet the criteria for specialist assessment.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">Baseline Vitals</p>
                <p className="text-gray-600 text-sm">
                  Present your recorded vitals to demonstrate you are medication-ready and save time during titration.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">Right to Choose Request</p>
                <p className="text-gray-600 text-sm">
                  Ask your GP to refer you under Right to Choose to your chosen clinic if local wait time exceeds 18
                  weeks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right to Choose Information */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle>Right to Choose Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">What is Right to Choose?</span> If your local NHS ADHD service has a
              waiting list longer than 18 weeks, you have the legal right to choose an alternative NHS provider.
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">How to use it:</span> Ask your GP to check your local wait time. If it
              exceeds 18 weeks, request a Right to Choose referral to your preferred provider.
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Cost:</span> Right to Choose referrals are free on the NHS. There is no
              cost to you.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 print:hidden">
          <Button variant="outline" className="flex-1" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        <div className="flex gap-4 print:hidden">
          <Button variant="outline" className="flex-1" onClick={() => (window.location.href = "/")}>
            Back to Dashboard
          </Button>
          <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={() => (window.location.href = "/clinics")}>
            Review Clinics
          </Button>
        </div>
      </div>
    </div>
  );
}

function generateReportContent(report: any): string {
  const date = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `ADHD PRE-REFERRAL NAVIGATOR
Referral Readiness Report
Generated: ${date}

================================================================================
REFERRAL STATUS: ${report.readinessStatus}
================================================================================

SCREENING ASSESSMENT (ASRS v1.1)
- Likelihood: ${report.screening?.likelihood || "Not completed"}
- Part A Score: ${report.screening?.partAScore || "N/A"}/6
- Status: ${report.screening?.likelihood === "High" ? "MEETS CRITERIA" : "DOES NOT MEET CRITERIA"}

VITALS ASSESSMENT
- Medication Readiness: ${report.vitals?.medicationReadiness || "Not recorded"}
- Systolic BP: ${report.vitals?.systolicBP || "N/A"} mmHg
- Diastolic BP: ${report.vitals?.diastolicBP || "N/A"} mmHg
- Heart Rate: ${report.vitals?.heartRate || "N/A"} BPM

================================================================================
NEXT STEPS
================================================================================

1. Take this report to your GP consultation
2. Ask your GP to check your local NHS ADHD service wait time
3. If wait time exceeds 18 weeks, request a Right to Choose referral
4. Choose from available providers (see clinic comparison)

================================================================================
IMPORTANT NOTES
================================================================================

- This is a pre-referral assessment tool, not a diagnostic tool
- A formal diagnosis must be made by a qualified specialist
- This report is based on NICE guidelines and WHO ASRS v1.1 criteria
- Keep a copy for your GP consultation

For more information, visit: https://adhduk.co.uk/right-to-choose/
`;
}
