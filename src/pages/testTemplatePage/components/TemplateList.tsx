import { useQuery } from "react-query";
import { getTestTemplates } from "../../../services/testTemplate";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";
import { TestTemplateItf } from "../../../types/testTemplate";
import Loading from "../../../components/loadings/Loading";
import NoResult from "../../../components/notFound/NoResult";
import TemplateItemCard from "../../homePage/components/TemplateItemCard";

const TemplateList = () => {
    const { data: templates, isLoading } = useQuery<TestTemplateItf[]>({
        queryKey: [QUERY_KEYS.GET_TEST_TEMPLATES],
        queryFn: async () => {
            const data = await getTestTemplates({ limit: 20, page: 1 });
            return data.templates;
        },
    });

    if (isLoading) {
        return (
            <Loading
                isLoading={isLoading}
                loadingText={{ text: "Fetching templates..." }}
            />
        );
    }

    if (!templates || templates.length === 0) {
        return <NoResult message={{ text: "No test templates found." }} />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
            {templates.map((template) => (
                <TemplateItemCard template={template} key={template.id} />
            ))}
        </div>
    );
};

export default TemplateList;
