import { render, screen, fireEvent } from "@testing-library/react";
import ImagesChoser from "./ImagesChoser";
import React from "react";

// Mock ImagesViewer
jest.mock("./ImagesViewer", () => ({ onClose }: { onClose: () => void }) => (
    <div data-testid="images-viewer">
        <button onClick={onClose}>Close Viewer</button>
    </div>
));

// Mock formatImageUrl
jest.mock("../../utils/formatImageUrl", () => ({
    formatImageUrl: (url: string) => `formatted-${url}`,
}));

describe("ImagesChoser", () => {
    beforeAll(() => {
        global.DataTransfer = class {
            items = {
                add: (file: File) => {
                    const files: any = this.files;
                    files[files.length] = file;
                },
            };
            files = Object.setPrototypeOf([], FileList.prototype);
        } as any;
    });

    it("should render file input correctly", () => {
        const { container } = render(<ImagesChoser images={null} />);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const input = container.querySelector('input[type="file"]');
        expect(input).toBeInTheDocument();
    });

    it("should not render view/delete buttons when no images", () => {
        render(<ImagesChoser images={null} />);
        expect(screen.queryByText("View Images")).not.toBeInTheDocument();
        expect(screen.queryByText("Delete Images")).not.toBeInTheDocument();
    });

    it("should render view/delete buttons when images are present", () => {
        const images = ["test.jpg"];
        render(<ImagesChoser images={images} />);
        expect(screen.getByText("View Images")).toBeInTheDocument();
        expect(screen.getByText("Delete Images")).toBeInTheDocument();
    });

    it("should open ImagesViewer when View Images is clicked", () => {
        const images = ["test.jpg"];
        render(<ImagesChoser images={images} />);

        fireEvent.click(screen.getByText("View Images"));
        expect(screen.getByTestId("images-viewer")).toBeInTheDocument();
    });

    it("should close ImagesViewer when onClose is called", () => {
        const images = ["test.jpg"];
        render(<ImagesChoser images={images} />);

        fireEvent.click(screen.getByText("View Images"));
        expect(screen.getByTestId("images-viewer")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Close Viewer"));
        expect(screen.queryByTestId("images-viewer")).not.toBeInTheDocument();
    });

    it("should forward ref to the input element", () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<ImagesChoser images={null} ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("should accept custom className", () => {
        const { container } = render(
            <ImagesChoser images={null} className="custom-class" />
        );
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const input = container.querySelector('input[type="file"]');
        expect(input).toHaveClass("custom-class");
    });

    it("should handle FileList images", () => {
        const dt = new DataTransfer();
        dt.items.add(new File(["content"], "test.png", { type: "image/png" }));
        const fileList = dt.files;

        render(<ImagesChoser images={fileList} />);
        expect(screen.getByText("View Images")).toBeInTheDocument();
    });

    it("should pass other props to Input", () => {
        const { container } = render(<ImagesChoser images={null} disabled />);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const input = container.querySelector('input[type="file"]');
        expect(input).toBeDisabled();
    });
});
