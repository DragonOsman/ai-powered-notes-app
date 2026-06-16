import { Formik, Form, Field } from "formik";
import {
  changePassword,
  changeEmail,
  deleteAccount,
} from "@/server/actions/user-settings";
import LogoutOnAllDevicesBtn from "./LogoutOnAllDevicesBtn";

import { toast } from "sonner";
import type { User } from "better-auth";

interface ProfileSettingsClientProps {
  user: User;
}

export default function ProfileSettingsClient({ user }: ProfileSettingsClientProps) {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* ACCOUNT INFO */}
      <section className="bg-surface border border-app rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <p className="text-sm text-muted">{user.email}</p>
      </section>

      {/* CHANGE PASSWORD */}
      <section className="bg-surface border border-app rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>

        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            try {
              await changePassword(values);
              toast.success("Password updated successfully");
              resetForm();
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Failed to update password");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <Field
                name="currentPassword"
                type="password"
                placeholder="Current password"
                className="w-full p-2 border border-app rounded"
              />

              <Field
                name="newPassword"
                type="password"
                placeholder="New password"
                className="w-full p-2 border border-app rounded"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-4 py-2 rounded"
              >
                Update Password
              </button>
            </Form>
          )}
        </Formik>
      </section>

      {/* CHANGE EMAIL */}
      <section className="bg-surface border border-app rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Change Email</h2>

        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values, { resetForm }) => {
            try {
              await changeEmail(values);
              toast.success("Verification email sent to new address");
              resetForm();
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Failed to change email");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <Field
                name="email"
                type="email"
                placeholder="New email"
                className="w-full p-2 border border-app rounded"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-4 py-2 rounded"
              >
                Update Email
              </button>
            </Form>
          )}
        </Formik>
      </section>

      {/* DELETE ACCOUNT */}
      <section className="bg-surface border border-red-500 rounded-xl p-6">
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
      </section>
    </div>
  );
}
