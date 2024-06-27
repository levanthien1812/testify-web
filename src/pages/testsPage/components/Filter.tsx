import React, { useState } from "react";
import Input from "../../../components/elements/Input";
import Button from "../../../components/elements/Button";
import Select from "../../../components/elements/Select";
import { formatTimezone } from "../../../utils/time";
import { FilterState } from "../../../types/types";
import { Link } from "react-router-dom";
import { testStatus } from "../../../config/config";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

type FilterProps = {
    filter: FilterState;
    setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
};

const Filter = ({ filter, setFilter }: FilterProps) => {
    const [search, setSearch] = useState(filter.search || "");
    const [showFilter, setShowFilter] = useState(false);

    return (
        <>
            {!showFilter && (
                <div className="flex justify-end gap-2">
                    <Button onClick={() => setShowFilter(true)} size="sm">
                        Filter{" "}
                        <FontAwesomeIcon
                            icon={faFilter}
                            className="text-sm ms-1"
                        />
                    </Button>
                    <Link to="/tests/create">
                        <Button onClick={() => setShowFilter(true)} size="sm">
                            Create test
                        </Button>
                    </Link>
                </div>
            )}
            {showFilter && (
                <div className="bg-gray-100 px-4 py-2">
                    <div className="flex gap-2">
                        <div>
                            <label htmlFor="sort">Sort by: </label>
                            <Select
                                sizing="sm"
                                id="sort"
                                name="sort"
                                value={filter.sort || "title"}
                                onChange={(e) =>
                                    setFilter({
                                        ...filter,
                                        sort: e.target.value,
                                        order: filter.order || "asc",
                                    })
                                }
                                options={[
                                    { value: "title", label: "Title" },
                                    { value: "duration", label: "Duration" },
                                    { value: "datetime", label: "Start time" },
                                    {
                                        value: "num_questions",
                                        label: "Number of questions",
                                    },
                                    {
                                        value: "num_parts",
                                        label: "Number of parts",
                                    },
                                ]}
                            />
                        </div>
                        <div>
                            <label htmlFor="order">Order: </label>
                            <Select
                                sizing="sm"
                                id="order"
                                name="order"
                                value={filter.order || "asc"}
                                onChange={(e) =>
                                    setFilter({
                                        ...filter,
                                        order: e.target.value,
                                        sort: filter.sort || "title",
                                    })
                                }
                                options={[
                                    { value: "asc", label: "Ascending" },
                                    { value: "desc", label: "Descending" },
                                ]}
                            />
                        </div>
                        <div>
                            <label htmlFor="date_from">Date from: </label>
                            <Input
                                sizing="sm"
                                type="datetime-local"
                                name="date_from"
                                value={formatTimezone(
                                    filter.date_from || new Date()
                                )}
                                onChange={(e) =>
                                    setFilter({
                                        ...filter,
                                        date_from: new Date(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="date_to">Date to: </label>
                            <Input
                                sizing="sm"
                                type="datetime-local"
                                name="date_to"
                                value={formatTimezone(
                                    filter.date_to || new Date()
                                )}
                                onChange={(e) =>
                                    setFilter({
                                        ...filter,
                                        date_to: new Date(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="status">Status: </label>
                            <Select
                                sizing="sm"
                                name="status"
                                value={filter.status || testStatus.PUBLISHED}
                                onChange={(e) => {
                                    setFilter({
                                        ...filter,
                                        status: e.target.value,
                                    });
                                }}
                                options={Object.values(testStatus).map(
                                    (status) => ({
                                        value: status,
                                        label: _.capitalize(status),
                                    })
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-2 justify-end border-t border-gray-300 pt-2 border-dashed">
                        {Object.keys(filter).length > 0 && (
                            <button
                                className="me-5 hover:underline"
                                onClick={() =>
                                    setFilter((prev) => ({
                                        page: prev.page,
                                        limit: prev.limit,
                                    }))
                                }
                            >
                                Clear filters
                            </button>
                        )}
                        <button
                            className="me-5 hover:underline"
                            onClick={() => setShowFilter(false)}
                        >
                            Hide filters
                        </button>
                        <Input
                            sizing="sm"
                            placeholder="Search"
                            type="text"
                            name="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button
                            size="sm"
                            onClick={() => setFilter({ ...filter, search })}
                        >
                            Search
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Filter;
