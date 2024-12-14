import { cn } from "@/lib/utils";
import { Noto_Sans_JP } from "next/font/google";
import { PropsWithChildren } from "react";

const font = Noto_Sans_JP({ subsets: ["latin"], weight: ["600"] });

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex items-center h-full justify-center w-full flex-col">
      <div className="container p-8 rounded-2xl shadow-md space-y-4 bg-gray-50 max-w-md">
        <h1
          className={cn("text-3xl font-semibold text-center", font.className)}
        >
          🔐 認証入門
        </h1>
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
