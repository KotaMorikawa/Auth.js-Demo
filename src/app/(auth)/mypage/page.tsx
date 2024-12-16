import UpdateProfileSheet from "@/components/update-profile-sheet";
import { signOut } from "../../../../auth";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div>
      <UpdateProfileSheet />
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  );
};

export default page;
