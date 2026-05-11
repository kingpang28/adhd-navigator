import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Globe, Clock, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { CLINIC_STATUS_BADGES } from "@shared/clinics";

export default function Clinics() {
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const clinicsQuery = trpc.clinics.getAll.useQuery();

  if (clinicsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 flex items-center justify-center">
        <p className="text-gray-600">Loading clinic data...</p>
      </div>
    );
  }

  const clinics = clinicsQuery.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Right to Choose Clinics</h1>
          <p className="text-lg text-gray-600">Compare UK ADHD Assessment Providers</p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            Wait times are estimates as of February 2026. Always check the provider website for current information.
            Your local ICB may affect availability.
          </AlertDescription>
        </Alert>

        {/* Education Section */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle>What is Right to Choose?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              If your local NHS ADHD service has a waiting list longer than 18 weeks, you have the legal right to choose
              an alternative NHS provider. This is called Right to Choose.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <p className="font-semibold text-indigo-900 mb-2">1. Check Local Wait Time</p>
                <p className="text-sm text-gray-700">Ask your GP about your local NHS ADHD service wait time.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <p className="font-semibold text-indigo-900 mb-2">2. Choose a Provider</p>
                <p className="text-sm text-gray-700">Select from the approved Right to Choose providers below.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <p className="font-semibold text-indigo-900 mb-2">3. Request Referral</p>
                <p className="text-sm text-gray-700">Ask your GP for a Right to Choose referral to your chosen clinic.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinics Table */}
        <div className="grid gap-6">
          {clinics.map((clinic) => (
            <Card
              key={clinic.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedClinic(selectedClinic === clinic.id ? null : clinic.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{clinic.name}</CardTitle>
                      <Badge className={CLINIC_STATUS_BADGES[clinic.status]}>{clinic.status}</Badge>
                    </div>
                    <CardDescription className="text-base">{clinic.keyInfo}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Assessment Wait
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{clinic.assessmentWaitTime}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Titration Wait
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{clinic.titrationWaitTime}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Status
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{clinic.status}</p>
                  </div>
                </div>

                {/* Expandable Details */}
                {selectedClinic === clinic.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {clinic.notes && (
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Important Notes</p>
                        <p className="text-gray-700">{clinic.notes}</p>
                      </div>
                    )}
                    {clinic.website && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(clinic.website, "_blank");
                        }}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Provider Website
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Choose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Consider Total Wait Time</p>
                  <p className="text-gray-600 text-sm">
                    Add assessment + titration wait times to get a realistic timeline from referral to medication.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Check Your Local ICB</p>
                  <p className="text-gray-600 text-sm">
                    Some providers are paused in certain areas. Verify availability before requesting a referral.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Review Provider Details</p>
                  <p className="text-gray-600 text-sm">
                    Click on each clinic to read important notes and visit their website for more information.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => (window.location.href = "/")}>
            Back to Dashboard
          </Button>
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => (window.location.href = "/referral")}>
            Generate Referral Report
          </Button>
        </div>
      </div>
    </div>
  );
}
