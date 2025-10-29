import { Spinner } from "@/components/ui/shadcn-io/spinner";

export const LoadingSpinner = ({
  text = "Loading...",
}: { text?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[80vh] w-full text-center">
    <Spinner
      variant="ring"
      className="w-16 h-16 text-primary animate-spin-slow mb-4"
    />
    <p className="text-base md:text-lg font-medium text-muted-foreground">
      {text}
    </p>
  </div>
);
