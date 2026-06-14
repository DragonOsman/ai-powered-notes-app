"use client";

import { authClient } from "@/lib/auth-client";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useState } from "react";
import { signUpSchema } from "@/lib/schemas/auth";
import { FaGoogle, FaGithub, FaEnvelope } from "react-icons/fa";

export default function SignUp() {
  const [customError, setCustomError] = useState<string>("");

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-md bg-white px-6 py-12 rounded-xl shadow-sm">
        <h1 className="text-black">Sign Up</h1>
        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "", name: "" }}
          validationSchema={toFormikValidationSchema(signUpSchema)}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const { error } = await authClient.signUp.email({
              email: values.email,
              password: values.password,
              name: values.name
            });
            setSubmitting(false);

            if (error) {
              console.error(error);
              if (error.message) {
                setCustomError(error.message);
              }
            }
          }}
        >
          {({ handleSubmit, getFieldProps, touched, errors, isSubmitting, values }) => (
            <>
              <Form
                className="Signin flex flex-col gap-4"
                onSubmit={handleSubmit}
                method="post"
              >
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    {...getFieldProps("name")}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {touched.name && errors.name ? (
                    <div className="text-red-500 text-sm">{errors.name}</div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...getFieldProps("email")}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {touched.email && errors.email ? (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...getFieldProps("password")}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {touched.password && errors.password ? (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                  ) : null}
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...getFieldProps("confirmPassword")}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {touched.confirmPassword && errors.confirmPassword ? (
                    <div className="text-red-500 text-sm">{errors.confirmPassword}</div>
                  ) : null}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign Up
                </button>
                {customError !== "" && (
                  <p className="text-red-500 text-sm">{customError}</p>
                )}
              </Form>
              <hr className="divider my-6" />
              <div className="socialSignIn flex flex-col gap-4">
                <button
                  title="Google SignIn"
                  type="button"
                  onClick={() => authClient.signIn.social({
                    provider: "google"
                  })}
                  className="bg-red-600 items-center text-white p-2 rounded hover:bg-red-800"
                >
                  <FaGoogle className="inline-block" /> Sign in with Google
                </button>
                <button
                  title="GitHub SignIn"
                  type="button"
                  onClick={() => authClient.signIn.social({
                    provider: "github"
                  })}
                  className="bg-gray-700 items-center text-white p-2 rounded hover:bg-black-900"
                >
                  <FaGithub className="inline-block" /> Sign in with GitHub
                </button>
                <button
                  title="Email SignIn"
                  type="button"
                  onClick={() => authClient.signIn.magicLink({
                    email: values.email,
                    callbackURL: "/users/profile"
                  })}
                  className="bg-green-700 items-center text-white p-2 rounded hover:bg-black-800"
                >
                  <FaEnvelope className="inline-block" /> Sign in with Email
                </button>
              </div>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}