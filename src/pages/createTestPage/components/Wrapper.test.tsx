import { render, screen, fireEvent } from "@testing-library/react";
import Wrapper from "./Wrapper";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/hooks";
import { createTestActions } from "../../../stores/createTest";

// Mocks
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../../../hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));

jest.mock("../../../stores/createTest", () => ({
    createTestActions: {
        setOpenAllParts: jest.fn((payload) => ({
            type: "SET_OPEN_ALL_PARTS",
            payload,
        })),
    },
}));

jest.mock(
    "../../../components/elements/Button",
    () =>
        ({ children, onClick, disabled, outlined }: any) =>
            (
                <button
                    onClick={onClick}
                    disabled={disabled}
                    data-testid={outlined ? "outlined-btn" : "contain-btn"}
                >
                    {children}
                </button>
            )
);

describe("Wrapper", () => {
    const mockDispatch = jest.fn();
    const defaultViewData = {
        headerTitle: {
            text: "Test Header",
            description: { text: "Test Description" },
        },
        bottomButtons: {
            containButton: {
                text: "Next",
                onClick: jest.fn(),
            },
            outlinedButton: {
                text: "Back",
                onClick: jest.fn(),
            },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            openAllParts: false,
            testParts: [],
        });
    });

    it("should render header, description and children", () => {
        render(
            <Wrapper viewData={defaultViewData}>
                <div data-testid="child">Child Content</div>
            </Wrapper>
        );

        expect(screen.getByText("Test Header")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
        expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("should render bottom buttons and handle clicks", () => {
        render(
            <Wrapper viewData={defaultViewData}>
                <div />
            </Wrapper>
        );

        const nextBtn = screen.getByText("Next");
        const backBtn = screen.getByText("Back");

        expect(nextBtn).toBeInTheDocument();
        expect(backBtn).toBeInTheDocument();

        fireEvent.click(nextBtn);
        expect(
            defaultViewData.bottomButtons.containButton.onClick
        ).toHaveBeenCalled();

        fireEvent.click(backBtn);
        expect(
            defaultViewData.bottomButtons.outlinedButton.onClick
        ).toHaveBeenCalled();
    });

    it("should show loading text for contain button", () => {
        const loadingViewData = {
            ...defaultViewData,
            bottomButtons: {
                ...defaultViewData.bottomButtons,
                containButton: {
                    ...defaultViewData.bottomButtons.containButton,
                    isLoading: true,
                    loadingText: "Loading...",
                },
            },
        };

        render(
            <Wrapper viewData={loadingViewData}>
                <div />
            </Wrapper>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should show disabled text for contain button", () => {
        const disabledViewData = {
            ...defaultViewData,
            bottomButtons: {
                ...defaultViewData.bottomButtons,
                containButton: {
                    ...defaultViewData.bottomButtons.containButton,
                    disabled: true,
                    disabledText: "Not Allowed",
                },
            },
        };

        render(
            <Wrapper viewData={disabledViewData}>
                <div />
            </Wrapper>
        );

        expect(screen.getByText("Not Allowed")).toBeInTheDocument();
        expect(screen.getByText("Not Allowed")).toBeDisabled();
    });

    it("should not render buttons if included is false", () => {
        const noButtonsViewData = {
            ...defaultViewData,
            bottomButtons: {
                containButton: { included: false },
                outlinedButton: { included: false },
            },
        };

        render(
            <Wrapper viewData={noButtonsViewData}>
                <div />
            </Wrapper>
        );

        expect(screen.queryByText("Next")).not.toBeInTheDocument();
        expect(screen.queryByText("Back")).not.toBeInTheDocument();
    });

    it("should render additional buttons", () => {
        const additionalBtnClick = jest.fn();
        const additionalButtonsViewData = {
            ...defaultViewData,
            bottomButtons: {
                ...defaultViewData.bottomButtons,
                additionalButtons: [
                    { text: "Extra", onClick: additionalBtnClick },
                ],
            },
        };

        render(
            <Wrapper viewData={additionalButtonsViewData}>
                <div />
            </Wrapper>
        );

        const extraBtn = screen.getByText("Extra");
        expect(extraBtn).toBeInTheDocument();
        fireEvent.click(extraBtn);
        expect(additionalBtnClick).toHaveBeenCalled();
    });

    it("should render 'Open all parts' button when conditions met", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            openAllParts: false,
            testParts: [{ id: 1 }, { id: 2 }], // length > 1
        });

        const canOpenPartsViewData = {
            ...defaultViewData,
            canOpenParts: true,
        };

        render(
            <Wrapper viewData={canOpenPartsViewData}>
                <div />
            </Wrapper>
        );

        const openBtn = screen.getByText("Open all parts");
        expect(openBtn).toBeInTheDocument();

        fireEvent.click(openBtn);
        expect(createTestActions.setOpenAllParts).toHaveBeenCalledWith(true);
        expect(mockDispatch).toHaveBeenCalled();
    });

    it("should render 'Close all parts' button when openAllParts is true", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            openAllParts: true,
            testParts: [{ id: 1 }, { id: 2 }],
        });

        const canOpenPartsViewData = {
            ...defaultViewData,
            canOpenParts: true,
        };

        render(
            <Wrapper viewData={canOpenPartsViewData}>
                <div />
            </Wrapper>
        );

        const closeBtn = screen.getByText("Close all parts");
        expect(closeBtn).toBeInTheDocument();

        fireEvent.click(closeBtn);
        expect(createTestActions.setOpenAllParts).toHaveBeenCalledWith(false);
    });

    it("should not render parts toggle button if testParts length <= 1", () => {
        (useAppSelector as unknown as jest.Mock).mockReturnValue({
            openAllParts: false,
            testParts: [{ id: 1 }],
        });

        const canOpenPartsViewData = {
            ...defaultViewData,
            canOpenParts: true,
        };

        render(
            <Wrapper viewData={canOpenPartsViewData}>
                <div />
            </Wrapper>
        );

        expect(screen.queryByText("Open all parts")).not.toBeInTheDocument();
    });
});
