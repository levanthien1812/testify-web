import Select from "../../../components/elements/Select";

type ToolBarProps = {
    onSelectLayout: (layout: "grid" | "row") => void;
    currentLayout: "grid" | "row";
    onQuestionsPerRowChange: (questionsPerRow: number) => void;
    questionsPerRow: number;
};

const questionsPerRowOptions = [
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
];

const ToolBar = ({
    onSelectLayout,
    currentLayout,
    questionsPerRow,
    onQuestionsPerRowChange,
}: ToolBarProps) => {
    return (
        <div className="flex gap-2 my-1">
            <div className="flex gap-1 bg-gray-50 rounded-md p-1 ml-auto items-center">
                <button
                    className={`text-gray-500 rounded-md px-2 ${
                        currentLayout === "grid" ? "bg-gray-200" : "bg-gray-100"
                    }`}
                    onClick={() => onSelectLayout("grid")}
                >
                    Grid
                </button>
                <button
                    className={`text-gray-500 rounded-md px-2 ${
                        currentLayout === "row" ? "bg-gray-200" : "bg-gray-100"
                    }`}
                    onClick={() => onSelectLayout("row")}
                >
                    Row
                </button>
                {currentLayout === "grid" && (
                    <div className="flex gap-1">
                        <Select
                            label={{ text: "Questions per row" }}
                            options={questionsPerRowOptions}
                            sizing="sm"
                            value={questionsPerRow}
                            onChange={(event) => {
                                onQuestionsPerRowChange(
                                    parseInt(event.target.value)
                                );
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToolBar;
