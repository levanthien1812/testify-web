import { render, screen, fireEvent } from "@testing-library/react";
import ImagesViewer from "./ImagesViewer";
import React from "react";

// Mock FontAwesomeIcon
jest.mock("@fortawesome/react-fontawesome", () => ({
    FontAwesomeIcon: ({ icon, onClick, className }: any) => (
        <span
            data-testid={`icon-${icon.iconName}`}
            onClick={onClick}
            className={className}
        />
    ),
}));

// Mock Backdrop
jest.mock(
    "../modals/Backdrop",
    () =>
        ({ onClick }: { onClick: () => void }) =>
            (
                <div data-testid="backdrop" onClick={onClick}>
                    Backdrop
                </div>
            )
);

describe("ImagesViewer", () => {
    beforeAll(() => {
        // Mock URL.createObjectURL
        global.URL.createObjectURL = jest.fn(
            (file: File) => `blob:${file.name}`
        );

        // Mock DataTransfer
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

    beforeEach(() => {
        // Create modal root
        const modalRoot = document.createElement("div");
        modalRoot.setAttribute("id", "modal");
        document.body.appendChild(modalRoot);
    });

    afterEach(() => {
        // Clean up modal root
        const modalRoot = document.getElementById("modal");
        if (modalRoot) {
            document.body.removeChild(modalRoot);
        }
        jest.clearAllMocks();
    });

    it("should render string images correctly", () => {
        const images = ["img1.jpg", "img2.jpg"];
        render(<ImagesViewer images={images} onClose={jest.fn()} />);

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", "img1.jpg");
        expect(img).toHaveAttribute("alt", "img1.jpg");
    });

    it("should render FileList images correctly", () => {
        const dt = new DataTransfer();
        dt.items.add(new File(["content"], "test.png", { type: "image/png" }));
        const images = dt.files;

        render(<ImagesViewer images={images} onClose={jest.fn()} />);

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", "blob:test.png");
        expect(img).toHaveAttribute("alt", "test.png");
    });

    it("should call onClose when backdrop is clicked", () => {
        const onClose = jest.fn();
        render(<ImagesViewer images={["img1.jpg"]} onClose={onClose} />);

        fireEvent.click(screen.getByTestId("backdrop"));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should navigate images", () => {
        const images = ["img1.jpg", "img2.jpg", "img3.jpg"];
        render(<ImagesViewer images={images} onClose={jest.fn()} />);

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", "img1.jpg");

        // Click next
        const nextBtnIcon = screen.getByTestId("icon-chevron-circle-right");
        fireEvent.click(nextBtnIcon);
        expect(img).toHaveAttribute("src", "img2.jpg");

        // Click next again
        fireEvent.click(nextBtnIcon);
        expect(img).toHaveAttribute("src", "img3.jpg");

        // Click prev
        const prevBtnIcon = screen.getByTestId("icon-chevron-circle-left");
        fireEvent.click(prevBtnIcon);
        expect(img).toHaveAttribute("src", "img2.jpg");
    });

    it("should disable navigation buttons at boundaries", () => {
        const images = ["img1.jpg", "img2.jpg"];
        render(<ImagesViewer images={images} onClose={jest.fn()} />);

        // eslint-disable-next-line testing-library/no-node-access
        const prevBtn = screen
            .getByTestId("icon-chevron-circle-left")
            .closest("button");
        // eslint-disable-next-line testing-library/no-node-access
        const nextBtn = screen
            .getByTestId("icon-chevron-circle-right")
            .closest("button");

        expect(prevBtn).toBeDisabled();
        expect(nextBtn).not.toBeDisabled();

        // Move to end
        fireEvent.click(screen.getByTestId("icon-chevron-circle-right"));

        expect(prevBtn).not.toBeDisabled();
        expect(nextBtn).toBeDisabled();
    });

    it("should not show navigation buttons for single image", () => {
        render(<ImagesViewer images={["img1.jpg"]} onClose={jest.fn()} />);
        expect(
            screen.queryByTestId("icon-chevron-circle-left")
        ).not.toBeInTheDocument();
        expect(
            screen.queryByTestId("icon-chevron-circle-right")
        ).not.toBeInTheDocument();
    });
});
