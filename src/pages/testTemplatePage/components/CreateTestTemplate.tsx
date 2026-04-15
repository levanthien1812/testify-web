import { CREATE_TEST_TEMPLATE_STEPS } from "../../../config/constants/testTemplate";
import { useAppSelector } from "../../../hooks/hooks";
import TemplateInfo from "./TemplateInfo";
import TemplateParts from "./TemplateParts";

const CreateTestTemplate = () => {
    const { currentStep } = useAppSelector((state) => state.createTestTemplate);

    return (
        <div>
            {currentStep ===
                CREATE_TEST_TEMPLATE_STEPS.TEMPLATE_INFORMATION && (
                <TemplateInfo />
            )}
            {currentStep === CREATE_TEST_TEMPLATE_STEPS.TEMPLATE_PARTS && (
                <TemplateParts />
            )}
        </div>
    );
};

export default CreateTestTemplate;
