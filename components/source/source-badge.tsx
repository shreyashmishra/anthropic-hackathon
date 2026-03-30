import { Badge } from "@/components/ui/badge";
import { SOURCE_TYPES } from "@/lib/constants";
import { Landmark, Youtube, Building2, User } from "lucide-react";

const iconMap = {
  Landmark,
  Youtube,
  Building2,
  User,
};

export function SourceBadge({ sourceType }: { sourceType: string }) {
  const source = SOURCE_TYPES[sourceType as keyof typeof SOURCE_TYPES];
  if (!source) return null;

  const Icon = iconMap[source.icon as keyof typeof iconMap];

  return (
    <Badge variant="secondary" className={`text-xs gap-1 ${source.color}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {source.label}
    </Badge>
  );
}
