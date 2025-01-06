import { createFileRoute, redirect, useSearch } from "@tanstack/react-router";
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
import { signOut, signUp, useSession } from "@/lib/auth";
import type { Static } from "@sinclair/typebox";
import { Type as t } from "@sinclair/typebox";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

export const Route = createFileRoute("/signup")({
  component: SignUp,
});

const SignUpSchema = t.Object({
  email: t.String({
    format: "email",
    error: "Invalid email address",
    description: "Enter your email address",
  }),
  password: t.String({
    minLength: 4,
    error: "Password must be at least 4 characters",
    description: "Enter your password (minimum 4 characters)",
  }),
});

type SignUpFormData = Static<typeof SignUpSchema>;

export function SignUp({}) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data } = useSession();

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
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        await signOut();

        const { error } = await signUp.email({
          email: data.email,
          password: data.password,
          name: data.email.split("@")[0],
        });

        if (error) {
          setError(error.message || "An error occurred during sign in");
          setIsSubmitting(false);
          return;
        }
        reset();

        // Navigate to signin with email
        navigate({
          to: "/signin",
          search: {
            email: data.email,
          },
        });
      } catch (err) {
        console.error("Registration error:", err);
      }
    },
    [signUp, navigate, reset],
  );

  return (
    <div className="w-80 pb-20 flex justify-center items-center bg-none">
      <Card className="border-none bg-none  shadow-none  max-w-sm w-full ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your email and password to sign up
          </CardDescription>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
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
                  <span>Signing up...</span>
                </>
              ) : (
                <span>Sign up</span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal text-muted-foreground hover:text-primary-foreground"
              >
                Sign in
              </Button>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
