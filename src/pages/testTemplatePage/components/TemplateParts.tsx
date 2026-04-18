import { useAppSelector } from "../../../hooks/hooks";
import { useDispatch } from "react-redux";
import { createTestTemplateActions } from "../../../stores/createTestTemplate";
import TemplatePart from "./TemplatePart";
import Wrapper from "../../createTestPage/components/Wrapper";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const TemplateParts = () => {
    const { movePrevStep } = createTestTemplateActions;
    const { numParts, maxScore, templateId, testParts, isValidParts } =
        useAppSelector((state) => state.createTestTemplate);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleComplete = () => {
        if (!isValidParts) {
            toast.error(
                "Total score and total number of questions in parts must match the values you entered in the previous step",
            );
            return;
        }
        navigate("/test-templates");
    };

    return (
        <Wrapper
            viewData={{
                headerTitle: { text: "Template Parts (Step 2)" },
                bottomButtons: {
                    outlinedButton: {
                        onClick: () => dispatch(movePrevStep()),
                        text: "Back",
                    },
                    containButton: {
                        disabled: numParts > 1 && !templateId,
                        onClick: handleComplete,
                        text: "Complete",
                    },
                },
            }}
        >
            <div className="space-y-3 mt-2 sm:mt-4">
                <div className="flex gap-2 sm:gap-4">
                    <p>
                        Total score:{" "}
                        <span className="font-bold">{maxScore}</span>{" "}
                    </p>
                </div>
                {numParts > 1 &&
                    testParts.map((part, index) => (
                        <TemplatePart key={part.id || index} part={part} />
                    ))}
                {numParts === 0 && (
                    <div>
                        <p>
                            Your template doesn't have multiple parts so you can
                            skip this section
                        </p>
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default TemplateParts;
