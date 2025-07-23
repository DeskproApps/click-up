import { baseRequest } from "./baseRequest";
import { ClickUpError } from "./ClickUpError";
import { Result } from "../../types";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Workspace } from "./types";

export async function getWorkspacesService(client: IDeskproClient): Promise<Result<{ teams: Workspace[] }>> {

  try {
    const data = await baseRequest<{ teams: Workspace[] }>(client, {
      url: "/team",
    })

    return {
      data,
      success: true
    }
  } catch (e) {

    let errorCode = undefined

    if (e instanceof ClickUpError && e.data.err === "Authorization header required") {
      errorCode = "auth-error" as const
    }

    return {
      success: false,
      message: "Error retrieving workspaces",
      errorCode,
      error: e
    }
  }
}