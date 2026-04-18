import React from "react";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../components/modals/Modal";
import CardPicker from "../../../components/pickers/CardPicker";
import { TestTemplateItf } from "../../../types/testTemplate";
import { useQuery } from "react-query";
import { getTestTemplates } from "../../../services/testTemplate";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";
import Loading from "../../../components/loadings/Loading";
import Button from "../../../components/elements/Button";
import { createTestActions } from "../../../stores/createTest";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const TemplatePicker = ({ onClose }: { onClose: () => void }) => {
    const [selectedTemplateId, setSelectedTemplateId] = React.useState<
        string | null
    >(null);
    const { handleSelectTemplate: handleSelectTemplateAction } =
        createTestActions;

    const dispatch = useDispatch();

    const { data: templates, isLoading } = useQuery<TestTemplateItf[]>({
        queryKey: [QUERY_KEYS.GET_TEST_TEMPLATES],
        queryFn: async () => {
            const data = await getTestTemplates({ limit: 20, page: 1 });
            return data.templates;
        },
    });

    const handleSelectTemplate = (
        templateIds: string[],
        _items: TestTemplateItf[],
    ) => {
        setSelectedTemplateId(templateIds[0]);
    };

    const handleConfirmSelection = () => {
        if (!selectedTemplateId) {
            toast.warning("Please select a template before confirming.");
            return;
        }
        const selectedTemplate = templates?.find(
            (template) => template.id === selectedTemplateId,
        );
        if (!selectedTemplate) {
            toast.error("Selected template not found.");
            return;
        }
        dispatch(handleSelectTemplateAction(selectedTemplate));
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader title="Select a template" />
            <ModalBody>
                <p>
                    You can select a test template to use for this test. This
                    will pre-fill the test information and parts based on the
                    template you choose.
                </p>
                <p>
                    If you don't want to use a template, you can skip this step
                    and fill in the information manually.
                </p>
                {isLoading && (
                    <Loading
                        isLoading={isLoading}
                        loadingText={{ text: "Loading templates..." }}
                    />
                )}
                <div className="mt-4">
                    <CardPicker
                        items={templates || []}
                        selectedIds={
                            selectedTemplateId ? [selectedTemplateId] : []
                        }
                        onSelectionChange={handleSelectTemplate}
                        getItemId={(template) => template.id}
                        renderCard={(template) => (
                            <div className="px-4 py-2 bg-blue-50 hover:bg-blue-100 shadow-sm transition">
                                <div className="text-lg font-bold">
                                    {template.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {template.description}
                                </div>
                            </div>
                        )}
                        multiSelect={false}
                        gridCols={3}
                        showSelectAllButton={false}
                        emptyMessage="No templates available"
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleConfirmSelection}>Select</Button>
            </ModalFooter>
        </Modal>
    );
};

export default TemplatePicker;
