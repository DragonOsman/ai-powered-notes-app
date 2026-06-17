import { deleteAccount } from "@/server/actions/user-settings";
import LogoutOnAllDevicesBtn from "./LogoutOnAllDevicesBtn";
import { toast } from "sonner";

export default function DangerZone() {
  return (
    <>
      <h2 className="text-red-500 font-semibold mb-4">
        Danger Zone
      </h2>

      <LogoutOnAllDevicesBtn />
      <button
        onClick={async () => {
          try {
            await deleteAccount();
            toast.success("Account deleted successfully");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete account");
          }
        }}
        className="bg-red-600 text-white px-4 py-2 rounded"
        type="button"
      >
        Delete Account
      </button>
    </>
  );
}