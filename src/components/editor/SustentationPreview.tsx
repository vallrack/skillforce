
"use client";

import { Download, Loader2, FileText, FileDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jsPDF } from "jspdf";

interface SustentationPreviewProps {
  markdown: string;
  isGenerating: boolean;
  skillName?: string;
}

export function SustentationPreview({ markdown, isGenerating, skillName }: SustentationPreviewProps) {
  const handleExportPDF = () => {
    if (!markdown) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`Sustentación Técnica: ${skillName || "Habilidad de IA"}`, margin, 20);

    // Contenido
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    // Eliminar caracteres de markdown básicos para el PDF simple
    const cleanText = markdown
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '');

    const lines = doc.splitTextToSize(cleanText, maxLineWidth);
    
    let cursorY = 35;
    lines.forEach((line: string) => {
      if (cursorY > 280) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, margin, cursorY);
      cursorY += 7;
    });

    doc.save(`Sustentacion_${skillName?.replace(/\s+/g, '_') || "Habilidad"}.pdf`);
  };

  const handleDownloadMD = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Sustentacion_${skillName?.replace(/\s+/g, '_') || "Habilidad"}.md`;
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
            <>
              <Button onClick={handleExportPDF} variant="default" size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                <FileDown className="w-4 h-4" />
                Exportar PDF
              </Button>
              <Button onClick={handleDownloadMD} variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                MD
              </Button>
            </>
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
