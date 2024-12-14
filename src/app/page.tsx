import { Button } from "@/components/ui/button";
import { auth, signOut } from "../../auth";
import UpdateProfileSheet from "@/components/update-profile-sheet";

const MyAccountPage = async () => {
  const session = await auth();
  console.table(session);

  return (
    <div>
      <UpdateProfileSheet />
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button variant={"ghost"} type="submit">
          Sign Out
        </Button>
      </form>
    </div>
  );
};

export default MyAccountPage;
