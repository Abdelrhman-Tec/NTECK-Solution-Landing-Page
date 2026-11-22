"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import type messages from "../../messages/en.json";
import { Button } from "@/components/ui/button";
import {
  customerTypes, fieldLimits, inquirySchema, projectTypes, stages,
  type Inquiry, type InquiryInput, type InquiryResult,
} from "@/lib/inquiry/schema";

type Copy = typeof messages.Inquiry;
type Field = Exclude<keyof InquiryInput, "website">;

const controlClass = "min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground aria-invalid:border-red-300";

const resolveInquiry: Resolver<InquiryInput, unknown, Inquiry> = (values: InquiryInput) => {
  const result = inquirySchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<InquiryInput> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof InquiryInput;
    if (field && !errors[field]) errors[field] = { type: issue.code };
  }
  return { values: {}, errors };
};

function statusFromResponse(status: number, result: unknown): InquiryResult {
  if (status === 202 && result === "accepted") return "accepted";
  if (status === 429 && result === "rateLimited") return "rateLimited";
  if (status === 503 && result === "unavailable") return "unavailable";
  if (status === 400 && result === "invalid") return "invalid";
  return "failed";
}

export function InquiryForm({ copy, enabled, privacyHref, privacyLabel }: {
  copy: Copy; enabled: boolean; privacyHref: string; privacyLabel: string;
}) {
  const [status, setStatus] = useState<InquiryResult | null>(null);
  const sending = useRef(false);
  const attempt = useRef<{ key: string; body: string }>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<InquiryInput, unknown, Inquiry>({
      resolver: resolveInquiry,
      defaultValues: {
        name: "", email: "", country: "", description: "", whatsapp: "", company: "",
        stage: "", budget: "", timeline: "", consent: false, website: "",
      },
    });

  async function send(inquiry: Inquiry) {
    if (!enabled || sending.current) return;
    sending.current = true;
    setStatus(null);

    try {
      const body = JSON.stringify(inquiry);
      if (attempt.current?.body !== body) attempt.current = { body, key: crypto.randomUUID() };
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.current.key },
        body,
        signal: AbortSignal.timeout(17000),
      });
      const data = await response.json();
      const nextStatus = statusFromResponse(response.status, data.result);
      if (nextStatus === "accepted") {
        reset();
        attempt.current = null;
      }
      setStatus(nextStatus);
    } catch {
      setStatus("failed");
    } finally {
      sending.current = false;
    }
  }

  function errorMessage(field: Field) {
    if (!errors[field]) return null;
    if (field === "description") return copy.errors.description;
    if (field === "email") return copy.errors.email;
    if (field === "whatsapp") return copy.errors.whatsapp;
    if (field === "consent") return copy.errors.consent;
    return copy.errors.invalid;
  }

  function attributes(field: Field) {
    return {
      id: `inquiry-${field}`,
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": [
        field === "description" ? "inquiry-description-help" : "",
        field === "consent" ? "inquiry-privacy-note" : "",
        errors[field] ? `inquiry-${field}-error` : "",
      ].filter(Boolean).join(" ") || undefined,
    };
  }

  function error(field: Field) {
    return errors[field] ? (
      <p id={`inquiry-${field}-error`} className="text-sm text-red-200" role="alert">{errorMessage(field)}</p>
    ) : null;
  }

  function field(name: Field, required: boolean, input: ReactNode, hint?: ReactNode) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold" htmlFor={`inquiry-${name}`}>
          {copy.fields[name]}{" "}
          {!required && <span className="font-normal text-muted-foreground">({copy.optional})</span>}
        </label>
        {hint}
        {input}
        {error(name)}
      </div>
    );
  }

  function select<const Option extends string>(
    name: "customerType" | "projectType" | "stage",
    options: readonly Option[],
    labels: Record<Option, string>,
    required = true,
  ) {
    return field(name, required, (
      <select {...register(name)} {...attributes(name)} className={controlClass} required={required} defaultValue="">
        <option value="">{copy.select}</option>
        {options.map((option) => <option key={option} value={option}>{labels[option]}</option>)}
      </select>
    ));
  }

  return (
    <form
      method="post"
      action="/api/inquiry"
      onSubmit={handleSubmit(send, () => setStatus(null))}
      noValidate
      aria-busy={isSubmitting}
      className="mt-6"
    >
      <fieldset disabled={!enabled || isSubmitting} aria-label={copy.title} className="min-w-0 space-y-5 disabled:opacity-75">
        <div className="grid gap-5 md:grid-cols-2">
          {field("name", true, <input {...register("name")} {...attributes("name")} className={controlClass} autoComplete="name" maxLength={fieldLimits.name} required />)}
          {field("email", true, <input {...register("email")} {...attributes("email")} className={controlClass} type="email" dir="ltr" autoComplete="email" maxLength={fieldLimits.email} required />)}
          {field("country", true, (
            <>
              <input {...register("country")} {...attributes("country")} className={controlClass} autoComplete="country-name" list="inquiry-countries" maxLength={fieldLimits.country} required />
              <datalist id="inquiry-countries">
                <option value={copy.countries.egypt} />
                <option value={copy.countries.saudiArabia} />
              </datalist>
            </>
          ))}
          {select("customerType", customerTypes, copy.customerTypes)}
          {select("projectType", projectTypes, copy.projectTypes)}
          {field("whatsapp", false, <input {...register("whatsapp")} {...attributes("whatsapp")} className={controlClass} type="tel" dir="ltr" autoComplete="tel" maxLength={fieldLimits.whatsapp} />)}
          {field("company", false, <input {...register("company")} {...attributes("company")} className={controlClass} autoComplete="organization" maxLength={fieldLimits.company} />)}
          {select("stage", stages, copy.stages, false)}
          {field("budget", false, <input {...register("budget")} {...attributes("budget")} className={controlClass} maxLength={fieldLimits.budget} />)}
          {field("timeline", false, <input {...register("timeline")} {...attributes("timeline")} className={controlClass} maxLength={fieldLimits.timeline} />)}
        </div>
        {field("description", true, (
          <textarea {...register("description")} {...attributes("description")} className={`${controlClass} resize-y`} rows={5} maxLength={fieldLimits.description} required />
        ), <p id="inquiry-description-help" className="text-sm text-muted-foreground">{copy.descriptionHelp}</p>)}
        <div hidden>
          <input {...register("website")} type="text" tabIndex={-1} autoComplete="off" aria-label={copy.fields.website} />
        </div>
        <div className="space-y-2">
          <p id="inquiry-privacy-note" className="max-w-prose text-sm leading-relaxed text-muted-foreground">{copy.privacyNote}{" "}
            <Link href={privacyHref} className="rounded-sm text-ring underline">{privacyLabel}</Link>
          </p>
          <div className="flex items-start gap-3">
            <input {...register("consent")} {...attributes("consent")} type="checkbox" className="mt-1 size-5 shrink-0 accent-primary" required />
            <label className="text-sm leading-relaxed" htmlFor="inquiry-consent">{copy.fields.consent}</label>
          </div>
          {error("consent")}
        </div>
        <Button type="submit" disabled={!enabled || isSubmitting}>{isSubmitting ? copy.sending : copy.submit}</Button>
      </fieldset>
      <p role="status" className="mt-4 text-sm empty:mt-0">
        {isSubmitting ? copy.sending : status && copy.status[status]}
      </p>
    </form>
  );
}
