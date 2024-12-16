import CardComponent from "@/components/card";
import { auth } from "../../auth";

const TopPage = async () => {
  const session = await auth();

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center items-center">
        {session ? (
          <>
            <CardComponent
              title="my page"
              description="sign in page"
              url="/mypage"
            />
          </>
        ) : (
          <>
            <CardComponent
              title="sign in"
              description="sign in page"
              url="/sign-in"
            />
            <CardComponent
              title="sign up"
              description="sign up page"
              url="/sign-up"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TopPage;
