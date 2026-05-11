import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { assessMedicationReadiness, validateVitals, formatVitals, type VitalsReading } from "@shared/vitals";

export default function Vitals() {
  const [vitals, setVitals] = useState<VitalsReading>({
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: 70,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveMutation = trpc.vitals.record.useMutation();
  const latestVitalsQuery = trpc.vitals.getLatest.useQuery();

  const handleInputChange = (field: keyof VitalsReading, value: string) => {
    const numValue = parseInt(value) || 0;
    setVitals((prev) => ({
      ...prev,
      [field]: numValue,
    }));
    setErrors([]);
  };

  const handleSubmit = async () => {
    const validation = validateVitals(vitals);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const assessment = assessMedicationReadiness(vitals);
    setShowResults(true);

    setIsSubmitting(true);
    try {
      await saveMutation.mutateAsync({
        systolicBP: vitals.systolicBP,
        diastolicBP: vitals.diastolicBP,
        heartRate: vitals.heartRate,
        medicationReadiness: assessment.medicationReadiness,
      });
      // Refresh latest vitals
      latestVitalsQuery.refetch();
    } catch (error) {
      console.error("Failed to save vitals:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults) {
    const assessment = assessMedicationReadiness(vitals);
    return <VitalsResults vitals={vitals} assessment={assessment} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vitals Tracking</h1>
          <p className="text-lg text-gray-600">Medication Readiness Assessment</p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            NICE guidelines require baseline blood pressure and heart rate measurements before starting ADHD medication.
            Recording these now makes you "medication-ready" for your appointment.
          </AlertDescription>
        </Alert>

        {/* Vitals Input Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Record Your Vitals</CardTitle>
            <CardDescription>Take measurements at rest for accuracy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Systolic BP */}
            <div className="space-y-2">
              <Label htmlFor="systolic" className="text-base font-semibold">
                Systolic Blood Pressure (mmHg)
              </Label>
              <Input
                id="systolic"
                type="number"
                min="50"
                max="250"
                value={vitals.systolicBP}
                onChange={(e) => handleInputChange("systolicBP", e.target.value)}
                className="text-lg py-6"
                placeholder="e.g., 120"
              />
              <p className="text-xs text-gray-500">Normal: &lt;120 mmHg | Elevated: 120-139 mmHg | High: ≥140 mmHg</p>
            </div>

            {/* Diastolic BP */}
            <div className="space-y-2">
              <Label htmlFor="diastolic" className="text-base font-semibold">
                Diastolic Blood Pressure (mmHg)
              </Label>
              <Input
                id="diastolic"
                type="number"
                min="30"
                max="150"
                value={vitals.diastolicBP}
                onChange={(e) => handleInputChange("diastolicBP", e.target.value)}
                className="text-lg py-6"
                placeholder="e.g., 80"
              />
              <p className="text-xs text-gray-500">Normal: &lt;80 mmHg | Elevated: 80-89 mmHg | High: ≥90 mmHg</p>
            </div>

            {/* Heart Rate */}
            <div className="space-y-2">
              <Label htmlFor="heartrate" className="text-base font-semibold">
                Resting Heart Rate (BPM)
              </Label>
              <Input
                id="heartrate"
                type="number"
                min="30"
                max="200"
                value={vitals.heartRate}
                onChange={(e) => handleInputChange("heartRate", e.target.value)}
                className="text-lg py-6"
                placeholder="e.g., 70"
              />
              <p className="text-xs text-gray-500">Normal: 60-100 BPM | Tachycardia: &gt;100 BPM</p>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-900">
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Current Reading Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Current Reading:</p>
              <p className="text-lg font-semibold text-gray-900">{formatVitals(vitals)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/"}>
            Back to Dashboard
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg">
            {isSubmitting ? "Saving..." : "Record Vitals"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function VitalsResults({ vitals, assessment }: { vitals: VitalsReading; assessment: ReturnType<typeof assessMedicationReadiness> }) {
  const isReady = assessment.medicationReadiness === "Ready";
  const bgColor = isReady ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200";
  const textColor = isReady ? "text-green-600" : "text-yellow-600";
  const icon = isReady ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <AlertTriangle className="h-6 w-6 text-yellow-600" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vitals Assessment</h1>
          <p className="text-lg text-gray-600">Medication Readiness Status</p>
        </div>

        {/* Status Card */}
        <Card className={`border-2 mb-6 ${bgColor}`}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              {icon}
              <div>
                <CardTitle className={`text-3xl ${textColor}`}>{assessment.medicationReadiness}</CardTitle>
                <CardDescription className="text-base mt-2">
                  Baseline vitals recorded: {formatVitals(vitals)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Vitals Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Measurements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Systolic BP</p>
                <p className="text-2xl font-bold text-gray-900">{vitals.systolicBP}</p>
                <p className="text-xs text-gray-500 mt-1">mmHg</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Diastolic BP</p>
                <p className="text-2xl font-bold text-gray-900">{vitals.diastolicBP}</p>
                <p className="text-xs text-gray-500 mt-1">mmHg</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Heart Rate</p>
                <p className="text-2xl font-bold text-gray-900">{vitals.heartRate}</p>
                <p className="text-xs text-gray-500 mt-1">BPM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flags and Recommendations */}
        {assessment.flags.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Clinical Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assessment.flags.map((flag, idx) => (
                <p key={idx} className="text-yellow-900 text-sm">
                  • {flag}
                </p>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assessment.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-3">
                <Activity className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/"}>
            Back to Dashboard
          </Button>
          <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => window.location.href = "/clinics"}>
            Explore Clinics
          </Button>
        </div>
      </div>
    </div>
  );
}
