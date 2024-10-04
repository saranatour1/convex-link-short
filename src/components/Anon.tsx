"use client";;
import { useQuery } from "convex/react";
import { Fragment, ReactNode, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavBar } from "./NavBar";

export const Anon = ({ children }: { children: ReactNode }) => {
  const user = useQuery(api.users.viewer);
  const { signIn } = useAuthActions();

  useEffect(() => {
    console.log(user);
    if (!user && user === null) {
      void signIn("anonymous", { redirectTo: "/" });
    }
  }, [user]);

  return (
    <Fragment>
      <NavBar />
      {children}
    </Fragment>
  );
};