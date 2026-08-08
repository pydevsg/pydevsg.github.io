import { cn } from "@/lib/cn";

/** The one horizontal rhythm the whole site (and the gridline overlay) obeys. */
export function Container({
  children,
  className,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return (
    <As className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14", className)}>
      {children}
    </As>
  );
}
