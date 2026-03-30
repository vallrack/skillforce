"use client";

import { Download, FileText, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SkillPreviewProps {
  markdown: string;
  isGenerating: boolean;
  onGenerate: () => void;
  skillName: string;
}

export function SkillPreview({ markdown, isGenerating, onGenerate, skillName }: SkillPreviewProps) {
  const handleDownload = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SKILL.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full border-border bg-card/30 flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 py-4 gap-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Vista Previa SKILL.md
        </CardTitle>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            variant="secondary"
            size="sm"
            className="gap-2 flex-1 sm:flex-none"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-accent" />
            )}
            <span className="xs:inline">{markdown ? "Regenerar" : "Generar"}</span>
          </Button>
          {markdown && (
            <Button onClick={handleDownload} variant="default" size="sm" className="gap-2 flex-1 sm:flex-none">
              <Download className="w-4 h-4" />
              <span className="xs:inline">Descargar .md</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden relative">
        <ScrollArea className="h-[400px] lg:h-full w-full">
          {markdown ? (
            <div className="p-4 sm:p-8 font-body prose prose-invert max-w-none">
              <pre className="mcp-code-block whitespace-pre-wrap font-code text-[10px] sm:text-xs">
                {markdown}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8 space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-base sm:text-lg">Sin Documentación</h4>
                <p className="text-muted-foreground max-w-xs mx-auto text-xs sm:text-sm">
                  Haz clic en "Generar con IA" para crear tu SKILL.md.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
