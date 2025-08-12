import { createTestActions } from "../../../stores/createTest";
import { CreateTestStep } from "../../../types/tests";
import { useDispatch } from "react-redux";
import { CREATE_TEST_STEPS } from "../../../config/constants/tests";
import { useAppSelector } from "../../../hooks/hooks";

const Navigator = () => {
    const { steps, currentStep } = useAppSelector((state) => state.createTest);
    const { handleNavigation, navigateStep } = createTestActions;
    const dispatch = useDispatch();

    const handleClickStep = (value: string) => {
        dispatch(navigateStep(value as CREATE_TEST_STEPS));
    };

    const getColor = (step: CreateTestStep) => {
        if (currentStep === step.value) {
            return "bg-orange-600";
        } else if (step.isTotallyDone || step.isPartiallyDone) {
            return "bg-orange-400";
        } else {
            return "bg-gray-300";
        }
    };

    return (
        <div className="flex w-full sm:w-5/6 md:w-3/4 mx-auto">
            {steps.map((step) => {
                return (
                    <div className="grow flex items-center" key={step.value}>
                        <div className={`h-1 ${getColor(step)} grow`}></div>
                        <button
                            onClick={() => handleClickStep(step.value)}
                            className={`w-8 h-8 ${getColor(
                                step
                            )} text-white rounded-full flex items-center justify-center text-xl`}
                        >
                            {step.index}
                        </button>
                        <div className={`h-1 ${getColor(step)} grow`}></div>
                    </div>
                );
            })}
        </div>
    );
};

export default Navigator;
