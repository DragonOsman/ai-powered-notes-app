"use client";

import { Formik, Field, Form } from "formik";
import { changePassword } from "@/server/actions/user-settings";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { passwordSchema } from "@/lib/validators";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>

      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        }}
        validationSchema={toFormikValidationSchema(passwordSchema)}
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
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-3">
            <fieldset>
              <label htmlFor="currentPassword" className="mb-4">Current Password</label>
              <Field
                name="currentPassword"
                type="password"
                placeholder="Current password"
                className="w-full p-2 border border-app rounded"
              />
              {errors.currentPassword && touched.currentPassword && (
                <p className="text-danger mb-2">
                  {errors.currentPassword}
                </p>
              )}
              <label htmlFor="newPassword" className="mb-4">New Password</label>
              <Field
                name="newPassword"
                type="password"
                placeholder="New password"
                className="w-full p-2 border border-app rounded"
              />
              {errors.newPassword && touched.newPassword && (
                <p className="text-danger mb-2">
                  {errors.newPassword}
                </p>
              )}
              <label htmlFor="confirmNewPassword" className="mb-4">Confirm New Password</label>
              <Field
                name="confirmNewPassword"
                type="password"
                placeholder="Confirm New password"
                className="w-full p-2 border border-app rounded"
              />
              {errors.confirmNewPassword && touched.confirmNewPassword && (
                <p className="text-danger mb-2">
                  {errors.confirmNewPassword}
                </p>
              )}
            </fieldset>

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
    </>
  )
}