import { renderHook, act } from "@testing-library/react-hooks";

// To Test
import { useSelected } from ".";

// Tests
describe("useSelected Hook", () => {
  it("Should initialize with the default value", () => {
    const defaultValue = "default";
    const { result } = renderHook(() => useSelected(defaultValue));

    expect(result.current.selected).toBe(defaultValue);
  });

  it("Should update the selected value when onSelect is called", () => {
    const { result } = renderHook(() => useSelected("default"));

    act(() => {
      result.current.onSelect("newSelectedValue");
    });

    expect(result.current.selected).toBe("newSelectedValue");
  });

  it("Should not re-create onSelect function on re-renders", () => {
    const { result, rerender } = renderHook(() => useSelected("default"));

    const initialOnSelect = result.current.onSelect;

    rerender(); // Re-rendering should not recreate the onSelect function

    expect(result.current.onSelect).toBe(initialOnSelect);
  });
});
