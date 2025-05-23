import Board from "@/components/board";
import { render } from "@testing-library/react";

describe("Board", () => {
  it("should render board with 16 cells", () => {
    const { container } = render(<Board />);
    const cellElements = container.querySelectorAll(".cell");

    expect(cellElements.length).toEqual(15);
  });
});
