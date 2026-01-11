import { render, screen } from "@testing-library/react";
import TestOption from "./TestOption";
import React from "react";

describe("TestOption", () => {
    it("should render main option and sub options correctly", () => {
        const mainOption = <span>Main Option Content</span>;
        const subOptions = [
            <span key="sub1">Sub Option 1</span>,
            <span key="sub2">Sub Option 2</span>,
        ];

        render(<TestOption mainOption={mainOption} subOptions={subOptions} />);

        expect(screen.getByText("Main Option Content")).toBeInTheDocument();
        expect(screen.getByText("Sub Option 1")).toBeInTheDocument();
        expect(screen.getByText("Sub Option 2")).toBeInTheDocument();
    });

    it("should render additional info when provided", () => {
        const mainOption = <span>Main</span>;
        const subOptions = [<span key="sub">Sub</span>];
        const additionalInfo = <span>Additional Info Content</span>;

        render(
            <TestOption
                mainOption={mainOption}
                subOptions={subOptions}
                additionalInfo={additionalInfo}
            />
        );

        expect(screen.getByText("Additional Info Content")).toBeInTheDocument();
    });

    it("should not render additional info section when not provided", () => {
        const mainOption = <span>Main</span>;
        const subOptions = [<span key="sub">Sub</span>];

        render(<TestOption mainOption={mainOption} subOptions={subOptions} />);

        expect(screen.queryByTestId("additional-info")).not.toBeInTheDocument();
    });
});
