"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Sparkles, Code2, FileText, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetadataForm } from "@/components/editor/MetadataForm";
import { SchemaBuilder } from "@/components/editor/SchemaBuilder";
import { SkillPreview } from "@/components/editor/SkillPreview";
import { SustentationPreview } from "@/components/editor/SustentationPreview";
import { TestLab } from "@/components/editor/TestLab";
import { getSkill, saveSkill } from "@/lib/storage";
import { generateSkillDocumentation } from "@/ai/flows/generate-skill-documentation";
import { generateSustentation } from "@/ai/flows/generate-sustentation-flow";
import type { SkillDraft } from "@/types/skill";
import { useToast } from "@/hooks/use-toast";

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [skill, setSkill] = useState<SkillDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingSustentation, setIsGeneratingSustentation] = useState(false);
  const [activeTab, setActiveTab] = useState("definition");

  useEffect(() => {
    const draft = getSkill(id);
    if (!draft) {
      router.push("/");
      return;
    }
    setSkill(draft);
  }, [id, router]);

  const handleUpdate = (updates: Partial<SkillDraft>) => {
    if (!skill) return;
    const updated = { ...skill, ...updates };
    setSkill(updated);
    saveSkill(updated);
  };

  const handleGenerateAll = async () => {
    if (!skill) return;
    
    if (!skill.name || !skill.purpose || !skill.problem) {
      toast({
        title: "Faltan Metadatos",
        description: "Por favor, completa la información básica primero.",
        variant: "destructive",
      });
      setActiveTab("definition");
      return;
    }

    setIsGenerating(true);
    setIsGeneratingSustentation(true);
    
    try {
      const inputSchemaDef = JSON.stringify(
        Object.fromEntries(skill.inputProperties.map(p => [p.name, { type: p.type, description: p.description, required: p.required }])), 
        null, 2
      );
      const outputSchemaDef = JSON.stringify(
        Object.fromEntries(skill.outputProperties.map(p => [p.name, { type: p.type, description: p.description, required: p.required }])), 
        null, 2
      );

      const [docResult, sustResult] = await Promise.all([
        generateSkillDocumentation({
          skillName: skill.name,
          skillPurpose: skill.purpose,
          problemSolved: skill.problem,
          inputSchemaDefinition: inputSchemaDef,
          outputSchemaDefinition: outputSchemaDef,
        }),
        generateSustentation({
          skillName: skill.name,
          skillPurpose: skill.purpose,
          problemSolved: skill.problem,
        })
      ]);

      handleUpdate({ 
        generatedMarkdown: docResult.generatedMarkdown,
        generatedSustentation: sustResult.sustentationMarkdown
      });

      toast({
        title: "¡Forja Completada!",
        description: "Se han generado el SKILL.md y el documento de sustentación.",
      });
      setActiveTab("previews");
    } catch (error) {
      toast({
        title: "Error en la forja",
        description: "No se pudieron generar los documentos. Revisa tu conexión.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setIsGeneratingSustentation(false);
    }
  };

  if (!skill) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="h-6 w-px bg-border shrink-0 hidden sm:block" />
            <div className="flex items-center gap-2 overflow-hidden">
              <Code2 className="w-5 h-5 text-primary shrink-0" />
              <span className="font-semibold truncate text-sm sm:text-base">{skill.name || "Nueva Habilidad"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => saveSkill(skill)} className="gap-2 hidden sm:flex">
              <Save className="w-4 h-4" /> Guardar
            </Button>
            <Button 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-[0_0_15px_rgba(129,94,255,0.3)]"
              onClick={handleGenerateAll}
              disabled={isGenerating || isGeneratingSustentation}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="hidden xs:inline">Forjar Entregables</span>
              <span className="xs:hidden">Forjar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-8 overflow-hidden flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col space-y-4 sm:space-y-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="bg-secondary/50 p-1 w-full sm:w-auto grid grid-cols-3 sm:flex">
              <TabsTrigger value="definition" className="gap-2 text-xs sm:text-sm">
                <Code2 className="w-4 h-4 hidden xs:block" /> Definición
              </TabsTrigger>
              <TabsTrigger value="lab" className="gap-2 text-accent text-xs sm:text-sm">
                <PlayCircle className="w-4 h-4 hidden xs:block" /> Lab
              </TabsTrigger>
              <TabsTrigger value="previews" className="gap-2 text-xs sm:text-sm">
                <FileText className="w-4 h-4 hidden xs:block" /> Entrega
              </TabsTrigger>
            </TabsList>
            
            <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-2 justify-end sm:justify-start">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Modo Editor Activo
            </div>
          </div>

          <TabsContent value="definition" className="mt-0 focus-visible:ring-0 flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 h-full overflow-y-auto lg:overflow-hidden pb-8 lg:pb-0">
              <div className="space-y-8 lg:overflow-y-auto lg:pr-2 lg:h-full custom-scrollbar">
                <MetadataForm
                  name={skill.name}
                  purpose={skill.purpose}
                  problem={skill.problem}
                  studentName={skill.studentName}
                  universityName={skill.universityName}
                  courseName={skill.courseName}
                  logoUri={skill.logoUri}
                  onChange={(updates) => handleUpdate(updates)}
                />
                
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-accent mb-1">Habilidad para el Curso</p>
                    <p className="text-muted-foreground">Define bien tus contratos para que el Laboratorio pueda simular la ejecución correctamente.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 lg:overflow-y-auto lg:pr-2 lg:h-full custom-scrollbar">
                <SchemaBuilder
                  title="Entradas (Parameters)"
                  description="Variables que el agente debe proporcionar."
                  properties={skill.inputProperties}
                  onChange={(inputProperties) => handleUpdate({ inputProperties })}
                />
                <SchemaBuilder
                  title="Salidas (Result)"
                  description="Datos estructurados que devuelve tu habilidad."
                  properties={skill.outputProperties}
                  onChange={(outputProperties) => handleUpdate({ outputProperties })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lab" className="mt-0 focus-visible:ring-0 flex-1 overflow-hidden">
            <TestLab skill={skill} />
          </TabsContent>

          <TabsContent value="previews" className="mt-0 focus-visible:ring-0 flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 h-full overflow-y-auto lg:overflow-hidden pb-8 lg:pb-0">
              <div className="lg:h-full">
                <SkillPreview
                  markdown={skill.generatedMarkdown || ""}
                  isGenerating={isGenerating}
                  onGenerate={handleGenerateAll}
                  skillName={skill.name}
                />
              </div>
              <div className="lg:h-full">
                <SustentationPreview
                  markdown={skill.generatedSustentation || ""}
                  isGenerating={isGeneratingSustentation}
                  skill={skill}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <style jsx global>{`
        @media (min-width: 1024px) {
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 10px; }
        }
        @container (max-width: 400px) {
          .xs-hidden { display: none; }
        }
      `}</style>
    </div>
  );
}
