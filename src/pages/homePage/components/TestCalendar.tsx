import React, { useState } from "react";
import SectionWrapper from "./SectionWrapper";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { getTests } from "../../../services/test";
import { TestItf } from "../../../types/types";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import Button from "../../../components/elements/Button";
import IconButton from "../../../components/elements/IconButton";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DateCellWrapper from "./DateCellWrapper";
import { useAppSelector } from "../../../hooks/hooks";
import {
    ROLES,
    TEST_LEVEL_LABEL,
    TEST_STATUS,
} from "../../../config/constants/tests";
import { shorten } from "../../../utils/text";

const localizer = momentLocalizer(moment);

const TestCalendar = () => {
    const [eventList, setEventList] = useState<
        {
            id: string;
            title: string;
            start: Date;
            end: Date;
            allDay: boolean;
        }[]
    >([]);

    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const [selectedTest, setSelectedTest] = useState<TestItf | null>(null);

    const { data: tests, isLoading: isLoadingTests } = useQuery<TestItf[]>({
        queryKey: ["tests"],
        queryFn: async () => {
            const data = await getTests();
            setEventList(
                data.tests.map((test: TestItf) => {
                    return {
                        id: test.id,
                        title: shorten(test.title, 20),
                        start: new Date(test.datetime),
                        end: new Date(test.datetime),
                        // end: new Date(
                        //     test.options.allow_close_time
                        //         ? test.options.allow_close_time.close_time!
                        //         : test.datetime
                        // ),
                        allDay: false,
                    };
                })
            );
            return data.tests;
        },
    });

    return (
        <SectionWrapper title={{ text: "Test Calendar" }}>
            <div className="flex flex-col md:flex-row gap-2 items-stretch">
                <Calendar
                    localizer={localizer}
                    events={eventList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{
                        height: 500,
                        margin: "10px 0 0 0",
                        flexGrow: 1,
                        transition: "all 0.3s ease-in-out",
                    }}
                    onSelectEvent={(event) => {
                        setSelectedTest(
                            tests?.find((test) => test.id === event.id) || null
                        );
                    }}
                    components={{
                        dateCellWrapper: DateCellWrapper,
                    }}
                />
                {selectedTest && (
                    <div className="bg-gray-50 shadow-md rounded-lg p-4 w-full md:max-w-[30%] flex flex-col">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-bold mb-2">
                                Test information
                            </p>
                            <IconButton
                                icon={faTimes}
                                onClick={() => setSelectedTest(null)}
                            />
                        </div>

                        <p className="text-center text-3xl">
                            {selectedTest.title}
                        </p>

                        <p className="text-lg text-center mt-2">
                            Duration:{" "}
                            <span className=" font-bold text-orange-600 underline">
                                {selectedTest.duration} minutes
                            </span>
                        </p>

                        {selectedTest.num_parts > 0 && (
                            <p className="text-lg text-center mt-2">
                                Parts:{" "}
                                <span className=" font-bold text-orange-600 underline"></span>{" "}
                                {selectedTest.num_parts}
                            </p>
                        )}

                        <p className="text-lg text-center mt-2">
                            Questions:{" "}
                            <span className=" font-bold text-orange-600 underline"></span>{" "}
                            {selectedTest.num_questions}
                        </p>

                        <p className="text-lg text-center mt-2">
                            Max score: {selectedTest.max_score}
                        </p>

                        {selectedTest.level && (
                            <p className="text-lg text-center mt-2">
                                Level:{" "}
                                <span className="capitalize">
                                    {TEST_LEVEL_LABEL[selectedTest.level]}
                                </span>
                            </p>
                        )}

                        <p className="text-lg text-center mt-2">
                            Time start:{" "}
                            <span className="font-bold px-2 text-orange-600 underline">
                                {format(
                                    new Date(selectedTest.datetime),
                                    "dd/MM/yyyy HH:mm"
                                )}
                            </span>
                        </p>

                        <div className="flex gap-2 mt-auto">
                            {user?.role === ROLES.MAKER && (
                                <Button
                                    onClick={() =>
                                        navigate(
                                            `/tests/${selectedTest.id}/edit`
                                        )
                                    }
                                    outlined
                                    className="grow rounded-md"
                                >
                                    Edit
                                </Button>
                            )}
                            {!(
                                selectedTest.status === TEST_STATUS.DRAFT ||
                                selectedTest.status === TEST_STATUS.PUBLISHABLE
                            ) && (
                                <Button
                                    onClick={() =>
                                        navigate(`/tests/${selectedTest.id}`)
                                    }
                                    primary
                                    className="grow rounded-md"
                                >
                                    View detail
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
};

export default TestCalendar;
