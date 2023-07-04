import * as React from "react";
import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from "../Search";
import { render } from "../../../../../testing";

describe("Search", () => {
  test("render", async () => {
    const { container } = render(<Search />, { wrappers: { theme: true } });

    const input = container.querySelector("input#search");
    expect(input).toBeInTheDocument();
  });

  test("should called onChange", async () => {
    const onChange = jest.fn();
    const { container } = render(<Search onChange={onChange}/>, { wrappers: { theme: true } });

    const input = container.querySelector("input#search");
    expect(input).toBeInTheDocument();
    await userEvent.type(input as Element, "search entity");
    expect(onChange).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });
});
