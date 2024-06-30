import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getTests } from "../../services/test";
import { FilterState, TestItf } from "../../types/types";
import TestItemCard from "../homePage/components/TestItemCard";
import Filter from "./components/Filter";
import Button from "../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Select from "../../components/elements/Select";

type TestsFetchResult = {
    tests: TestItf[];
    totalPages: number;
};

const TestsPage = () => {
    const [filter, setFilter] = useState<FilterState>({ page: 1, limit: 8 });

    const {
        data: testsFetchResult,
        isLoading: isLoadingTests,
        refetch: refetchTests,
    } = useQuery<TestsFetchResult>({
        queryKey: ["tests", { filter }],
        queryFn: async () => {
            let requestFilter = { ...filter };
            if (requestFilter.sort && requestFilter.order) {
                requestFilter.sort =
                    requestFilter.sort + ":" + requestFilter.order;
                delete requestFilter.order;
            }

            const data = await getTests(requestFilter);
            return data;
        },
        enabled: false,
    });

    useEffect(() => {
        refetchTests();
    }, [filter]);

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
            <h2 className="text-4xl">Tests</h2>
            {testsFetchResult && testsFetchResult.tests.length > 0 && (
                <Filter filter={filter} setFilter={setFilter} />
            )}
            {testsFetchResult?.tests && (
                <>
                    <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-5 mt-5 auto-rows-fr">
                        {testsFetchResult.tests.map((test) => (
                            <div key={test._id}>
                                <TestItemCard test={test} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-5 pt-2 border-t border-dashed items-end">
                        <p>
                            Page {filter.page} of {testsFetchResult.totalPages}
                        </p>
                        <Button
                            primary={false}
                            size="sm"
                            onClick={() =>
                                setFilter({
                                    ...filter,
                                    page: filter.page - 1,
                                })
                            }
                            disabled={filter.page <= 1}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
                        </Button>
                        <Button
                            primary={false}
                            size="sm"
                            onClick={() =>
                                setFilter({ ...filter, page: filter.page + 1 })
                            }
                            disabled={
                                filter.page >= testsFetchResult.totalPages
                            }
                        >
                            <FontAwesomeIcon icon={faChevronRight} size="sm" />
                        </Button>
                        <label htmlFor="limit" className="text-gray-600">
                            Tests per page:{" "}
                        </label>
                        <Select
                            id="limit"
                            name="limit"
                            sizing="sm"
                            options={[8, 12, 16, 20].map((limit) => ({
                                value: limit,
                                label: limit,
                            }))}
                            value={filter.limit}
                            onChange={(e) =>
                                setFilter({
                                    ...filter,
                                    limit: parseInt(e.target.value),
                                })
                            }
                        />
                    </div>
                </>
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
