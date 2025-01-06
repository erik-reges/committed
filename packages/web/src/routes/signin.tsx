import { Type } from "@sinclair/typebox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "@/lib/auth";
import type { Static } from "@sinclair/typebox";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { sessionStore } from "@/lib/store";

const SignInSchema = Type.Object({
  email: Type.String({
    format: "email",
    error: "Invalid email address",
    description: "Enter your email address",
  }),
  password: Type.String({
    minLength: 1,
    error: "Password is required",
    description: "Enter your password",
  }),
});

type SignInFormData = Static<typeof SignInSchema>;

type SearchParams = {
  email?: string;
};

export const Route = createFileRoute("/signin")({
  validateSearch: (search?: SearchParams) => {
    const email = typeof search?.email === "string" ? search?.email : undefined;
    return { email };
  },
  component: SignIn,
});

export function SignIn({}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data } = useSession();

  const { email } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.session) {
      navigate({
        to: "/app",
      });
    }
  }, [data, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    defaultValues: {
      email: email || "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (formData: SignInFormData) => {
      setIsSubmitting(true);
      try {
        const { error, data } = await signIn.email({
          email: formData.email,
          password: formData.password,
          rememberMe: true,
        });

        if (error) {
          setError(error.message || "An error occurred during sign in");
          setIsSubmitting(false);
          return;
        }

        setIsSubmitting(false);

        navigate({
          to: "/app",
        });
      } catch (err) {
        console.error("Login error:", err);
      }
    },
    [navigate, reset],
  );

  return (
    <div className=" w-80 pb-20  justify-center items-center">
      <Card className="bg-none  shadow-none  border-none max-w-sm w-full">
        <CardHeader className="">
          <CardTitle className="text-2xl font-bold">Log in</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password">
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-sm font-normal text-muted-foreground hover:text-primary-foreground"
                  >
                    Forgot password?
                  </Button>
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal text-muted-foreground hover:text-primary-foreground"
              >
                Sign up
              </Button>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
