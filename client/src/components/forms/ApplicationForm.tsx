import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { btn, Spinner } from "@/components/brand";
import { Field, inputCls } from "@/components/form";
import { applicationService } from "@/services/applicationService";
import { cn } from "@/utils/utils";

interface ApplicationFormProps {
  opportunityId: string;
  opportunityTitle?: string;
  onSuccess?: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string;
}

export function ApplicationForm({ opportunityId, opportunityTitle, onSuccess }: ApplicationFormProps) {
  const navigate = useNavigate();
  // Stripe-style Idempotency Key: stable UUID across retries of this submission
  const idempotencyKeyRef = useRef<string>(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );
  const [f, setF] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    resumeUrl: "",
    coverLetter: "",
  });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [serverErr, setServerErr] = useState<string | null>(null);

  const upd = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }));
    if (errs[k]) {
      setErrs((prev) => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!f.fullName.trim()) next.fullName = "Full name is required";
    if (!f.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(f.email)) next.email = "Please enter a valid email";

    if (!f.phone.trim()) next.phone = "Phone number is required";
    else if (!/^[+\d][\d\s-]{7,}$/.test(f.phone)) next.phone = "Enter a valid phone number (min 8 digits)";

    if (!f.resumeUrl.trim()) next.resumeUrl = "Resume link is required";
    else {
      try {
        new URL(f.resumeUrl);
      } catch {
        next.resumeUrl = "Must be a valid URL (e.g., Google Drive or portfolio)";
      }
    }

    setErrs(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setServerErr(null);

    try {
      await applicationService.submit(
        {
          opportunityId,
          fullName: f.fullName.trim(),
          email: f.email.trim(),
          phone: f.phone.trim(),
          resumeUrl: f.resumeUrl.trim(),
          coverLetter: f.coverLetter.trim() || undefined,
        },
        idempotencyKeyRef.current
      );

      setStatus("done");
      toast.success("Application submitted successfully!");
      if (onSuccess) onSuccess();
      else navigate("/application-success", { state: { role: opportunityTitle || "the position" } });
    } catch (err: any) {
      setServerErr(err.message || "Failed to submit application");
      setStatus("idle");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-lg border-2 border-success bg-secondary p-8 text-center animate-rise">
        <CheckCircle2 className="mx-auto size-12 text-success" />
        <h3 className="mt-3 text-2xl font-bold">Application submitted!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The team has received your application. We'll reach out directly via email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-lg border-2 border-frame bg-card p-6 shadow-hard" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={errs.fullName}>
          <input
            className={inputCls}
            placeholder="Ada Lovelace"
            value={f.fullName}
            onChange={upd("fullName")}
            aria-invalid={!!errs.fullName}
          />
        </Field>
        <Field label="Email address" required error={errs.email}>
          <input
            className={inputCls}
            type="email"
            placeholder="ada@example.com"
            value={f.email}
            onChange={upd("email")}
            aria-invalid={!!errs.email}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone number" required error={errs.phone}>
          <input
            className={inputCls}
            type="tel"
            placeholder="+91 98765 43210"
            value={f.phone}
            onChange={upd("phone")}
            aria-invalid={!!errs.phone}
          />
        </Field>
        <Field label="Resume / Portfolio link" required error={errs.resumeUrl}>
          <input
            className={inputCls}
            type="url"
            placeholder="https://drive.google.com/..."
            value={f.resumeUrl}
            onChange={upd("resumeUrl")}
            aria-invalid={!!errs.resumeUrl}
          />
        </Field>
      </div>

      <Field label="Cover note (optional)" error={errs.coverLetter}>
        <textarea
          className={cn(inputCls, "h-32 py-2")}
          placeholder="Briefly tell us why you are interested in this role..."
          value={f.coverLetter}
          onChange={upd("coverLetter")}
          aria-invalid={!!errs.coverLetter}
        />
      </Field>

      {serverErr && (
        <div className="rounded-md border-2 border-destructive bg-accent p-3 text-sm text-accent-foreground" role="alert">
          {serverErr}
        </div>
      )}

      <button disabled={status === "loading"} className={cn(btn("primary", "lg"), "w-full sm:w-auto")}>
        {status === "loading" ? (
          <>
            <Spinner /> Submitting…
          </>
        ) : (
          "Submit application"
        )}
      </button>
    </form>
  );
}
