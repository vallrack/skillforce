"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MetadataFormProps {
  name: string;
  purpose: string;
  problem: string;
  onChange: (updates: { name?: string; purpose?: string; problem?: string }) => void;
}

export function MetadataForm({ name, purpose, problem, onChange }: MetadataFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">Skill Name</Label>
        <Input
          id="name"
          placeholder="e.g. Code Review Assistant"
          value={name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="bg-card/50 border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose" className="text-sm font-medium">Core Purpose</Label>
        <Textarea
          id="purpose"
          placeholder="Explain what this skill aims to achieve..."
          value={purpose}
          onChange={(e) => onChange({ purpose: e.target.value })}
          className="bg-card/50 border-border min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="problem" className="text-sm font-medium">Problem Solved</Label>
        <Textarea
          id="problem"
          placeholder="What real-world pain point does this address?"
          value={problem}
          onChange={(e) => onChange({ problem: e.target.value })}
          className="bg-card/50 border-border min-h-[100px]"
        />
      </div>
    </div>
  );
}