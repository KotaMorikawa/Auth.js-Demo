"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { newVerification } from "../../../actions/email/verification-email";
import FormError from "@/components/form-error";
import { Spinner } from "@/components/spinner";
import { FormSuccess } from "@/components/form-success";

const NewVerificationFormLogic = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError("トークンが見つかりませんでした。");
      return;
    }

    const result = await newVerification(token);
    if (!result.isSuccess) {
      setError(result.error.message);
      return;
    }

    setSuccess(result.message);

    setTimeout(() => {
      router.push("/sign-in");
    }, 3000);
  }, [success, error, token, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex items-center w-full justify-center">
      {!success && !error && <Spinner size={"lg"} />}
      <FormSuccess message={success} />
      {!success && <FormError message={error} />}
    </div>
  );
};

const NewVerificationForm = () => {
  return (
    <Suspense>
      <NewVerificationFormLogic />
    </Suspense>
  );
};

export default NewVerificationForm;
