import { useNavigate } from "react-router-dom";
import TestItemCard from "./TestItemCard";
import { useQuery } from "react-query";
import { getTests } from "../../../services/test";
import { TestItf } from "../../../types/types";
import { ROLES } from "../../../config/constants/tests";
import { useAppSelector } from "../../../hooks/hooks";
import noData from "../../../assets/images/no-data.png";
import SectionWrapper from "./SectionWrapper";
import Loading from "../../../components/loadings/Loading";

const RecentTests = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const { data: tests, isLoading: isLoadingTests } = useQuery<TestItf[]>({
        queryKey: ["tests"],
        queryFn: async () => {
            const data = await getTests();
            console.log(data.tests.length);
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
                        <div className="flex flex-col items-center justify-center w-full py-8">
                            <img
                                src={noData}
                                alt="no-data"
                                className="w-36 h-36"
                            />
                            <p className="text-gray-600 text-xl mt-2">
                                No tests available!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </SectionWrapper>
    );
};

export default RecentTests;
