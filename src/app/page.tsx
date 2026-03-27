"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, Clock, Trash2, ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSkills, deleteSkill, createNewSkill } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import type { SkillDraft } from "@/types/skill";

export default function Dashboard() {
  const [skills, setSkills] = useState<SkillDraft[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSkills(getSkills());
    setIsLoaded(true);
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this skill draft?")) {
      deleteSkill(id);
      setSkills(getSkills());
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(129,94,255,0.4)]">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-headline tracking-tighter">SkillForge</h1>
          </div>
          <Link href="/editor">
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2 px-6">
              <Plus className="w-4 h-4" /> Create New Skill
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">My Skill Drafts</h2>
            <p className="text-muted-foreground">Manage and refine your custom AI agent skill documentation.</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {skills.length} Drafts</span>
          </div>
        </div>

        {skills.length === 0 ? (
          <div className="bg-card/30 border border-dashed border-border rounded-2xl py-24 px-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <div className="max-w-md">
              <h3 className="text-xl font-semibold mb-2">Ready to Forge a New Skill?</h3>
              <p className="text-muted-foreground mb-8">
                You haven't created any skills yet. Start by defining metadata, input/output schemas, and generate professional AI documentation.
              </p>
              <Link href="/editor">
                <Button size="lg" className="bg-primary text-white gap-2">
                  <Plus className="w-5 h-5" /> Start First Draft
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.sort((a, b) => b.updatedAt - a.updatedAt).map((skill) => (
              <Link key={skill.id} href={`/editor/${skill.id}`}>
                <Card className="group hover:border-primary/50 transition-all cursor-pointer bg-card/40 hover:bg-card/60 border-border h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-secondary rounded-lg">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(e, skill.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="line-clamp-1">{skill.name}</CardTitle>
                    <CardDescription className="line-clamp-2 h-10 mt-1">
                      {skill.purpose || "No description provided yet."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-foreground">Inputs</span>
                        <span>{skill.inputProperties.length} fields</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-foreground">Outputs</span>
                        <span>{skill.outputProperties.length} fields</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(skill.updatedAt)} ago
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-primary" />
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}