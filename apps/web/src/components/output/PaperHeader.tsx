"use client";

interface PaperHeaderProps {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
}

export default function PaperHeader({
  schoolName,
  subject,
  className,
  timeAllowed,
  maxMarks,
}: PaperHeaderProps) {
  return (
    <div className="text-center border-b-2 border-brand-black pb-5 mb-5 select-none">
      {/* School Name */}
      <h2 className="text-xl md:text-2xl font-black text-brand-black uppercase tracking-wide leading-tight">
        {schoolName}
      </h2>

      {/* Sub Title / Exam Title */}
      <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
        Term Assessment & Evaluation
      </p>

      {/* Subject and Class Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-5 text-sm border-t border-b border-gray-150 py-3.5 font-semibold text-gray-700">
        <div>
          <span className="text-xs text-gray-400 block uppercase font-bold">Subject</span>
          <span className="text-brand-black">{subject}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block uppercase font-bold">Class</span>
          <span className="text-brand-black">Class {className}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block uppercase font-bold">Time Allowed</span>
          <span className="text-brand-black">{timeAllowed}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block uppercase font-bold">Maximum Marks</span>
          <span className="text-brand-black">{maxMarks} Marks</span>
        </div>
      </div>
    </div>
  );
}
