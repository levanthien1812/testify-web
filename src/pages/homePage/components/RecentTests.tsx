import { useNavigate } from "react-router-dom";
import TestItemCard from "./TestItemCard";
import { useQuery } from "react-query";
import { getTests } from "../../../services/test";
import { TestItf } from "../../../types/types";
import { ROLES } from "../../../config/constants/tests";
import { useAppSelector } from "../../../hooks/hooks";
import SectionWrapper from "./SectionWrapper";
import Loading from "../../../components/loadings/Loading";
import NoResult from "../../../components/notFound/NoResult";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";

const RecentTests = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const { data: tests, isLoading: isLoadingTests } = useQuery<TestItf[]>({
        queryKey: [QUERY_KEYS.GET_TESTS],
        queryFn: async () => {
            const data = await getTests({ limit: 10, page: 1 });
            return data.tests;
        },
    });

    const handleClickCreateTestBtn = () => {
        navigate("/tests/create");
    };

    return (
        <SectionWrapper
            title={{ text: "Recent tests" }}
            buttons={[
                {
                    text: "Create test",
                    onClick: handleClickCreateTestBtn,
                    display: user!.role === ROLES.MAKER,
                },
            ]}
            links={[
                {
                    text: "View all",
                    to: "/tests",
                    display: !isLoadingTests && tests && tests.length > 0,
                },
            ]}
        >
            <Loading
                isLoading={isLoadingTests}
                loadingText={{ text: "Loading recent tests..." }}
            />
            {tests && (
                <div className="flex gap-2 sm:gap-4 md:gap-6 mt-3 pb-1 custom-scrollbar-x">
                    {tests.map((test: TestItf) => {
                        return (
                            <div key={test.id}>
                                <TestItemCard test={test} />
                            </div>
                        );
                    })}

                    {tests.length === 0 && (
                        <NoResult message={{ text: "No recent tests found" }} />
                    )}
                </div>
            )}
        </SectionWrapper>
    );
};

export default RecentTests;
