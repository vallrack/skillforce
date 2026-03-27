"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createNewSkill, saveSkill } from "@/lib/storage";

export default function NewSkillPage() {
  const router = useRouter();

  useEffect(() => {
    const newSkill = createNewSkill();
    saveSkill(newSkill);
    router.replace(`/editor/${newSkill.id}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground font-medium">Forging new workspace...</p>
      </div>
    </div>
  );
}