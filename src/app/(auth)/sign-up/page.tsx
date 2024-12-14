import Link from "next/link";
import { SignUpForm } from "../_components/sign-up-form";
import { buttonVariants } from "@/components/ui/button";

const SignUpPage = () => {
  return (
    <div>
      <SignUpForm />
      <Link
        href={"/sign-in"}
        className={buttonVariants({
          variant: "link",
          size: "sm",
          className: "mt-4",
        })}
      >
        ログインはこちら
      </Link>
    </div>
  );
};

export default SignUpPage;
