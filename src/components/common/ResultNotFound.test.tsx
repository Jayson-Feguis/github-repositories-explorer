import { render, screen } from "@testing-library/react";
// import user from "@testing-library/user-event";

// To Test
import { ResultNotFound } from "..";

// Tests
describe("Result Not Found Component", () => {
  it("Should initialize values correctly", async () => {
    // Setup
    render(<ResultNotFound text="This is test" />);
    const component = screen.getByTestId("This is test");

    expect(component.innerHTML).toBe("This is test");
    expect(component.innerHTML).not.toBe("This is test1");
  });
});
