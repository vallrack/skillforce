"use client";

import { Download, Loader2, FileText, FileDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jsPDF } from "jspdf";
import type { SkillDraft } from "@/types/skill";

interface SustentationPreviewProps {
  markdown: string;
  isGenerating: boolean;
  skill?: SkillDraft;
}

export function SustentationPreview({ markdown, isGenerating, skill }: SustentationPreviewProps) {
  const handleExportPDF = () => {
    if (!markdown || !skill) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxLineWidth = pageWidth - margin * 2;

      // --- PÁGINA 1: PORTADA ---
      if (skill.logoUri) {
        try {
          const format = skill.logoUri.includes('png') ? 'PNG' : 'JPEG';
          doc.addImage(skill.logoUri, format, pageWidth / 2 - 25, 30, 50, 50);
        } catch (e) {
          console.warn("No se pudo añadir el logo al PDF", e);
        }
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(skill.universityName?.toUpperCase() || "INSTITUCIÓN EDUCATIVA", pageWidth / 2, 90, { align: "center" });
      
      doc.setFontSize(22);
      doc.text("SUSTENTACIÓN TÉCNICA", pageWidth / 2, 120, { align: "center" });
      
      doc.setFontSize(18);
      doc.text(`Habilidad de IA: ${skill.name}`, pageWidth / 2, 132, { align: "center" });
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Presentado por:", pageWidth / 2, 170, { align: "center" });
      
      doc.setFont("helvetica", "bold");
      doc.text(skill.studentName || "Nombre del Estudiante", pageWidth / 2, 178, { align: "center" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Programa: ${skill.courseName || "IA Generativa"}`, pageWidth / 2, 210, { align: "center" });
      
      const dateStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      doc.text(dateStr, pageWidth / 2, 225, { align: "center" });
      
      doc.text("2024 - 2025", pageWidth / 2, 270, { align: "center" });

      // --- PÁGINA 2 EN ADELANTE: CONTENIDO ---
      doc.addPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("CONTENIDO TÉCNICO", margin, 20);
      doc.line(margin, 22, pageWidth - margin, 22);
      
      doc.setFontSize(11);
      
      const lines = markdown.split('\n');
      let cursorY = 35;
      
      lines.forEach((line) => {
        // Manejo básico de estilos
        if (line.startsWith('#')) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(13);
          const cleanLine = line.replace(/#/g, '').trim();
          const splitHeader = doc.splitTextToSize(cleanLine, maxLineWidth);
          doc.text(splitHeader, margin, cursorY);
          cursorY += (splitHeader.length * 7) + 2;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
        } else if (line.trim() === '') {
          cursorY += 5;
        } else {
          const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '');
          const wrappedLines = doc.splitTextToSize(cleanLine, maxLineWidth);
          
          wrappedLines.forEach((wrappedLine: string) => {
            if (cursorY > pageHeight - margin) {
              doc.addPage();
              cursorY = 20;
            }
            doc.text(wrappedLine, margin, cursorY);
            cursorY += 6;
          });
        }

        if (cursorY > pageHeight - margin) {
          doc.addPage();
          cursorY = 20;
        }
      });

      doc.save(`Sustentacion_${skill.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor, intenta de nuevo.");
    }
  };

  const handleDownloadMD = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Sustentacion_${skill?.name.replace(/\s+/g, '_') || "Habilidad"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full border-border bg-card/30 flex flex-col shadow-inner">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 py-4 gap-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Sustentación
        </CardTitle>
        <div className="flex gap-2 w-full sm:w-auto">
          {markdown && (
            <>
              <Button onClick={handleExportPDF} variant="default" size="sm" className="gap-2 bg-primary hover:bg-primary/90 flex-1 sm:flex-none">
                <FileDown className="w-4 h-4" />
                <span className="hidden xs:inline">PDF Portada</span>
                <span className="xs:hidden">PDF</span>
              </Button>
              <Button onClick={handleDownloadMD} variant="outline" size="sm" className="gap-2 flex-none" title="Descargar como Markdown (compatible con Word)">
                <Download className="w-4 h-4" />
                <span className="hidden xs:inline">Word/MD</span>
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden relative bg-black/20">
        <ScrollArea className="h-[400px] lg:h-full w-full">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse text-sm">Redactando sustento técnico completo...</p>
            </div>
          ) : markdown ? (
            <div className="p-4 sm:p-8 font-body prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-muted-foreground">
              <div className="bg-card/50 p-4 sm:p-6 rounded-lg border border-border/50 shadow-sm whitespace-pre-wrap">
                {markdown}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8 space-y-4 opacity-60">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-base sm:text-lg">Documento pendiente</h4>
                <p className="text-muted-foreground max-w-xs mx-auto text-xs sm:text-sm">
                  Haz clic en "Forjar Entregables" para generar.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
