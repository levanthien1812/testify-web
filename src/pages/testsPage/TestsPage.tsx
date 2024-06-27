import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getTests } from "../../services/test";
import { FilterState, TestItf } from "../../types/types";
import TestItemCard from "../homePage/components/TestItemCard";
import Filter from "./components/Filter";

const TestsPage = () => {
    const [filter, setFilter] = useState<FilterState>({});

    const {
        data: tests,
        isLoading: isLoadingTests,
        refetch: refetchTests,
    } = useQuery<TestItf[]>({
        queryKey: ["tests", { filter }],
        queryFn: async () => {
            let requestFilter = { ...filter };
            if (Object.keys(requestFilter).length > 0) {
                requestFilter.sort =
                    requestFilter.sort + ":" + requestFilter.order;
                delete requestFilter.order;
            }

            const data = await getTests(requestFilter);
            return data.tests;
        },
        enabled: false,
    });

    useEffect(() => {
        refetchTests();
    }, [filter]);

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
            <h2 className="text-4xl">Tests</h2>
            <Filter filter={filter} setFilter={setFilter} />
            {tests && (
                <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-5 mt-5 auto-rows-fr">
                    {tests.map((test) => (
                        <div key={test._id}>
                            <TestItemCard test={test} />
                        </div>
                    ))}
                </div>
            )}
            {isLoadingTests && (
                <p className="text-center mt-5 text-xl text-gray-600">
                    Loading tests...
                </p>
            )}
        </div>
    );
};

export default TestsPage;
