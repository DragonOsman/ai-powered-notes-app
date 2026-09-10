"use client";

import { useRouter } from "next/navigation";
import {
  Formik,
  Form,
  Field,
  FormikHelpers,
} from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { toast } from "sonner";

import { useNotes, type INote } from "@/context/NotesContext";
import { noteSchema } from "@/lib/schemas/note";

interface AddNewNoteFormValues {
  title: string;
  content: string;
}

export default function AddNewNote() {
  const router = useRouter();

  const { createNewNote } = useNotes();

  const initialValues: AddNewNoteFormValues = {
    title: "",
    content: "",
  };

  const handleSubmit = async (
    values: AddNewNoteFormValues,
    helpers: FormikHelpers<AddNewNoteFormValues>
  ) => {
    try {
      const note = await createNewNote({
        title: values.title.trim(),
        content: values.content,
      });

      toast.success("Note created successfully.");

      router.push(`/notes/${note.id}`);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create note."
      );
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl rounded-xl border p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          New Note
        </h1>

        <p className="mt-1 text-sm text-app-muted">
          Create a new note.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(noteSchema)}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          touched,
          isSubmitting,
        }) => (
          <Form className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium"
              >
                Title
              </label>

              <Field
                id="title"
                name="title"
                type="text"
                placeholder="Enter a title"
                autoComplete="off"
                className="w-full rounded-lg border border-app bg-transparent p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.title && touched.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="content"
                className="mb-1 block text-sm font-medium"
              >
                Content
              </label>

              <Field
                as="textarea"
                id="content"
                name="content"
                rows={16}
                placeholder="Write your note..."
                className="w-full resize-y rounded-lg border border-app bg-transparent p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              {errors.content && touched.content && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.content}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="rounded-lg border border-app px-4 py-2 hover:bg-app-muted/10 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create Note"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
