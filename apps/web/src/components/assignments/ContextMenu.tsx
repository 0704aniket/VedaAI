"use client";

import { useEffect, useRef } from "react";
import { Eye, Trash2 } from "lucide-react";

interface ContextMenuProps {
  onView: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function ContextMenu({ onView, onDelete, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-10 z-10 w-44 rounded-xl border border-border-gray bg-white py-1 shadow-lg ring-1 ring-black/5"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onView();
          onClose();
        }}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Eye className="h-4 w-4 text-gray-400" />
        View Details
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
          onClose();
        }}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
      >
        <Trash2 className="h-4 w-4 text-red-400" />
        Delete Assignment
      </button>
    </div>
  );
}
