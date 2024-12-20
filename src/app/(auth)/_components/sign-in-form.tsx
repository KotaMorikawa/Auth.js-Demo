"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";
import { signInSchema } from "../../../../schemas";
import { signIn } from "../../../../actions/email/sign-in";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const SignInFormLogic = () => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "このメールアドレスはすでに別のプロバイダーで登録されています。"
      : "";

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    setError("");

    startTransition(async () => {
      const result = await signIn(values);

      if (!result.isSuccess) {
        setError(result.error.message);
        return;
      }
      toast.success(result.message);

      if (result.data.isTwoFactorEnabled) {
        setShowTwoFactor(true);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {showTwoFactor && (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP認証</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123456" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!showTwoFactor && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567" {...field} />
                  </FormControl>
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/reset-password">
                      パスワードをお忘れですか？
                    </Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormError message={error || urlError} />
        <Button type="submit" disabled={isPending} size="default">
          ログイン
        </Button>
      </form>
    </Form>
  );
};

export const SignInForm = () => {
  return (
    <Suspense>
      <SignInFormLogic />
    </Suspense>
  );
};
