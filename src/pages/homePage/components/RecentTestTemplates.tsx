import { useNavigate } from "react-router-dom";
import TemplateItemCard from "./TemplateItemCard";
import { useQuery } from "react-query";
import { getTestTemplates } from "../../../services/testTemplate";
import { TestTemplateItf } from "../../../types/testTemplate";
import { ROLES } from "../../../config/constants/tests";
import { useAppSelector } from "../../../hooks/hooks";
import SectionWrapper from "./SectionWrapper";
import Loading from "../../../components/loadings/Loading";
import NoResult from "../../../components/notFound/NoResult";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";

const RecentTestTemplates = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const { data: templates, isLoading: isLoadingTemplates } = useQuery<
        TestTemplateItf[]
    >({
        queryKey: [QUERY_KEYS.GET_TEST_TEMPLATES],
        queryFn: async () => {
            const data = await getTestTemplates({ limit: 10, page: 1 });
            return data.templates;
        },
        enabled: user?.role === ROLES.MAKER,
    });

    const handleClickCreateTemplateBtn = () => {
        navigate("/test-templates/create");
    };

    return (
        <SectionWrapper
            title={{ text: "Test Templates" }}
            buttons={[
                {
                    text: "Create template",
                    onClick: handleClickCreateTemplateBtn,
                    display: user!.role === ROLES.MAKER,
                },
            ]}
            links={[
                {
                    text: "View all",
                    to: "/test-templates",
                    display:
                        !isLoadingTemplates &&
                        templates &&
                        templates.length > 0,
                },
            ]}
        >
            <Loading
                isLoading={isLoadingTemplates}
                loadingText={{ text: "Loading test templates..." }}
            />
            {templates && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mt-3 pb-1">
                    {templates.map((template: TestTemplateItf) => {
                        return (
                            <div key={template.id}>
                                <TemplateItemCard template={template} />
                            </div>
                        );
                    })}

                    {templates.length === 0 && (
                        <NoResult
                            message={{ text: "No test templates found" }}
                        />
                    )}
                </div>
            )}
        </SectionWrapper>
    );
};

export default RecentTestTemplates;
