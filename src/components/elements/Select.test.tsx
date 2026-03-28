import { render, screen } from "@testing-library/react";
import Select from "./Select";
import React from "react";

describe("Select", () => {
    const options = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
    ];

    it("should render correctly", () => {
        render(<Select name="test-select" options={options} />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getAllByRole("option")).toHaveLength(2);
    });

    it("should render label", () => {
        render(
            <Select
                name="test-select"
                options={options}
                label={{ text: "Label" }}
            />
        );
        expect(screen.getByLabelText("Label:")).toBeInTheDocument();
    });

    it("should render guide option", () => {
        render(
            <Select
                name="test-select"
                options={options}
                guideOption="Select one"
            />
        );
        expect(screen.getByText("Select one")).toBeInTheDocument();
    });

    it("should render error message", () => {
        render(
            <Select name="test-select" options={options} error="Error msg" />
        );
        expect(screen.getByText("Error msg")).toBeInTheDocument();
    });

    it("should render helper text", () => {
        render(
            <Select name="test-select" options={options} helperText="Helper" />
        );
        expect(screen.getByText("Helper")).toBeInTheDocument();
    });

    it("should handle sizing", () => {
        const { rerender } = render(
            <Select name="test-select" options={options} sizing="sm" />
        );
        expect(screen.getByRole("combobox")).toHaveClass("px-1 py-0");

        rerender(<Select name="test-select" options={options} sizing="md" />);
        expect(screen.getByRole("combobox")).toHaveClass("px-2 py-1");
    });

    it("should forward ref", () => {
        const ref = React.createRef<HTMLSelectElement>();
        render(<Select name="test-select" options={options} ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });

    it("should show required asterisk", () => {
        render(
            <Select
                name="test-select"
                options={options}
                label={{ text: "Label" }}
                required
            />
        );
        expect(screen.getByText("*")).toBeInTheDocument();
    });
});
