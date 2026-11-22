"use client";

import { Braces, Layers3, Workflow } from "lucide-react";
import { domAnimation, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

export function HeroVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        aria-hidden="true"
        className="hero-visual relative mx-auto aspect-[6/5] w-full max-w-xl"
        initial={false}
        animate={reduceMotion ? { y: 0 } : { y: [0, -5, 0] }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      >
        <div className="hero-dashboard absolute rounded-2xl border border-border bg-card/95 shadow-xl">
          <div className="flex h-9 items-center gap-1.5 border-b border-border px-3">
            <i /><i /><i />
          </div>
          <div className="grid h-[calc(100%-2.25rem)] grid-cols-[1fr_3fr] gap-3 p-3 sm:p-4">
            <div className="space-y-3 border-e border-border pe-2 text-muted-foreground">
              <Layers3 size={16} />
              <span className="visual-line" />
              <span className="visual-line w-2/3" />
            </div>
            <div className="grid min-h-0 grid-rows-[1.5fr_1fr] gap-2">
              <div className="hero-grid rounded-md border border-border">
                <Braces size={24} className="text-ring" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="rounded-md bg-muted" />
                <span className="rounded-md bg-muted" />
              </div>
            </div>
          </div>
        </div>
        <div className="hero-phone absolute flex flex-col gap-2 rounded-2xl border border-border bg-card p-[5%] shadow-2xl">
          <span className="mx-auto h-1 w-1/3 rounded-full bg-border" />
          <span className="hero-grid grid flex-1 place-items-center rounded-lg border border-border">
            <Layers3 size={24} className="text-ring" />
          </span>
          <span className="visual-line" />
          <span className="visual-line w-2/3" />
          <span className="mt-1 h-4 rounded bg-primary" />
        </div>
        <div className="hero-pipeline absolute flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-ring shadow-xl sm:gap-3 sm:px-4">
          <Workflow size={20} />
          <span className="h-px w-4 bg-border" />
          <span className="size-2 rounded-full bg-accent" />
          <span className="h-px w-4 bg-border" />
          <Braces size={18} />
        </div>
      </m.div>
    </LazyMotion>
  );
}
