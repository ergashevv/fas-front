import { Badge } from "@/components/ui/badge";

interface BadgeDotProps {
  text: string;
  icon?: string;
  variant?: "default" | "secondary" | "outline";
}

export const BadgeDot = ({
  text,
  icon,
  variant = "default",
}: BadgeDotProps) => (
  <Badge variant={variant} className="rounded-full">
    {icon && <span className="mr-1">{icon}</span>}
    {text}
  </Badge>
);
