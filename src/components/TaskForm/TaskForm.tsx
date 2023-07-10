import has from "lodash/has";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Stack } from "@deskpro/deskpro-ui";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useFormDeps } from "./hooks";
import {
  getInitValues,
  validationSchema,
} from "./utils";
import {
  Label,
  Select,
  Button,
  TextArea,
  DateInput,
  ErrorBlock,
} from "../common";
import type { FC } from "react";
import type { Workspace, Space, List, Status, User } from "../../services/clickUp/types";
import type { Props, FormValidationSchema } from "./types";

const TaskForm: FC<Props> = ({ onSubmit, onCancel, isEditMode, error }) => {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValidationSchema>({
    defaultValues: getInitValues(),
    resolver: zodResolver(validationSchema),
  });
  const {
    isLoading,
    tagOptions,
    listOptions,
    userOptions,
    spaceOptions,
    statusOptions,
    workspaceOptions,
  } = useFormDeps(watch("workspace"), watch("space"));

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <ErrorBlock text={error}/>}

      <Label htmlFor="workspace" label="Workspace" required>
        <Select<Workspace["id"]>
          id="workspace"
          value={watch("workspace")}
          options={workspaceOptions}
          onChange={({ value }) => {
            setValue("workspace", value);
            setValue("space", "");
            setValue("list", "");
          }}
          error={has(errors, ["workspace", "message"])}
        />
      </Label>

      <Label htmlFor="space" label="Space" required>
        <Select<Space["id"]>
          id="space"
          value={watch("space")}
          options={spaceOptions}
          onChange={({ value }) => {
            setValue("space", value);
            setValue("list", "");
          }}
          error={has(errors, ["space", "message"])}
        />
      </Label>

      <Label htmlFor="list" label="List" required>
        <Select<List["id"]>
          id="folder"
          value={watch("list")}
          options={listOptions}
          onChange={({ value }) => {
            setValue("list", value);
          }}
          error={has(errors, ["list", "message"])}
        />
      </Label>

      <Label htmlFor="name" label="Task name" required>
        <Input
          id="name"
          type="text"
          variant="inline"
          inputsize="small"
          placeholder="Add value"
          error={has(errors, ["name", "message"])}
          value={watch("name")}
          {...register("name")}
        />
      </Label>

      <Label htmlFor="description" label="Description">
        <TextArea
          variant="inline"
          id="description"
          minHeight="auto"
          placeholder="Enter value"
          value={watch("description")}
          error={has(errors, ["description", "message"])}
          {...register("description")}
        />
      </Label>

      <Label htmlFor="status" label="Status">
        <Select<Status["id"]>
          id="status"
          value={watch("status")}
          options={statusOptions}
          onChange={({ value }) => {
            setValue("status", value);
          }}
          error={has(errors, ["status", "message"])}
        />
      </Label>

      <Label htmlFor="assignee" label="Assignee">
        <Select<User["id"]>
          id="assignee"
          value={watch("assignee")}
          showInternalSearch
          options={userOptions}
          error={has(errors, ["assignee", "message"])}
          onChange={(option) => setValue("assignee", option.value)}
        />
      </Label>

      <Label htmlFor="dueDate" label="Due date">
        <DateInput
          id="dueDate"
          placeholder="DD/MM/YYYY"
          value={watch("dueDate") as Date}
          error={has(errors, ["dueDate", "message"])}
          onChange={(date) => setValue("dueDate", date[0])}
        />
      </Label>

      <Label htmlFor="tags" label="Tags">
        <Select
          id="tags"
          value={watch("tags")}
          showInternalSearch
          options={tagOptions}
          error={has(errors, ["tags", "message"])}
          closeOnSelect={false}
          onChange={(o) => {
            const tags = watch("tags");

            if (o.value) {
              const selectedTags = Array.isArray(tags) ? tags : [];
              const newValue = selectedTags.includes(o.value)
                ? selectedTags.filter((tag) => tag !== o.value)
                : [...selectedTags, o.value];

              setValue("tags", newValue);
            }
          }}
        />
      </Label>

      <Stack justify="space-between">
        <Button
          type="submit"
          text={isEditMode ? "Save" : "Create"}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
        {isEditMode && onCancel && (
          <Button type="button" text="Cancel" intent="tertiary" onClick={onCancel}/>
        )}
      </Stack>
    </form>
  );
};

export { TaskForm };
