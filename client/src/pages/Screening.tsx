import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { ASRS_QUESTIONS, LIKERT_OPTIONS, calculateASRSScore, isScreeningComplete, type LikertResponse } from "@shared/screening";

export default function Screening() {
  const [responses, setResponses] = useState<Record<number, LikertResponse>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveMutation = trpc.screening.save.useMutation();

  const handleResponseChange = (questionId: number, value: LikertResponse) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!isScreeningComplete(responses)) {
      return;
    }

    const score = calculateASRSScore(responses);
    setShowResults(true);

    // Save to database
    setIsSubmitting(true);
    try {
      await saveMutation.mutateAsync({
        partAScore: score.partAScore,
        likelihood: score.likelihood,
        q1Response: responses[1],
        q2Response: responses[2],
        q3Response: responses[3],
        q4Response: responses[4],
        q5Response: responses[5],
        q6Response: responses[6],
      });
    } catch (error) {
      console.error("Failed to save screening:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (Object.keys(responses).length / ASRS_QUESTIONS.length) * 100;
  const isComplete = isScreeningComplete(responses);
  const score = isComplete ? calculateASRSScore(responses) : null;

  if (showResults && score) {
    return <ScreeningResults score={score} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ADHD Clinical Screening</h1>
          <p className="text-lg text-gray-600">
            WHO ASRS v1.1 Questionnaire - Based on NICE Guidelines
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            This screening tool uses the official WHO Adult ADHD Self-Report Scale (ASRS v1.1). Please answer honestly
            based on how you have felt over the last 6 months.
          </AlertDescription>
        </Alert>

        {/* Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">Progress</CardTitle>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-gray-500 mt-2">
              {Object.keys(responses).length} of {ASRS_QUESTIONS.length} questions answered
            </p>
          </CardHeader>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          {ASRS_QUESTIONS.map((question, index) => (
            <Card key={question.id} className="border-l-4 border-l-indigo-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Question {index + 1} of {ASRS_QUESTIONS.length}
                </CardTitle>
                <CardDescription className="text-base font-normal text-gray-700 mt-2">
                  {question.text}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={responses[question.id]?.toString() || ""} onValueChange={(val) => handleResponseChange(question.id, parseInt(val) as LikertResponse)}>
                  <div className="space-y-3">
                    {LIKERT_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value.toString()} id={`q${question.id}-${option.value}`} />
                        <Label htmlFor={`q${question.id}-${option.value}`} className="font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg"
          >
            {isSubmitting ? "Saving..." : "Complete Screening"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ScreeningResults({ score }: { score: ReturnType<typeof calculateASRSScore> }) {
  const getLikelihoodColor = () => {
    switch (score.likelihood) {
      case "High":
        return "text-red-600";
      case "Moderate":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
    }
  };

  const getLikelihoodBgColor = () => {
    switch (score.likelihood) {
      case "High":
        return "bg-red-50 border-red-200";
      case "Moderate":
        return "bg-yellow-50 border-yellow-200";
      case "Low":
        return "bg-green-50 border-green-200";
    }
  };

  const getLikelihoodIcon = () => {
    switch (score.likelihood) {
      case "High":
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case "Moderate":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case "Low":
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Screening Results</h1>
          <p className="text-lg text-gray-600">Based on ASRS v1.1 Assessment</p>
        </div>

        {/* Results Card */}
        <Card className={`border-2 mb-6 ${getLikelihoodBgColor()}`}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              {getLikelihoodIcon()}
              <div>
                <CardTitle className={`text-3xl ${getLikelihoodColor()}`}>{score.likelihood} Likelihood</CardTitle>
                <CardDescription className="text-base mt-2">
                  Part A Positive Indicators: <span className="font-bold text-gray-900">{score.partAScore}/6</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-base leading-relaxed">{score.message}</p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {score.likelihood === "High" && (
              <>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Record Your Vitals</p>
                    <p className="text-gray-600 text-sm">
                      Blood pressure and heart rate are essential for medication readiness assessment.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Explore Right to Choose Clinics</p>
                    <p className="text-gray-600 text-sm">
                      Compare wait times and choose a provider that suits your needs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Generate Referral Report</p>
                    <p className="text-gray-600 text-sm">
                      Create a comprehensive report for your GP consultation.
                    </p>
                  </div>
                </div>
              </>
            )}
            {score.likelihood === "Moderate" && (
              <p className="text-gray-700">
                Consider discussing these results with your GP. They can help determine if a formal ADHD assessment is
                appropriate for you.
              </p>
            )}
            {score.likelihood === "Low" && (
              <p className="text-gray-700">
                Your current responses do not indicate strong ADHD symptoms. However, if you experience significant
                difficulties in daily functioning, please consult with your GP.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/"}>
            Back to Dashboard
          </Button>
          {score.likelihood === "High" && (
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => window.location.href = "/vitals"}>
              Record Vitals
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
