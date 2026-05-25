"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateStore } from "@/store/useCreateStore";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import StepProgress from "@/components/create/StepProgress";
import FileUpload from "@/components/create/FileUpload";
import DueDatePicker from "@/components/create/DueDatePicker";
import QuestionTypeList from "@/components/create/QuestionTypeList";
import AdditionalInfo from "@/components/create/AdditionalInfo";
import FormNavigation from "@/components/create/FormNavigation";
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const {
    step,
    title,
    subject,
    className,
    schoolName,
    dueDate,
    questionTypes,
    additionalInfo,
    fileName,
    setStep,
    updateForm,
    addQuestionType,
    updateQuestionType,
    removeQuestionType,
    setFile,
    resetForm,
    getDto,
    validateStep,
  } = useCreateStore();

  const { createAssignment, triggerGeneration, assignments } = useAssignmentStore();

  // Connect to live WebSocket progress updates for the newly created assignment
  const { assignmentProgress } = useWebSocket(createdId || undefined);

  useEffect(() => {
    // Reset form when loading page fresh
    resetForm();
  }, [resetForm]);

  // Handle redirects on success
  useEffect(() => {
    if (createdId && step === 2) {
      // Find the assignment status locally
      const createdAssignment = assignments.find((a) => a._id === createdId);
      if (createdAssignment?.status === "completed") {
        setStep(3);
        setTimeout(() => {
          router.push(`/assignments/${createdId}`);
        }, 1500);
      } else if (createdAssignment?.status === "failed") {
        setErrorMsg("AI paper generation failed. Please try again with different inputs.");
        setStep(1);
        setCreatedId(null);
      }
    }
  }, [createdId, step, assignments, router, setStep]);

  const handleNext = async () => {
    setErrorMsg(null);

    if (step === 1) {
      const validation = validateStep(1);
      if (!validation.valid) {
        setErrorMsg(validation.error);
        return;
      }

      setSubmitting(true);
      try {
        const dto = getDto();
        const created = await createAssignment(dto);
        if (created) {
          setCreatedId(created._id);
          setStep(2);
          // Trigger actual AI paper generation (adds job to server Queue)
          await triggerGeneration(created._id);
        } else {
          throw new Error("Failed to create assignment");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Something went wrong. Please check your network.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Helper progress calculations
  const progressPercent = assignmentProgress?.progress ?? 0;
  const progressMessage = assignmentProgress?.message ?? "Preparing request details...";

  return (
    <div className="w-full">
      {/* Visual Progress Stepper */}
      <StepProgress currentStep={step} />

      {/* Main Container */}
      <div className="max-w-3xl mx-auto">
        {/* Error Notice */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <div className="font-medium">{errorMsg}</div>
          </div>
        )}

        {step === 1 ? (
          /* Step 1: Configuration Form */
          <form className="space-y-6">
            <div className="rounded-2xl border border-border-gray bg-white p-6 md:p-8 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-brand-black tracking-tight border-b border-gray-100 pb-3">
                Assessment Details
              </h3>

              {/* Assignment Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-brand-black mb-2">
                  Assignment Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  placeholder="e.g. Science Term 1 Exam"
                  className="w-full rounded-xl border border-border-gray bg-white px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                />
              </div>

              {/* Subject & Class selection (Flex rows) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-brand-black mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => updateForm({ subject: e.target.value })}
                    className="w-full rounded-xl border border-border-gray bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all cursor-pointer"
                  >
                    <option value="General Science">General Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>

                {/* Class */}
                <div>
                  <label htmlFor="className" className="block text-sm font-bold text-brand-black mb-2">
                    Class / Grade
                  </label>
                  <select
                    id="className"
                    value={className}
                    onChange={(e) => updateForm({ className: e.target.value })}
                    className="w-full rounded-xl border border-border-gray bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all cursor-pointer"
                  >
                    <option value="5th">Class 5</option>
                    <option value="6th">Class 6</option>
                    <option value="7th">Class 7</option>
                    <option value="8th">Class 8</option>
                    <option value="9th">Class 9</option>
                    <option value="10th">Class 10</option>
                    <option value="11th">Class 11</option>
                    <option value="12th">Class 12</option>
                  </select>
                </div>
              </div>

              {/* School Name */}
              <div>
                <label htmlFor="schoolName" className="block text-sm font-bold text-brand-black mb-2">
                  School Name
                </label>
                <input
                  id="schoolName"
                  type="text"
                  value={schoolName}
                  onChange={(e) => updateForm({ schoolName: e.target.value })}
                  placeholder="e.g. Delhi Public School"
                  className="w-full rounded-xl border border-border-gray bg-white px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                />
              </div>

              {/* Due Date & File Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DueDatePicker value={dueDate} onChange={(val) => updateForm({ dueDate: val })} />
                <FileUpload fileName={fileName} onFileSelect={setFile} />
              </div>
            </div>

            {/* Question Configuration Section */}
            <div className="rounded-2xl border border-border-gray bg-white p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-black text-brand-black tracking-tight border-b border-gray-100 pb-3 mb-5">
                Question Configuration
              </h3>
              <QuestionTypeList
                configs={questionTypes}
                onAdd={addQuestionType}
                onUpdate={updateQuestionType}
                onRemove={removeQuestionType}
              />
            </div>

            {/* Instructions Section */}
            <div className="rounded-2xl border border-border-gray bg-white p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-black text-brand-black tracking-tight border-b border-gray-100 pb-3 mb-5">
                Additional Constraints
              </h3>
              <AdditionalInfo value={additionalInfo} onChange={(val) => updateForm({ additionalInfo: val })} />
            </div>

            {/* Navigation Buttons */}
            <FormNavigation
              onBack={handleBack}
              onNext={handleNext}
              showBack={false}
              nextText="Generate AI Paper"
              isSubmitting={submitting}
            />
          </form>
        ) : step === 2 ? (
          /* Step 2: Live AI Generation Progress */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border-gray bg-white p-8 md:p-16 text-center shadow-sm">
            {/* Visual Pulsating Animation */}
            <div className="relative mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="h-6 w-6 text-brand-orange animate-pulse" />
              </div>
            </div>

            {/* Title / Description */}
            <h4 className="text-xl font-extrabold text-brand-black mb-1">
              AI Is Writing Your Paper
            </h4>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              We are generating customized, syllabus-appropriate questions according to your exam structure. This will take about a minute.
            </p>

            {/* Progress Bar container */}
            <div className="w-full max-w-md mt-10">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mb-2">
                <span>{progressMessage}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-orange rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Helpful tip */}
            <p className="text-xs text-gray-400 mt-10 italic">
              Tip: AI uses class levels to frame question wording and vocabulary.
            </p>
          </div>
        ) : (
          /* Step 3: Success / Redirecting Screen */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border-gray bg-white p-8 md:p-16 text-center shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6 shadow-inner border border-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>

            <h4 className="text-xl font-extrabold text-brand-black mb-2">
              Question Paper Generated!
            </h4>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">
              AI has compiled the questions and built the answer key. Redirecting you to the final review screen...
            </p>
            <Loader2 className="h-5 w-5 animate-spin text-brand-orange" />
          </div>
        )}
      </div>
    </div>
  );
}
