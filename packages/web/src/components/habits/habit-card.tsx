import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Flame, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description?: string | null;
    targetFrequency: string;
    entries: any[];
  };
  currentStreak: number;
  completedToday: boolean;
}

export default function HabitCard({
  habit,
  currentStreak,
  completedToday,
}: HabitCardProps) {
  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg ${
        completedToday
          ? "border-green-500/20 bg-gradient-to-r from-green-500/10 to-green-500/5"
          : "hover:bg-accent"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-[40px]">
            {completedToday ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 transition-transform group-hover:scale-110" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground/50 transition-transform group-hover:scale-110" />
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold tracking-tight">{habit.name}</h3>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
            </div>
            {habit.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {habit.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground/75">
              {habit.targetFrequency}
            </p>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 min-w-[60px] justify-end">
                  {currentStreak > 0 ? (
                    <Badge
                      variant="secondary"
                      className={`group-hover:bg-background transition-colors ${
                        currentStreak >= 7
                          ? "bg-orange-500/15 text-orange-500 group-hover:bg-orange-500/20"
                          : ""
                      }`}
                    >
                      <span className="mr-1">{currentStreak}</span>
                      <Flame
                        className={`h-3.5 w-3.5 ${
                          currentStreak >= 7
                            ? "text-orange-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Badge>
                  ) : (
                    <div className="flex items-center justify-center gap-1 px-2 py-0.5 text-muted-foreground/50">
                      <span>0</span>
                      <Flame className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current streak</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
