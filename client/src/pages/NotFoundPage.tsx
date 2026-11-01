import { Link } from "react-router-dom";
import { btn } from "@/components/brand";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-extrabold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-bold">This page isn't hiring</h2>
        <p className="mt-2 text-sm text-muted-foreground">It doesn't exist or has been moved.</p>
        <Link to="/" className={`${btn("primary")} mt-6`}>
          Go home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
