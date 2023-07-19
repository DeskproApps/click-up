import { z } from "zod";
import { validationSchema } from "./utils";
import type { SubmitHandler } from "react-hook-form";
import type { Maybe } from "../../types";
import type { AttachmentFile } from "../common/Attach";

export type FormValidationSchema = z.infer<typeof validationSchema> & {
  attachments: AttachmentFile[],
};

export type CommentValues = {
  comment_text: string,
};

export type Props = {
  onSubmit: SubmitHandler<FormValidationSchema>,
  onCancel?: () => void,
  error?: Maybe<string|string[]>,
};
