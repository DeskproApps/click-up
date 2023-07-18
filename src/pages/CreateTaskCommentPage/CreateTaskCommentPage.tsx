import { useState, useCallback } from "react";
import get from "lodash/get";
import size from "lodash/size";
import isEmpty from "lodash/isEmpty";
import { useParams, useNavigate } from "react-router-dom";
import { useSetTitle, useAsyncError } from "../../hooks";
import { createTaskCommentService, createTaskAttachmentService } from "../../services/clickUp";
import { CreateTaskComment } from "../../components";
import {
  getValues,
  getAttachments,
  getAttachFormData,
} from "../../components/TaskCommentForm";
import {
  useDeskproElements,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import type { FC } from "react";
import type { Maybe } from "../../types";
import type { FormValidationSchema } from "../../components/TaskCommentForm";

const CreateTaskCommentPage: FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { client } = useDeskproAppClient();
  const { asyncErrorHandler } = useAsyncError();
  const [error, setError] = useState<Maybe<string|string[]>>(null);

  const onCancel = useCallback(() => {
    navigate(`/view/${taskId}`);
  }, [navigate, taskId]);

  const onSubmit = useCallback((data: FormValidationSchema) => {
    if (!client || !taskId) {
      return Promise.resolve();
    }

    const values = getValues(data);
    const attachments = getAttachments(data);

    setError(null);

    return Promise.all([
      !isEmpty(values.comment_text) ? createTaskCommentService(client, taskId, values) : Promise.resolve(),
      ...(!size(attachments) ? [Promise.resolve()] : attachments.map(({ file }) => {
        return createTaskAttachmentService(client, taskId, getAttachFormData(file))
      }))
    ])
      .then(() => navigate(`/view/${taskId}`))
      .catch((err) => {
        const error = get(err, ["data", "err"]);

        if (error) {
          setError(error);
        } else {
          asyncErrorHandler(err);
        }
      })
  }, [client, taskId, navigate, asyncErrorHandler]);

  useSetTitle("Comment");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();

    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  return (
    <CreateTaskComment
      error={error}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  );
};

export { CreateTaskCommentPage };
