# ADHD Pre-Referral Navigator - Development TODO

## Database & Backend
- [x] Create screening_results table in Drizzle schema
- [x] Create vitals_records table in Drizzle schema
- [x] Create clinic_preferences table in Drizzle schema
- [x] Implement screening.getLatest tRPC procedure
- [x] Implement screening.save tRPC procedure
- [x] Implement vitals.record tRPC procedure
- [x] Implement vitals.getHistory tRPC procedure
- [x] Implement clinics.getAll tRPC procedure
- [x] Implement referral.generateReport tRPC procedure

## Frontend - Screening Module
- [x] Create ScreeningQuestionnaire component with ASRS v1.1 questions
- [x] Implement NICE/WHO-compliant scoring logic (Part A: 4+ = High)
- [x] Create question display with Likert scale (1-5 options)
- [x] Add progress indicator for questionnaire completion
- [x] Display screening results with likelihood classification
- [x] Add educational content explaining ASRS v1.1

## Frontend - Vitals Module
- [x] Create VitalsTracker component with BP and HR input fields
- [x] Implement medication readiness assessment logic
- [x] Create warning alerts for out-of-range vitals (BP > 140/90, HR > 100)
- [x] Add educational content about why vitals are needed
- [ ] Add vitals history visualization (chart or timeline)

## Frontend - Clinic Comparison
- [x] Create ClinicComparison component with interactive table
- [x] Add all 5 UK RTC providers with current wait times
- [x] Add clinic detail modals with more information
- [x] Create Right to Choose educational guide
- [ ] Implement sortable/filterable clinic list

## Frontend - Dashboard & Reporting
- [x] Create Dashboard component showing user progress
- [x] Implement ReferralReport component for GP consultation
- [x] Add referral readiness status indicator
- [x] Create report export/print functionality
- [x] Add data summary for GP presentation

## Frontend - Navigation & Workflow
- [x] Create guided step-by-step workflow
- [x] Implement main navigation/routing
- [x] Create home/landing page with unauthenticated view
- [ ] Add user profile/settings page

## Styling & UX
- [x] Define elegant color palette and typography
- [x] Implement responsive design for mobile/tablet/desktop
- [x] Add smooth transitions and micro-interactions
- [x] Create consistent component library using shadcn/ui
- [ ] Ensure accessibility standards (WCAG 2.1 AA)

## Testing
- [ ] Write vitest tests for screening logic
- [ ] Write vitest tests for vitals assessment
- [ ] Write vitest tests for clinic data
- [ ] Write vitest tests for referral report generation
- [ ] Test UI components for responsiveness

## Deployment & Documentation
- [ ] Create user guide documentation
- [ ] Add NICE guidelines reference documentation
- [ ] Test full user workflow end-to-end
- [ ] Verify database persistence
- [ ] Final QA and bug fixes
