import { render, screen } from "@testing-library/react";
import Anyone from "./Anyone";
import { useAppSelector } from "../../../../hooks/hooks";

// Mocks
jest.mock("../../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("./CopyLink", () => ({ link }: any) => (
    <div data-testid="copy-link">{link}</div>
));

describe("Anyone", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render correctly with test link", () => {
        const mockTestLink = "https://testify.com/test/123";
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            testLink: mockTestLink,
        });

        render(<Anyone />);

        const copyLink = screen.getByTestId("copy-link");
        expect(copyLink).toBeInTheDocument();
        expect(copyLink).toHaveTextContent(mockTestLink);
    });
});
