import { renderHook } from "@testing-library/react-hooks";

// To Test
import { useUpdateEffect } from ".";

describe("useUpdateEffect", () => {
  it("Should not call the callback on the initial render", () => {
    const callback = jest.fn();
    renderHook(() => useUpdateEffect(callback, []));

    expect(callback).not.toHaveBeenCalled();
  });

  it("Should call the callback when dependencies change", () => {
    const callback = jest.fn();
    const { rerender } = renderHook(
      ({ dependencies }) => useUpdateEffect(callback, dependencies),
      {
        initialProps: { dependencies: [1] }, // Initial dependencies
      }
    );

    expect(callback).not.toHaveBeenCalled();

    // Rerender with new dependencies
    rerender({ dependencies: [2] });

    expect(callback).toHaveBeenCalled();
  });

  it("Should not call the callback when dependencies do not change", () => {
    const callback = jest.fn();
    const { rerender } = renderHook(
      ({ dependencies }) => useUpdateEffect(callback, dependencies),
      {
        initialProps: { dependencies: [1] }, // Initial dependencies
      }
    );

    expect(callback).not.toHaveBeenCalled();

    // Rerender with the same dependencies
    rerender({ dependencies: [1] });

    expect(callback).not.toHaveBeenCalled();
  });

  it("Should not call the callback when there are no dependencies", () => {
    const callback = jest.fn();
    const { rerender } = renderHook(() => useUpdateEffect(callback, []));

    expect(callback).not.toHaveBeenCalled();

    // Rerender with no dependencies
    rerender();

    expect(callback).not.toHaveBeenCalled();
  });
});
