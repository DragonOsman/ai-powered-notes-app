import { Formik, Form, Field } from "formik";
import { changeEmail } from "@/server/actions/user-settings";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { emailSchema } from "@/lib/validators";
import { toast } from "sonner";
import { error } from "node:console";

export default function ChangeEmailForm() {
  return (
    <>
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
        validationSchema={toFormikValidationSchema(emailSchema)}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-3">
            <fieldset>
              <label htmlFor="email" className="mb-4">New Email</label>
              <Field
                name="email"
                type="email"
                placeholder="New email"
                className="w-full p-2 border border-app rounded"
              />
              {errors.email && touched.email && (
                <p className="mb-2 text-danger">
                  {errors.email}
                </p>
              )}
            </fieldset>

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
    </>
  );
}