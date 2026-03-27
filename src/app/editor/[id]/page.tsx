"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Sparkles, Code2, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetadataForm } from "@/components/editor/MetadataForm";
import { SchemaBuilder } from "@/components/editor/SchemaBuilder";
import { SkillPreview } from "@/components/editor/SkillPreview";
import { SustentationPreview } from "@/components/editor/SustentationPreview";
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
  const [activeTab, setActiveTab] = useState("metadata");

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
      setActiveTab("metadata");
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

      // Generar simultáneamente
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
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="h-6 w-px bg-border mx-1" />
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">{skill.name || "Nueva Habilidad"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => saveSkill(skill)} className="gap-2">
              <Save className="w-4 h-4" /> Guardar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-[0_0_15px_rgba(129,94,255,0.3)]"
              onClick={handleGenerateAll}
              disabled={isGenerating || isGeneratingSustentation}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              Forjar Entregables
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <div className="space-y-6 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1 mb-8">
                <TabsTrigger value="metadata">Definición y Portada</TabsTrigger>
                <TabsTrigger value="schema">Esquemas (MCP)</TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className="mt-0 space-y-8">
                <section>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold">Configuración y Estilo</h2>
                    <p className="text-sm text-muted-foreground">Define tu habilidad y personaliza tu portada académica.</p>
                  </div>
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
                </section>
                
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-accent mb-1">Habilidad para el Curso</p>
                    <p className="text-muted-foreground">Recuerda que para el curso, tu habilidad debe resolver un problema de desarrollo, gestión o consulta técnica.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schema" className="mt-0 space-y-8">
                <section>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold">Contratos de Datos (MCP)</h2>
                    <p className="text-sm text-muted-foreground">Define las entradas y salidas para que el orquestador sepa cómo llamar a tu tool.</p>
                  </div>
                  <div className="space-y-8">
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
                </section>
              </TabsContent>
            </Tabs>
          </div>

          <div className="h-[calc(100vh-10rem)] sticky top-24">
            <Tabs defaultValue="skill" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="skill" className="gap-2"><FileText className="w-4 h-4" /> SKILL.md</TabsTrigger>
                <TabsTrigger value="sustentation" className="gap-2"><AlertCircle className="w-4 h-4" /> Sustentación</TabsTrigger>
              </TabsList>
              
              <TabsContent value="skill" className="flex-1 overflow-hidden mt-0">
                <SkillPreview
                  markdown={skill.generatedMarkdown || ""}
                  isGenerating={isGenerating}
                  onGenerate={handleGenerateAll}
                  skillName={skill.name}
                />
              </TabsContent>
              
              <TabsContent value="sustentation" className="flex-1 overflow-hidden mt-0">
                <SustentationPreview
                  markdown={skill.generatedSustentation || ""}
                  isGenerating={isGeneratingSustentation}
                  skill={skill}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 10px; }
      `}</style>
    </div>
  );
}
