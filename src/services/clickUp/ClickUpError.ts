import type { ClickUpAPIError } from "./types";

export type InitData = {
  status: number,
  data: ClickUpAPIError,
};

class ClickUpError extends Error {
  status: number;
  data: ClickUpAPIError;

  constructor({ status, data }: InitData) {
    const message = "Asana Api Error";
    super(message);

    this.data = data;
    this.status = status;
  }
}

export { ClickUpError };
