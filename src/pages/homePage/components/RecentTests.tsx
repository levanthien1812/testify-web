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

const RecentTests = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const { data: tests, isLoading: isLoadingTests } = useQuery<TestItf[]>({
        queryKey: ["tests"],
        queryFn: async () => {
            const data = await getTests();
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
            {isLoadingTests && (
                <Loading
                    isLoading={isLoadingTests}
                    loadingText={{ text: "Loading recent tests..." }}
                />
            )}
            {tests && (
                <div className="flex gap-6 mt-3 pb-1 custom-scrollbar-x">
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
