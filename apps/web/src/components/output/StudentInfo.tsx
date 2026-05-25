"use client";

export default function StudentInfo() {
  // Printable underline fields — kept blank so teachers can print and fill.
  const fields = [
    { label: "Student Name", flex: "flex-[2]" },
    { label: "Roll Number", flex: "flex-1" },
    { label: "Section", flex: "flex-1" },
  ];

  return (
    <div className="mb-6 rounded-xl border border-dashed border-gray-300 bg-gray-50/40 p-4 print:border-solid print:bg-transparent">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        {fields.map((f) => (
          <div key={f.label} className={`min-w-[150px] ${f.flex}`}>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {f.label}
            </span>
            <div className="mt-1 h-6 border-b border-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
