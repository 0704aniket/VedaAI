"use client";

import { Assignment } from "@vedaai/shared";
import AssignmentCard from "./AssignmentCard";

interface AssignmentGridProps {
  assignments: Assignment[];
  onDelete: (id: string) => void;
  onGenerate: (id: string) => void;
}

export default function AssignmentGrid({
  assignments,
  onDelete,
  onGenerate,
}: AssignmentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment._id}
          assignment={assignment}
          onDelete={onDelete}
          onGenerate={onGenerate}
        />
      ))}
    </div>
  );
}
