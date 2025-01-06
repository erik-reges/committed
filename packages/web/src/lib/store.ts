import { create } from "zustand";
import type { Session, User } from "./auth";

interface SeshState {
  user: User | null;
  session: Session | null;
}

export const sessionStore = create<SeshState>((set) => ({
  user: null,
  session: null,
}));
