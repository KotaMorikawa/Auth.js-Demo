import { Button } from "@/components/ui/button";
import { signOut } from "../../auth";

const MyAccountPage = async () => {
  return (
    <div>
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
