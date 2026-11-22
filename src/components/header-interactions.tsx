"use client";

import { Menu, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type NavigationLink = { href: string; label: string };

export function HeaderFrame({ children }: { children: ReactNode }) {
  const marker = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const target = marker.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={marker} aria-hidden="true" className="pointer-events-none absolute inset-bs-0 h-px" />
      <header className="site-header sticky inset-bs-0 z-30 border-b border-border" data-scrolled={scrolled}>
        {children}
      </header>
    </>
  );
}

export function MobileNavigation({
  title,
  openLabel,
  closeLabel,
  direction,
  links,
  booking,
}: {
  title: string;
  openLabel: string;
  closeLabel: string;
  direction: "ltr" | "rtl";
  links: NavigationLink[];
  booking: NavigationLink;
}) {
  const [open, setOpen] = useState(false);
  const destination = useRef<string | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  function follow(href: string) {
    const url = new URL(href, window.location.origin);
    destination.current = url.pathname === window.location.pathname && url.hash
      ? url.hash.slice(1)
      : null;
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" aria-label={openLabel} className="size-11 px-0 lg:hidden">
          <Menu size={20} aria-hidden="true" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/75" />
        <Dialog.Content
          dir={direction}
          aria-describedby={undefined}
          className="fixed inset-be-0 inset-bs-0 inset-e-0 z-50 w-full max-w-sm overflow-y-auto border-s border-border bg-card p-6 shadow-2xl"
          onCloseAutoFocus={(event) => {
            const target = destination.current;
            destination.current = null;
            const section = target ? document.getElementById(target) : null;
            if (section) {
              event.preventDefault();
              section.focus({ preventScroll: true });
              section.scrollIntoView({ block: "start" });
            }
          }}
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="outline" aria-label={closeLabel} className="size-11 px-0">
                <X size={20} aria-hidden="true" />
              </Button>
            </Dialog.Close>
          </div>
          <nav aria-label={title} className="grid gap-1">
            {links.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => follow(href)} className="flex min-h-11 items-center rounded-lg px-3 hover:bg-muted">
                {label}
              </a>
            ))}
            <Button asChild className="mt-4 justify-start">
              <a href={booking.href} onClick={() => follow(booking.href)}>{booking.label}</a>
            </Button>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
