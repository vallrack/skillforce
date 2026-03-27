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
import type { SkillDraft, SchemaProperty } from "@/types/skill";
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
        title: "Missing Metadata",
        description: "Please provide a name, purpose, and problem description first.",
        variant: "destructive",
      });
      setActiveTab("metadata");
      return;
    }

    setIsGenerating(true);
    try {
      // Build Zod-like JSON definitions from our UI properties
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
        title: "Documentation Ready",
        description: "Your professional SKILL.md has been forged.",
      });
    } catch (error) {
      console.error("Documentation generation failed", error);
      toast({
        title: "Generation Failed",
        description: "There was an error connecting to the AI forge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!skill) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
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
              <span className="font-semibold">{skill.name || "Untitled Skill"}</span>
              <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground uppercase tracking-wider font-bold">Draft</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => saveSkill(skill)} className="gap-2">
              <Save className="w-4 h-4" /> Save Draft
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white gap-2"
              onClick={handleGenerateDocumentation}
              disabled={isGenerating}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              Forge SKILL.md
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 container mx-auto px-6 py-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Editor Column */}
          <div className="space-y-6 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 p-1 mb-8">
                <TabsTrigger value="metadata" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Definition & Context</TabsTrigger>
                <TabsTrigger value="schema" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Input & Output Schema</TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className="mt-0 space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <section>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1">Skill Context</h2>
                    <p className="text-sm text-muted-foreground">Define the identity and impact of your custom AI capability.</p>
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
                    <p className="font-semibold text-primary mb-1">Pro Tip: Standard SKILL.md</p>
                    <p className="text-muted-foreground">Clear purpose statements help AI agents decide when to call this skill. Be specific about the problem solved.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schema" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <section>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1">Data Structures</h2>
                    <p className="text-sm text-muted-foreground">Define exactly what data goes in and what comes out of your skill.</p>
                  </div>
                  <div className="space-y-8">
                    <SchemaBuilder
                      title="Input Schema"
                      description="Data expected from the AI agent or orchestrator."
                      properties={skill.inputProperties}
                      onChange={(inputProperties) => handleUpdate({ inputProperties })}
                    />
                    <SchemaBuilder
                      title="Output Schema"
                      description="Data returned by the skill back to the agent."
                      properties={skill.outputProperties}
                      onChange={(outputProperties) => handleUpdate({ outputProperties })}
                    />
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Column */}
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