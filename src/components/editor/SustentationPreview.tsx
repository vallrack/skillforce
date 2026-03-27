"use client";

import { Download, Loader2, FileText, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SustentationPreviewProps {
  markdown: string;
  isGenerating: boolean;
}

export function SustentationPreview({ markdown, isGenerating }: SustentationPreviewProps) {
  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Sustentacion_Habilidad.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full border-border bg-card/30 flex flex-col shadow-inner">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Documento de Sustentación
        </CardTitle>
        <div className="flex gap-2">
          {markdown && (
            <Button onClick={handleDownload} variant="default" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar MD
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden relative bg-black/20">
        <ScrollArea className="h-full w-full">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Redactando sustento técnico MCP...</p>
            </div>
          ) : markdown ? (
            <div className="p-8 font-body prose prose-invert max-w-none text-sm leading-relaxed text-muted-foreground">
              <div className="bg-card/50 p-6 rounded-lg border border-border/50 shadow-sm whitespace-pre-wrap">
                {markdown}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 space-y-4 opacity-60">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Documento pendiente</h4>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                  Haz clic en "Forjar Entregables" para generar este documento junto con tu SKILL.md.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
