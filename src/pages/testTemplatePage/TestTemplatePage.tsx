import { useNavigate } from "react-router-dom";
import TemplateList from "./components/TemplateList";
import Button from "../../components/elements/Button";

const TestTemplatePage = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-bold">Test templates</h2>
                <Button
                    onClick={() => navigate("/test-templates/create")}
                    className="px-6"
                >
                    Create Template
                </Button>
            </div>
            <TemplateList />
        </div>
    );
};

export default TestTemplatePage;
