import { Link, useNavigate } from "react-router-dom";
import TestItemCard from "./TestItemCard";
import { useQuery } from "react-query";
import { getTests } from "../../../services/test";
import { TestItf } from "../../../types/types";
import Button from "../../../components/elements/Button";

const RecentTests = () => {
    const navigate = useNavigate();

    const { data: tests, isLoading: isLoadingTests } = useQuery<TestItf[]>({
        queryKey: ["tests"],
        queryFn: async () => {
            const data = await getTests();
            return data.tests;
        },
    });

    return (
        <div>
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl inline-block">Recent tests</h2>
                    <Button
                        size="sm"
                        className="ms-3"
                        onClick={() => navigate("/tests/create")}
                    >
                        Create test
                    </Button>
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
                <div className="flex gap-6 mt-3 overflow-x-scroll scrollbar-thin pb-1">
                    {tests.map((test: TestItf) => {
                        return (
                            <div key={test._id}>
                                <TestItemCard test={test} />
                            </div>
                        );
                    })}

                    {tests.length === 0 && (
                        <p className="text-center text-gray-600 text-xl">
                            No tests yet
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecentTests;
