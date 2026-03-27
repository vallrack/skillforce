"use client";

import { Plus, Trash2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SchemaProperty } from "@/types/skill";
import { cn } from "@/lib/utils";

interface SchemaBuilderProps {
  title: string;
  description: string;
  properties: SchemaProperty[];
  onChange: (properties: SchemaProperty[]) => void;
}

export function SchemaBuilder({ title, description, properties, onChange }: SchemaBuilderProps) {
  const addProperty = () => {
    onChange([
      ...properties,
      { name: "", type: "string", description: "", required: true },
    ]);
  };

  const updateProperty = (index: number, updates: Partial<SchemaProperty>) => {
    const newProps = [...properties];
    newProps[index] = { ...newProps[index], ...updates };
    onChange(newProps);
  };

  const removeProperty = (index: number) => {
    onChange(properties.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 border border-border bg-card/50 p-4 sm:p-6 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={addProperty} variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Añadir Campo
        </Button>
      </div>

      <div className="space-y-4">
        {properties.length === 0 && (
          <p className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
            No hay propiedades definidas.
          </p>
        )}
        {properties.map((prop, index) => (
          <div key={index} className="flex flex-col gap-4 bg-background/50 p-4 rounded-lg border border-border group relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
              <div className="lg:col-span-3 space-y-1.5">
                <Label className="text-[10px] uppercase text-muted-foreground">Nombre</Label>
                <Input
                  placeholder="ej. idUsuario"
                  value={prop.name}
                  onChange={(e) => updateProperty(index, { name: e.target.value })}
                  className="h-9 text-sm font-code"
                />
              </div>
              <div className="lg:col-span-2 space-y-1.5">
                <Label className="text-[10px] uppercase text-muted-foreground">Tipo</Label>
                <Select
                  value={prop.type}
                  onValueChange={(val: any) => updateProperty(index, { type: val })}
                >
                  <SelectTrigger className="h-9 text-xs font-code">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="number">number</SelectItem>
                    <SelectItem value="boolean">boolean</SelectItem>
                    <SelectItem value="object">object</SelectItem>
                    <SelectItem value="array">array</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-5 space-y-1.5">
                <Label className="text-[10px] uppercase text-muted-foreground">Descripción</Label>
                <Input
                  placeholder="¿Para qué sirve este campo?"
                  value={prop.description}
                  onChange={(e) => updateProperty(index, { description: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 lg:col-span-2 lg:justify-end pt-2 lg:pt-0">
                <button
                  type="button"
                  onClick={() => updateProperty(index, { required: !prop.required })}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition-colors",
                    prop.required ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-transparent text-muted-foreground"
                  )}
                >
                  {prop.required ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  <span className="sm:hidden lg:inline">{prop.required ? "Obligatorio" : "Opcional"}</span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProperty(index)}
                  className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
