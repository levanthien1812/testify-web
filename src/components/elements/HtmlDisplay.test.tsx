import { render } from "@testing-library/react";
import HtmlDisplay from "./HtmlDisplay";
import truncate from "truncate-html";
import DOMPurify from "dompurify";

jest.mock("truncate-html", () => jest.fn());
jest.mock("dompurify", () => ({
    sanitize: jest.fn(),
}));

describe("HtmlDisplay", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (DOMPurify.sanitize as jest.Mock).mockImplementation((val) => val);
        (truncate as unknown as jest.Mock).mockImplementation((val) => val);
    });

    it("should render html content", () => {
        const html = "<p>Test</p>";
        const { container } = render(<HtmlDisplay htmlContent={html} />);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        expect(container.innerHTML).toContain(html);
        expect(DOMPurify.sanitize).toHaveBeenCalledWith(html);
    });

    it("should truncate content if maxLength is provided", () => {
        const html = "<p>Long content</p>";
        const maxLength = 5;
        (truncate as unknown as jest.Mock).mockReturnValue("<p>Lo...</p>");

        render(<HtmlDisplay htmlContent={html} maxLength={maxLength} />);

        expect(truncate).toHaveBeenCalledWith(
            html,
            maxLength,
            expect.any(Object)
        );
        expect(DOMPurify.sanitize).toHaveBeenCalledWith("<p>Lo...</p>");
    });

    it("should apply custom className", () => {
        const { container } = render(
            <HtmlDisplay htmlContent="" className="custom" />
        );
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        expect(container.firstChild).toHaveClass("custom");
    });
});
