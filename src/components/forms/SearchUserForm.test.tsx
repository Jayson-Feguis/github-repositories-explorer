import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// To Test
import { SearchUserForm } from "..";

// Setup
const setup = (isLoading: boolean, onSubmit: any = jest.fn()) => {
  const utils = render(
    <SearchUserForm isLoading={isLoading} onSubmit={onSubmit} />
  );
  const form = screen.getByTestId("search-user-form");
  const input = screen.getByTestId<HTMLInputElement>("search-input");
  const button = screen.getByTestId("search-btn");
  return {
    form,
    input,
    button,
    ...utils,
  };
};

// Tests
describe("Search User Form Component", () => {
  it("renders the form with input and button", () => {
    const { form, input, button } = setup(false);

    expect(form).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("Calls onSubmit when form is submitted", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { input, button } = setup(false, onSubmit);

    fireEvent.change(input, { target: { value: "example" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.anything(), "example");
    });
  });

  it("Disables the button when isLoading is true", () => {
    const { button } = setup(true);

    expect(button).toBeDisabled();
  });

  it("Disables the button when the input is empty", () => {
    const { button } = setup(false);

    expect(button).toBeDisabled();
  });

  it("Clears the input when the clear button is clicked", async () => {
    const { input } = setup(true);

    await waitFor(() => {
      fireEvent.change(input, { target: { value: "example" } });
    });

    const clearButton = screen.getByTestId("search-clear-btn");

    expect(clearButton).toBeInTheDocument();
    expect(input.value).toEqual("example");

    fireEvent.click(clearButton);

    expect(input.value).toEqual("");
  });
});
