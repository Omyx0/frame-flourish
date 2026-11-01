import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { btn } from "@/components/brand";

export function ApplicationSuccessPage() {
  const location = useLocation();
  const role = location.state?.role || "the position";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-rise rounded-lg border-2 border-frame bg-card p-8 text-center shadow-hard">
        <span className="grid size-16 mx-auto place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-10" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-extrabold">Application sent!</h1>
        <p className="mt-2 text-muted-foreground">
          Your application for <span className="font-semibold text-foreground">{role}</span> has been received.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          The employer will review your profile and reach out directly if there is a match.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link to="/opportunities" className={btn("primary")}>
            Explore more roles <ArrowRight className="size-4" />
          </Link>
          <Link to="/" className={btn("outline")}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ApplicationSuccessPage;
