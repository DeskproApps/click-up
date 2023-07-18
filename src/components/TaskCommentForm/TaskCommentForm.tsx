import has from "lodash/has";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@deskpro/deskpro-ui";
import { getInitValues, validationSchema } from "./utils";
import { Button, Label, TextArea, ErrorBlock, Attach } from "../common";
import type { FC } from "react";
import type { Props } from "./types";
import type { FormValidationSchema } from "./types";

const TaskCommentForm: FC<Props> = ({ error, onSubmit, onCancel }) => {
  const {
    watch,
    trigger,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValidationSchema>({
    mode: "all",
    defaultValues: getInitValues(),
    resolver: zodResolver(validationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <ErrorBlock text={error}/>}

      <Label htmlFor="comment" label="New comment">
        <TextArea
          variant="inline"
          id="comment"
          minHeight="auto"
          placeholder="Enter comment"
          value={watch("comment")}
          error={has(errors, ["comment", "message"])}
          {...register("comment")}
        />
      </Label>

      <Label htmlFor="attachments" label="Attachments">
        <Attach
          id="attachments"
          onFiles={(files) => {
            setValue("attachments", files);
            trigger();
          }}
        />
      </Label>

      <Stack justify="space-between">
        <Button
          type="submit"
          text="Add"
          disabled={isSubmitting || !isValid}
          loading={isSubmitting}
        />
        <Button
          type="button"
          text="Cancel"
          intent="tertiary"
          onClick={onCancel}
        />
      </Stack>
    </form>
  );
};

export { TaskCommentForm };
