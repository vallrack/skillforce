"use client";

import { Plus, Trash2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SchemaProperty } from "@/types/skill";

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
    <div className="space-y-4 border border-border bg-card/50 p-6 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={addProperty} variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Añadir Campo
        </Button>
      </div>

      <div className="space-y-3">
        {properties.length === 0 && (
          <p className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
            No hay propiedades definidas. Haz clic en "Añadir Campo" para comenzar.
          </p>
        )}
        {properties.map((prop, index) => (
          <div key={index} className="grid grid-cols-12 gap-3 items-start bg-background/50 p-3 rounded-lg border border-border group">
            <div className="col-span-3 space-y-1.5">
              <Label className="text-[10px] uppercase text-muted-foreground">Nombre</Label>
              <Input
                placeholder="ej. idUsuario"
                value={prop.name}
                onChange={(e) => updateProperty(index, { name: e.target.value })}
                className="h-8 text-sm font-code"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[10px] uppercase text-muted-foreground">Tipo</Label>
              <Select
                value={prop.type}
                onValueChange={(val: any) => updateProperty(index, { type: val })}
              >
                <SelectTrigger className="h-8 text-xs font-code">
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
            <div className="col-span-5 space-y-1.5">
              <Label className="text-[10px] uppercase text-muted-foreground">Descripción</Label>
              <Input
                placeholder="¿Para qué sirve este campo?"
                value={prop.description}
                onChange={(e) => updateProperty(index, { description: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center space-y-2 pt-5">
              <button
                type="button"
                onClick={() => updateProperty(index, { required: !prop.required })}
                className="text-muted-foreground hover:text-primary transition-colors"
                title={prop.required ? "Obligatorio" : "Opcional"}
              >
                {prop.required ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
              </button>
            </div>
            <div className="col-span-1 pt-5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeProperty(index)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
