import React, { useMemo } from "react";

export interface CardPickerProps<T> {
    /**
     * Array of items to choose from
     */
    items: T[];

    /**
     * Array of currently selected item IDs
     */
    selectedIds: string[];

    /**
     * Array of disabled item IDs
     */
    disabledIds?: string[];

    /**
     * Callback when selection changes
     */
    onSelectionChange: (selectedIds: string[], selectedItems: T[]) => void;

    /**
     * Render function for card content (without selection indicator)
     */
    renderCard: (item: T) => React.ReactNode;

    /**
     * Function to extract unique ID from item
     */
    getItemId: (item: T) => string;

    /**
     * Enable multiple selection (default: true)
     */
    multiSelect?: boolean;

    /**
     * Number of grid columns (e.g., 3 for grid-cols-3)
     * @default 3
     */
    gridCols?: number;

    /**
     * Show select all / clear all buttons (for multi-select only)
     * @default true
     */
    showSelectAllButton?: boolean;

    /**
     * Label for select all button
     * @default "Select All"
     */
    selectAllLabel?: string;

    /**
     * Label for clear all button
     * @default "Clear All"
     */
    clearAllLabel?: string;

    /**
     * Message to display when no items available
     */
    emptyMessage?: string;

    /**
     * CSS class for the container div
     */
    containerClassName?: string;

    /**
     * CSS class for the grid div
     */
    gridClassName?: string;

    /**
     * Render function for selection indicator
     * Defaults to a checkmark icon for selected items
     */
    renderIndicator?: (
        item: T,
        isSelected: boolean,
        isDisabled: boolean,
    ) => React.ReactNode;

    /**
     * CSS class for selected card (additional styling on top of base)
     * @default "ring-2 ring-orange-500"
     */
    selectedCardClassName?: string;

    /**
     * CSS class for card container
     * @default "cursor-pointer"
     */
    cardContainerClassName?: string;

    /**
     * Function to determine if an item is disabled/non-interactable
     */
    isItemDisabled?: (item: T) => boolean;

    /**
     * CSS class for disabled card (additional styling on top of base)
     * @default "opacity-50 cursor-not-allowed"
     */
    disabledCardClassName?: string;
}

/**
 * Reusable card picker component for selecting items from a list
 *
 * Features:
 * - Single or multiple selection modes
 * - Select All / Clear All actions (multi-select only)
 * - Built-in selection indicator (customizable or default checkmark)
 * - Flexible card rendering via render function
 * - Generic type support for any item structure
 *
 * @example
 * ```tsx
 * <CardPicker
 *   items={banks}
 *   selectedIds={[selectedBank?.id || ""]}
 *   onSelectionChange={(ids) => setSelectedBank(banks.find(b => b.id === ids[0]))}
 *   renderCard={(bank) => (
 *     <div>
 *       <h3>{bank.name}</h3>
 *       <p>{bank.questions.length} questions</p>
 *     </div>
 *   )}
 *   getItemId={(bank) => bank.id}
 *   multiSelect={false}
 *   selectedCardClassName="ring-2 ring-orange-600"
 * />
 * ```
 */
const CardPicker = <T,>({
    items,
    selectedIds,
    onSelectionChange,
    renderCard,
    getItemId,
    multiSelect = true,
    gridCols = 3,
    showSelectAllButton = true,
    selectAllLabel = "Select All",
    clearAllLabel = "Clear All",
    emptyMessage = "No items available",
    containerClassName = "",
    gridClassName = "",
    disabledIds = [],
    renderIndicator = (_item, isSelected, isDisabled) => {
        if (!isSelected || isDisabled) return null;
        return (
            <span className="absolute top-1 right-1">
                <svg
                    className="w-5 h-5 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    />
                </svg>
            </span>
        );
    },
    selectedCardClassName = "ring-1 ring-orange-500",
    cardContainerClassName = "cursor-pointer",
    isItemDisabled = () => false,
    disabledCardClassName = "opacity-50 cursor-not-allowed",
}: CardPickerProps<T>): React.ReactElement => {
    const gridColsClass = `grid-cols-${gridCols}`;

    /**
     * Handle card click - toggle selection or replace (single select)
     */
    const handleCardClick = (item: T) => {
        const itemId = getItemId(item);
        if (disabledIds.includes(itemId) || isItemDisabled(item)) {
            return;
        }

        let nextIds: string[];

        if (multiSelect) {
            if (selectedIds.includes(itemId)) {
                nextIds = selectedIds.filter((id) => id !== itemId);
            } else {
                nextIds = [...selectedIds, itemId];
            }
        } else {
            if (selectedIds.includes(itemId)) {
                nextIds = [];
            } else {
                nextIds = [itemId];
            }
        }

        const nextItems = items.filter((i) => nextIds.includes(getItemId(i)));
        onSelectionChange(nextIds, nextItems);
    };

    /**
     * Select all items
     */
    const handleSelectAll = () => {
        const selectableItems = items.filter(
            (item) =>
                !disabledIds.includes(getItemId(item)) && !isItemDisabled(item),
        );
        const selectableIds = selectableItems.map(getItemId);
        onSelectionChange(selectableIds, selectableItems);
    };

    /**
     * Clear all selections
     */
    const handleClearAll = () => {
        onSelectionChange([], []);
    };

    const isAnySelected = useMemo(
        () => selectedIds.length > 0,
        [selectedIds.length],
    );

    if (items.length === 0) {
        return <div className={containerClassName}>{emptyMessage}</div>;
    }

    return (
        <div className={containerClassName}>
            {multiSelect && showSelectAllButton && (
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={handleSelectAll}
                        className="px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 transition"
                    >
                        {selectAllLabel}
                    </button>
                    <button
                        onClick={handleClearAll}
                        disabled={!isAnySelected}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {clearAllLabel}
                    </button>
                </div>
            )}

            <div className={gridClassName || `grid ${gridColsClass} gap-2`}>
                {items.map((item) => {
                    const itemId = getItemId(item);
                    const isSelected = selectedIds.includes(itemId);
                    const isDisabled =
                        disabledIds.includes(itemId) || isItemDisabled(item);

                    return (
                        <div
                            key={itemId}
                            onClick={() => handleCardClick(item)}
                            className={`${cardContainerClassName} relative ${
                                isSelected ? selectedCardClassName : ""
                            } ${isDisabled ? disabledCardClassName : ""}`}
                        >
                            {(isSelected || isDisabled) &&
                                renderIndicator(item, isSelected, isDisabled)}
                            {renderCard(item)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CardPicker;
