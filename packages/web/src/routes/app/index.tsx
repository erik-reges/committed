import { CreateHabitModal } from "@/components/habits/create-habit-modal";
import HabitCard from "@/components/habits/habit-card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getSession, useSession } from "@/lib/auth";
import { sessionStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { redirect, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { addDays, format, subDays } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCcw,
  LayoutGrid,
  List,
  CalendarIcon,
  Badge,
  CheckCircle2,
  Circle,
  Flame,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
  loader: async ({ context: { api } }) => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/signin", search: { email: undefined } });
    }

    const res = await api.habits.all.get();
    return {
      session: session,
      data: res.data,
    };
  },
});

function RouteComponent() {
  const { data: sesh, isPending } = useSession();
  const { session, data } = Route.useLoaderData();

  const { api, qc } = Route.useRouteContext();
  const { data: habits } = useQuery({
    queryKey: ["all"],
    queryFn: async () => {
      const res = await api.habits.all.get();
      return res?.data ?? [];
    },
    initialData: data,
    staleTime: 1000 * 60 * 5,
  });

  const navigate = useNavigate({ from: Route.fullPath });
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const navigateDate = (direction: "forward" | "backward") => {
    const newDate =
      direction === "forward" ? addDays(date, 1) : subDays(date, 1);
    setDate(newDate);
  };
  if (!sesh && !isPending)
    navigate({
      to: "/signin",
      search: {
        email: undefined,
      },
    });

  return (
    <div className=" block px-6 h-[79vh]  flex-col overflow-y-auto justify-center mt-[4.5rem]">
      <div className="flex justify-between fixed top-16 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-row gap-4  ">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate("backward")}
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "md justify-start text-left font-normal w-[200px]",
                    !date && "text-muted-foreground",
                    "max-md:w-auto max-md:px-2",
                  )}
                  size="default"
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span className="max-md:hidden ">
                    {date ? format(date, "PPP") : "Pick a date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(date)}
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDate(newDate);
                      setOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            className="mr-8 md:mr-16  "
            variant="outline"
            size="icon"
            onClick={() => navigateDate("forward")}
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <CreateHabitModal
            onSubmit={async (data) => {
              await api.habits.post(data);
              qc.invalidateQueries({ queryKey: ["all"] });
            }}
          />
        </div>
      </div>

      <div className="space-y-6 mt-1 w-full max-w-2xl mx-auto ">
        {habits &&
          habits.map((habit) => {
            const currentStreak = calculateStreak(habit.entries, habit.id);
            const completedToday = getCompletedToday(habit.entries);

            // return (
            //   <HabitCard
            //     habit={habit}
            //     currentStreak={currentStreak}
            //     completedToday={completedToday}
            //   />
            // );

            return (
              <Card
                key={habit.id}
                className={`transition-all duration-200 ${
                  completedToday ? "border-green-500/20 bg-green-500/5" : ""
                } hover:shadow-md`}
              >
                <CardContent className="w-[300px] md:w-[400px] gap-16 text-sm flex items-center justify-between p-2 px-4">
                  <div className="flex items-center gap-3">
                    {completedToday ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="pr-6 flex flex-row md:flex-col text-center justify-center items-center gap-2">
                    <h3 className="font-medium">{habit.name}</h3>
                    <p className="text-muted-foreground text-xs md:mt-1">
                      {habit.targetFrequency}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {currentStreak > 0 ? (
                      <Badge
                        className={`flex items-center gap-1 ${
                          currentStreak >= 7
                            ? "bg-orange-500/15 text-orange-500"
                            : ""
                        }`}
                      >
                        <span className="pt-1 pr-1">
                          {currentStreak} {currentStreak === 1 ? "day" : "days"}
                        </span>
                        <Flame
                          className={`h-3 w-3 ${currentStreak >= 7 ? "text-orange-500" : "text-muted-foreground"}`}
                        />
                      </Badge>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <span className="pt-0.5 pr-1">0</span>
                        <Flame className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

function isToday(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function getCompletedToday(entries: { date: string; status: string }[]) {
  return entries.some(
    (entry) => isToday(entry.date) && entry.status === "completed",
  );
}

const calculateStreak = (
  entries: {
    date: string;
    status: string;
    habitId: string;
  }[],
  habitId: string,
) => {
  const sortedEntries = entries
    .filter((e) => e.habitId === habitId && e.status === "completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  let currentDate = new Date();

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    if (entryDate.toDateString() === currentDate.toDateString()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
