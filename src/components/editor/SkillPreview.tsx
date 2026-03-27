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
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Preview SKILL.md
        </CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-accent" />
            )}
            {markdown ? "Regenerate" : "Generate AI Docs"}
          </Button>
          {markdown && (
            <Button onClick={handleDownload} variant="primary" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden relative">
        <ScrollArea className="h-[calc(100vh-12rem)] w-full">
          {markdown ? (
            <div className="p-8 font-body prose prose-invert max-w-none">
              <pre className="mcp-code-block whitespace-pre-wrap font-code">
                {markdown}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">No Documentation Generated</h4>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                  Complete the metadata and schema forms, then click "Generate AI Docs" to create your SKILL.md.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}