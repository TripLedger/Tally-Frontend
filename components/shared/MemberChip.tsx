import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface MemberChipProps {
  name: string;
  image?: string;
  role?: "organizer" | "member";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MemberChip({
  name,
  image,
  role,
  selected = false,
  onClick,
  className,
}: MemberChipProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5",
        "transition-all duration-fast ease-tally",
        selected
          ? "border-accent-violet/50 bg-accent-violet/10"
          : "border-border-glass bg-background-elevated",
        onClick && "cursor-pointer hover:border-accent-violet/30",
        className
      )}
    >
      <Avatar name={name} src={image} size="sm" />
      <span className="text-sm font-medium text-text-primary">{name}</span>
      {role === "organizer" && (
        <Badge variant="violet" className="ml-0.5">
          Organizer
        </Badge>
      )}
    </Component>
  );
}
