import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import DigitalTunnel from "@/components/digital-tunnel-bg";
import { format } from "date-fns";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();
  const { data, isPending } = useSession();
  useEffect(() => {
    if (data) {
      navigate({
        to: "/app",
      });
    }
  }, [data, navigate]);
  if (isPending) {
    return <></>;
  }
  return (
    <div className="   md:pb-48 pb-64  font-sans">
      <DigitalTunnel />
      {/* Hero Section */}
      <main className="container mx-auto px-6 gap-10">
        <div className="max-w-2xl flex flex-col">
          <h1 className="mb-6 py-4 md:py-8 text-5xl  md:text-6xl font-bold  md:text-left text-center">
            Make progress
            <br />
            towards a
            <br />
            <div className="underline">
              better
              <span className="rounded-lg bg-secondary pt-0 p-2 px-3 ml-4 inline-flex items-center no-underline">
                you!
              </span>
            </div>
          </h1>
          <p className="px-16 text-center md:p-0 mb-8 text-md md:text-xl text-muted-foreground ">
            Measure, analyze and improve your habits with{" "}
            <span className="font-semibold text-white/90 pb-1">Committed.</span>
          </p>
          <div className="mt-6 flex flex-col w-full items-center justify-center md:block gap-4 ">
            <Link to="/signin" search={{ email: undefined }}>
              <Button className="w-48 bg-[#8257FF] hover:bg-[#724ee3] text-white px-8 py-6 text-lg rounded-lg">
                Get started
                <span className="ml-2">→</span>
              </Button>
            </Link>

            <p className="mt-4 text-sm text-muted-foreground ">
              Start for free. No credit card required.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
