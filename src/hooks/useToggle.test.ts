import { renderHook, act } from "@testing-library/react-hooks";

// To Test
import { useToggle } from ".";

// Tests
describe("useToggle Hook", () => {
  it("Should initialize values correctly", () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current.open).toEqual(false);
  });

  it("Should change open to true if toggle is called and vice versa if toggle is called again", async () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current.open).toEqual(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.open).toEqual(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.open).toEqual(false);
  });

  it("Should change open to false if onClose is called", async () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current.open).toEqual(false);

    act(() => {
      result.current.onClose();
    });

    expect(result.current.open).toEqual(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.open).toEqual(true);

    act(() => {
      result.current.onClose();
    });

    expect(result.current.open).toEqual(false);
  });
});
