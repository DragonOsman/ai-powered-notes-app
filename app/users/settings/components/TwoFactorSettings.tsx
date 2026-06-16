"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import QRCode from "react-qr-code";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validators";

interface TwoFactorSettingsProps {
  enabled: boolean;
}

interface EnableFormValues {
  password: string;
}

interface VerifyFormValues {
  code: string;
}

export default function TwoFactorSettings({
  enabled,
}: TwoFactorSettingsProps) {
  const router = useRouter();

  const [totpUri, setTotpUri] =
    useState<string | null>(null);

  const [backupCodes, setBackupCodes] =
    useState<string[]>([]);

  const [setupPending, setSetupPending] =
    useState(false);

  const handleEnable = async (
    values: EnableFormValues,
    helpers: FormikHelpers<EnableFormValues>
  ) => {
    try {
      if (enabled) {
        const { error } =
          await authClient.twoFactor.disable({
            password: values.password,
          });

        if (error) {
          throw new Error(error.message);
        }

        toast.success(
          "Two-factor authentication disabled."
        );

        helpers.resetForm();
        router.refresh();

        return;
      }

      const { data, error } =
        await authClient.twoFactor.enable({
          password: values.password,
        });

      if (error) {
        throw new Error(error.message);
      }

      setTotpUri(data.totpURI);
      setBackupCodes(data.backupCodes);
      setSetupPending(true);

      toast.success(
        "Scan the QR code and enter the generated code."
      );

      helpers.resetForm();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to configure 2FA."
      );
    }
  };

  const handleVerify = async (
    values: VerifyFormValues,
    helpers: FormikHelpers<VerifyFormValues>
  ) => {
    try {
      const { error } =
        await authClient.twoFactor.verifyTotp({
          code: values.code,
          trustDevice: true,
        });

      if (error) {
        throw new Error(error.message);
      }

      toast.success(
        "Two-factor authentication enabled successfully."
      );

      setSetupPending(false);
      setTotpUri(null);

      helpers.resetForm();

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Invalid verification code."
      );
    }
  };

  return (
    <section className="rounded-xl border p-6 space-y-6">
      <div>
        <h2 className="mb-2 text-lg font-semibold">
          Two-Factor Authentication
        </h2>

        <p>
          Status:{" "}
          {enabled ? "Enabled" : "Disabled"}
        </p>
      </div>

      {!setupPending && (
        <Formik
          initialValues={{
            password: "",
          }}
          validationSchema={toFormikValidationSchema(
            passwordSchema
          )}
          onSubmit={handleEnable}
        >
          {({
            errors,
            touched,
            isSubmitting,
          }) => (
            <Form className="space-y-3">
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium"
                >
                  Confirm your password
                </label>

                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded border border-app p-2"
                />

                {errors.password &&
                  touched.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {enabled
                  ? "Disable 2FA"
                  : "Enable 2FA"}
              </button>
            </Form>
          )}
        </Formik>
      )}

      {setupPending &&
        totpUri && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">
                Step 1: Scan QR Code
              </h3>

              <div className="inline-block rounded bg-white p-4">
                <QRCode value={totpUri} />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Step 2: Save Backup Codes
              </h3>

              <p className="mb-3 text-sm">
                Store these somewhere safe.
                Each code can usually be used
                once if you lose access to
                your authenticator app.
              </p>

              <div className="rounded border p-3 font-mono text-sm">
                {backupCodes.map((code) => (
                  <div key={code}>
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">
                Step 3: Verify
              </h3>

              <Formik
                initialValues={{
                  code: "",
                }}
                onSubmit={handleVerify}
              >
                {({
                  isSubmitting,
                }) => (
                  <Form className="space-y-3">
                    <div>
                      <label
                        htmlFor="code"
                        className="block mb-1 text-sm font-medium"
                      >
                        Authentication Code
                      </label>

                      <Field
                        id="code"
                        name="code"
                        placeholder="123456"
                        className="w-full rounded border border-app p-2"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isSubmitting
                      }
                      className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Verify & Finish Setup
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
    </section>
  );
}