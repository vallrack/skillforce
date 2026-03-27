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
        <Label htmlFor="name" className="text-sm font-medium">Nombre de la Habilidad</Label>
        <Input
          id="name"
          placeholder="ej. Asistente de Revisión de Código"
          value={name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="bg-card/50 border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose" className="text-sm font-medium">Propósito Principal</Label>
        <Textarea
          id="purpose"
          placeholder="Explica qué busca lograr esta habilidad..."
          value={purpose}
          onChange={(e) => onChange({ purpose: e.target.value })}
          className="bg-card/50 border-border min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="problem" className="text-sm font-medium">Problema que Resuelve</Label>
        <Textarea
          id="problem"
          placeholder="¿Qué punto de dolor real aborda?"
          value={problem}
          onChange={(e) => onChange({ problem: e.target.value })}
          className="bg-card/50 border-border min-h-[100px]"
        />
      </div>
    </div>
  );
}
