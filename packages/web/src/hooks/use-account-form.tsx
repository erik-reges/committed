import { useForm } from "react-hook-form";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { useSession } from "@/lib/auth";
import { Type } from "@sinclair/typebox";
import { sessionStore } from "@/lib/store";

interface UseAccountFormsProps {
  onPasswordSubmit: (data: PasswordFormValues) => Promise<void>;
  onProfileSubmit: (data: ProfileFormValues) => Promise<void>;
}

export const passwordSchema = Type.Object(
  {
    currentPassword: Type.String({ minLength: 8 }),
    newPassword: Type.String({ minLength: 8 }),
    confirmPassword: Type.String({ minLength: 8 }),
  },
  {
    additionalProperties: false,
  },
);

export const profileSchema = Type.Object(
  {
    name: Type.String({ minLength: 2 }),
    phone: Type.Optional(Type.String()),
  },
  {
    additionalProperties: false,
  },
);

export type PasswordFormValues = typeof passwordSchema.static;
export type ProfileFormValues = typeof profileSchema.static;

export function useAccountForms({
  onPasswordSubmit,
  onProfileSubmit,
}: UseAccountFormsProps) {
  const { user } = sessionStore.getState();
  const passwordForm = useForm<PasswordFormValues>({
    resolver: typeboxResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: typeboxResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  return {
    passwordForm,
    profileForm,
    handlePasswordSubmit: passwordForm.handleSubmit(onPasswordSubmit),
    handleProfileSubmit: profileForm.handleSubmit(onProfileSubmit),
  };
}
