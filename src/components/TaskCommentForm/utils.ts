import { z } from "zod";
import get from "lodash/get";
import { noEmptyFormValidator } from "./validators";
import type { FormValidationSchema, CommentValues } from "./types";

const validationSchema = z.object({
  comment: z.string(),
  attachments: z.array(z.any()),
})
  .refine(noEmptyFormValidator, {
    message: "Empty form",
    path: ["root"],
  });

const getInitValues = () => ({
  comment: "",
  attachments: [],
});

const getValues = (data: FormValidationSchema): CommentValues => ({
  comment_text: get(data, ["comment"], ""),
});

const getAttachments = (
  data: FormValidationSchema,
): FormValidationSchema["attachments"] => {
  return get(data, ["attachments"], []) || [];
};

const getAttachFormData = (file: File): FormData => {
  const form = new FormData();

  form.append("attachment", file);

  return form;
};

export {
  getValues,
  getInitValues,
  getAttachments,
  validationSchema,
  getAttachFormData,
};
