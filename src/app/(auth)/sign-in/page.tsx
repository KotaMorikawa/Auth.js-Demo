import React from "react";
import { SignInForm } from "../_components/sign-in-form";
import { Separator } from "@/components/ui/separator";
import { SocialButtons } from "../_components/social-buttons";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const page = () => {
  return (
    <div>
      <SignInForm />
      <Separator className="my-4" />
      <SocialButtons />
      <Link
        href={"/sign-up"}
        className={buttonVariants({
          variant: "link",
          size: "sm",
          className: "mt-4",
        })}
      >
        新規登録はこちら
      </Link>
    </div>
  );
};

export default page;
