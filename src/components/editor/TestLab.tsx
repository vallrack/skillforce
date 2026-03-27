"use client";

import { useState } from "react";
import { Play, Terminal, CheckCircle2, Loader2, Sparkles, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { simulateSkillExecution } from "@/ai/flows/simulate-skill-execution";
import type { SkillDraft } from "@/types/skill";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestLabProps {
  skill: SkillDraft;
}

export function TestLab({ skill }: TestLabProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      const outputSchemaDef = JSON.stringify(
        Object.fromEntries(skill.outputProperties.map(p => [p.name, { type: p.type, description: p.description }])), 
        null, 2
      );

      const response = await simulateSkillExecution({
        skillName: skill.name,
        skillPurpose: skill.purpose,
        inputProperties: skill.inputProperties.map(p => ({
          name: p.name,
          value: inputs[p.name] || ""
        })),
        outputSchemaDefinition: outputSchemaDef
      });

      setResult(response.executionOutput);
      setExplanation(response.explanation);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto lg:overflow-hidden pb-8 lg:pb-0">
      <Card className="border-border bg-card/30 flex flex-col lg:h-full">
        <CardHeader className="py-4 border-b border-border/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            Llamada a la Tool (Request)
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="space-y-4">
              {skill.inputProperties.length === 0 && (
                <p className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
                  Define entradas en la pestaña "Definición" para probar.
                </p>
              )}
              {skill.inputProperties.map((prop) => (
                <div key={prop.name} className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span className="font-code text-primary text-xs sm:text-sm">{prop.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{prop.type}</span>
                  </Label>
                  {prop.type === 'string' && prop.description.toLowerCase().includes('código') ? (
                    <Textarea
                      placeholder={prop.description}
                      className="font-code text-xs bg-black/20"
                      onChange={(e) => handleInputChange(prop.name, e.target.value)}
                    />
                  ) : (
                    <Input
                      placeholder={prop.description}
                      className="bg-black/20"
                      onChange={(e) => handleInputChange(prop.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
              onClick={runSimulation}
              disabled={isLoading || skill.inputProperties.length === 0}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Ejecutar Skill
            </Button>
          </CardContent>
        </ScrollArea>
      </Card>

      <Card className="border-border bg-card/30 flex flex-col lg:h-full overflow-hidden">
        <CardHeader className="py-4 border-b border-border/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            Resultado del Agente (Response)
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 bg-black/20">
          <CardContent className="p-4 sm:p-6 min-h-[300px] flex flex-col h-full">
            {result ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="space-y-2">
                  <Label className="text-[10px] sm:text-xs text-muted-foreground uppercase flex items-center gap-2">
                    <Code className="w-3 h-3" /> JSON de Salida
                  </Label>
                  <pre className="mcp-code-block text-[10px] sm:text-[11px] leading-tight flex-1 max-h-[300px] overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
                
                <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                  <p className="text-[10px] sm:text-xs font-semibold text-accent mb-1 uppercase tracking-wider">Explicación del Agente:</p>
                  <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                    "{explanation}"
                  </p>
                </div>

                <div className="mt-auto p-4 bg-primary/5 border border-primary/10 rounded-lg flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-[10px] text-muted-foreground">
                    Captura esta pantalla como evidencia de tu Skill en funcionamiento.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40 h-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-dashed border-muted-foreground rounded-full flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base">Esperando Ejecución</h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
                  Ingresa los datos de prueba a la izquierda y presiona "Ejecutar Skill".
                </p>
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
