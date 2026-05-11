/**
 * UK Right to Choose ADHD Clinics Data
 * Based on research as of February 2026
 */

export interface Clinic {
  id: string;
  name: string;
  assessmentWaitTime: string;
  titrationWaitTime: string;
  status: "Open" | "Paused" | "Restricted";
  keyInfo: string;
  website?: string;
  notes?: string;
}

export const UK_ADHD_CLINICS: Clinic[] = [
  {
    id: "psychiatry-uk",
    name: "Psychiatry-UK",
    assessmentWaitTime: "8-10 Months",
    titrationWaitTime: "7-10 Months",
    status: "Open",
    keyInfo: "Largest provider, uses online portal.",
    website: "https://psychiatry-uk.com",
    notes: "Established provider with extensive experience in Right to Choose referrals.",
  },
  {
    id: "adhd-360",
    name: "ADHD 360",
    assessmentWaitTime: "Paused",
    titrationWaitTime: "N/A",
    status: "Paused",
    keyInfo: "Reviewing capacity April 2026.",
    website: "https://www.adhd-360.com",
    notes: "Currently paused in many areas. Check local ICB status before referral.",
  },
  {
    id: "clinical-partners",
    name: "Clinical Partners",
    assessmentWaitTime: "12-18 Months",
    titrationWaitTime: "12-18 Months",
    status: "Open",
    keyInfo: "Good for complex cases/children.",
    website: "https://www.clinical-partners.co.uk",
    notes: "Comprehensive service covering both adults and children.",
  },
  {
    id: "dr-j-colleagues",
    name: "Dr J & Colleagues",
    assessmentWaitTime: "6-9 Months",
    titrationWaitTime: "3-6 Months",
    status: "Open",
    keyInfo: "Smaller provider, often faster titration.",
    website: "https://www.drjandcolleagues.co.uk",
    notes: "Known for efficient medication titration process.",
  },
  {
    id: "psicon",
    name: "Psicon",
    assessmentWaitTime: "9-12 Months",
    titrationWaitTime: "Unknown",
    status: "Restricted",
    keyInfo: "Paused in some local areas.",
    website: "https://www.psicon.co.uk",
    notes: "Check with your local ICB to confirm availability in your area.",
  },
];

export const CLINIC_STATUS_COLORS: Record<Clinic["status"], string> = {
  Open: "bg-green-50 text-green-900 border-green-200",
  Paused: "bg-red-50 text-red-900 border-red-200",
  Restricted: "bg-yellow-50 text-yellow-900 border-yellow-200",
};

export const CLINIC_STATUS_BADGES: Record<Clinic["status"], string> = {
  Open: "bg-green-100 text-green-800",
  Paused: "bg-red-100 text-red-800",
  Restricted: "bg-yellow-100 text-yellow-800",
};
