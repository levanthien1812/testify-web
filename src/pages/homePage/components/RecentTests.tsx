import { Link, useNavigate } from "react-router-dom";
import TestItemCard from "./TestItemCard";
import { useQuery } from "react-query";
import { getTests } from "../../../services/test";
import { TestItf } from "../../../types/types";
import Button from "../../../components/elements/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import { ROLES } from "../../../config/constants/tests";

const RecentTests = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

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
        <div>
            <div className="flex justify-between items-end border-b border-dashed border-gray-300 pb-0.5">
                <div>
                    <h2 className="text-2xl inline-block">Recent tests</h2>
                    {user!.role === ROLES.MAKER && (
                        <Button
                            size="sm"
                            className="ms-3"
                            onClick={handleClickCreateTestBtn}
                        >
                            Create test
                        </Button>
                    )}
                </div>

                <Link to="/tests" className="text-orange-600 hover:underline">
                    View all
                </Link>
            </div>

            {isLoadingTests && (
                <p className="text-center text-gray-600 text-xl">
                    Loading recent tests...
                </p>
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
                        <p className="text-center text-gray-600 text-xl">
                            No tests available
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecentTests;
