"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MetadataFormProps {
  name: string;
  purpose: string;
  problem: string;
  studentName?: string;
  universityName?: string;
  courseName?: string;
  logoUri?: string;
  onChange: (updates: any) => void;
}

export function MetadataForm({ 
  name, 
  purpose, 
  problem, 
  studentName, 
  universityName, 
  courseName,
  logoUri,
  onChange 
}: MetadataFormProps) {
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ logoUri: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Información de la Habilidad</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Habilidad</Label>
            <Input
              id="name"
              placeholder="ej. Asistente de Revisión de Código"
              value={name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="bg-card/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Propósito Principal</Label>
            <Textarea
              id="purpose"
              placeholder="Explica qué busca lograr esta habilidad..."
              value={purpose}
              onChange={(e) => onChange({ purpose: e.target.value })}
              className="bg-card/50 border-border min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Problema que Resuelve</Label>
            <Textarea
              id="problem"
              placeholder="¿Qué punto de dolor real aborda?"
              value={problem}
              onChange={(e) => onChange({ problem: e.target.value })}
              className="bg-card/50 border-border min-h-[80px]"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-border/50">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">Datos de Portada (Académicos)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentName">Nombre del Estudiante</Label>
            <Input
              id="studentName"
              placeholder="Tu nombre completo"
              value={studentName || ""}
              onChange={(e) => onChange({ studentName: e.target.value })}
              className="bg-card/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="universityName">Universidad / Institución</Label>
            <Input
              id="universityName"
              placeholder="Nombre de tu universidad"
              value={universityName || ""}
              onChange={(e) => onChange({ universityName: e.target.value })}
              className="bg-card/50 border-border"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="courseName">Curso / Programa</Label>
            <Input
              id="courseName"
              placeholder="IA Generativa, MCP, etc."
              value={courseName || ""}
              onChange={(e) => onChange({ courseName: e.target.value })}
              className="bg-card/50 border-border"
            />
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <Label>Logo de la Institución</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-card/30 overflow-hidden">
                {logoUri ? (
                  <>
                    <img src={logoUri} alt="Logo" className="w-full h-full object-contain p-2" />
                    <button 
                      onClick={() => onChange({ logoUri: undefined })}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 hover:scale-110 transition-transform"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground opacity-20" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 cursor-pointer"
                >
                  <label htmlFor="logo-upload">
                    <Upload className="w-4 h-4" /> Subir Logo
                  </label>
                </Button>
                <p className="text-[10px] text-muted-foreground mt-2">Formatos: PNG, JPG (Máx 2MB)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
