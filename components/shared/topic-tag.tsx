import { Badge } from "@/components/ui/badge";
import { TOPICS } from "@/lib/constants";

export function TopicTag({ topicId }: { topicId: string }) {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) return null;

  return (
    <Badge variant="secondary" className={`text-xs ${topic.color}`}>
      {topic.label}
    </Badge>
  );
}
