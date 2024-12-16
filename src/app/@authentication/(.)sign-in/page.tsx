"use client";

import React from "react";
import { SignInForm } from "../../(auth)/_components/sign-in-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

import Link from "next/link";
import { useRouter } from "next/navigation";

const AuthInterceptSignIn = () => {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.back();
        }
      }}
    >
      <DialogContent>
        <DialogTitle>Login</DialogTitle>
        <SignInForm />
        <Button>
          <Link href={"/"}>Navigate to Home</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AuthInterceptSignIn;
