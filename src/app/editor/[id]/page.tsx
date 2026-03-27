"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Sparkles, Code2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetadataForm } from "@/components/editor/MetadataForm";
import { SchemaBuilder } from "@/components/editor/SchemaBuilder";
import { SkillPreview } from "@/components/editor/SkillPreview";
import { getSkill, saveSkill } from "@/lib/storage";
import { generateSkillDocumentation } from "@/ai/flows/generate-skill-documentation";
import type { SkillDraft } from "@/types/skill";
import { useToast } from "@/hooks/use-toast";

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [skill, setSkill] = useState<SkillDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerateDocumentation = async () => {
    if (!skill) return;
    
    if (!skill.name || !skill.purpose || !skill.problem) {
      toast({
        title: "Faltan Metadatos",
        description: "Por favor, proporciona un nombre, propósito y descripción del problema primero.",
        variant: "destructive",
      });
      setActiveTab("metadata");
      return;
    }

    setIsGenerating(true);
    try {
      const inputSchemaDef = JSON.stringify(
        Object.fromEntries(
          skill.inputProperties.map(p => [
            p.name, 
            { type: p.type, description: p.description, required: p.required }
          ])
        ), 
        null, 
        2
      );

      const outputSchemaDef = JSON.stringify(
        Object.fromEntries(
          skill.outputProperties.map(p => [
            p.name, 
            { type: p.type, description: p.description, required: p.required }
          ])
        ), 
        null, 
        2
      );

      const result = await generateSkillDocumentation({
        skillName: skill.name,
        skillPurpose: skill.purpose,
        problemSolved: skill.problem,
        inputSchemaDefinition: inputSchemaDef,
        outputSchemaDefinition: outputSchemaDef,
      });

      handleUpdate({ generatedMarkdown: result.generatedMarkdown });
      toast({
        title: "Documentación Lista",
        description: "Tu archivo SKILL.md profesional ha sido forjado.",
      });
    } catch (error) {
      console.error("Falló la generación de documentación", error);
      toast({
        title: "Generación Fallida",
        description: "Hubo un error al conectar con la forja de IA. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
              <span className="font-semibold">{skill.name || "Habilidad sin título"}</span>
              <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground uppercase tracking-wider font-bold">Borrador</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => saveSkill(skill)} className="gap-2">
              <Save className="w-4 h-4" /> Guardar Borrador
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white gap-2"
              onClick={handleGenerateDocumentation}
              disabled={isGenerating}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              Forjar SKILL.md
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <div className="space-y-6 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1 mb-8">
                <TabsTrigger value="metadata" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Definición y Contexto</TabsTrigger>
                <TabsTrigger value="schema" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Esquema de Datos</TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className="mt-0 space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <section>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1">Contexto de la Habilidad</h2>
                    <p className="text-sm text-muted-foreground">Define la identidad y el impacto de tu capacidad de IA personalizada.</p>
                  </div>
                  <MetadataForm
                    name={skill.name}
                    purpose={skill.purpose}
                    problem={skill.problem}
                    onChange={(updates) => handleUpdate(updates)}
                  />
                </section>
                
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-primary mb-1">Consejo Pro: SKILL.md Estándar</p>
                    <p className="text-muted-foreground">Declaraciones de propósito claras ayudan a los agentes de IA a decidir cuándo llamar a esta habilidad. Sé específico.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schema" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <section>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1">Estructuras de Datos</h2>
                    <p className="text-sm text-muted-foreground">Define exactamente qué datos entran y salen de tu habilidad.</p>
                  </div>
                  <div className="space-y-8">
                    <SchemaBuilder
                      title="Esquema de Entrada"
                      description="Datos esperados del agente de IA u orquestador."
                      properties={skill.inputProperties}
                      onChange={(inputProperties) => handleUpdate({ inputProperties })}
                    />
                    <SchemaBuilder
                      title="Esquema de Salida"
                      description="Datos devueltos por la habilidad al agente."
                      properties={skill.outputProperties}
                      onChange={(outputProperties) => handleUpdate({ outputProperties })}
                    />
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </div>

          <div className="h-[calc(100vh-10rem)] sticky top-24">
            <SkillPreview
              markdown={skill.generatedMarkdown || ""}
              isGenerating={isGenerating}
              onGenerate={handleGenerateDocumentation}
              skillName={skill.name}
            />
          </div>
        </div>
      </main>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  );
}
