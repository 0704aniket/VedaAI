"use client";

import { useState, useRef } from "react";
import { UploadCloud, File, X, Info } from "lucide-react";

interface FileUploadProps {
  fileName: string | null;
  onFileSelect: (file: File | null) => void;
}

export default function FileUpload({ fileName, onFileSelect }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.type === "text/plain") {
        onFileSelect(file);
      } else {
        alert("Only PDF and text files are supported!");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-brand-black mb-2 flex items-center gap-1">
        Upload Reference Syllabus / Material
        <span className="text-xs font-normal text-gray-400">(Optional)</span>
      </label>

      {fileName ? (
        // Selected File Display
        <div className="flex items-center justify-between rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white shadow-md shadow-brand-orange/15">
              <File className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-brand-black truncate max-w-xs md:max-w-md">
                {fileName}
              </p>
              <p className="text-xs text-gray-400 font-semibold uppercase">
                Uploaded reference file
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            type="button"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      ) : (
        // Drag & Drop Area
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? "border-brand-orange bg-brand-orange/5 scale-[1.01]"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400 mb-3 group-hover:text-brand-orange">
            <UploadCloud className="h-6 w-6" />
          </div>

          <p className="text-sm font-bold text-brand-black">
            Drag & drop files or <span className="text-brand-orange hover:underline">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1.5 font-semibold">
            Supported formats: PDF, TXT (Max 5MB)
          </p>
        </div>
      )}

      {/* Info notice */}
      <div className="flex items-start gap-2 mt-3 text-xs text-gray-500 leading-normal bg-gray-50 rounded-xl p-3 border border-border-gray">
        <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
        <p>
          AI will prioritize questions from this reference material. If empty, the AI will use its general knowledge base for the selected subject.
        </p>
      </div>
    </div>
  );
}
