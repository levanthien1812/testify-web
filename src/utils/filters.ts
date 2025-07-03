import { FilterFn } from "@tanstack/react-table";

export const dateRangeFilter: FilterFn<any> = (row, columnId, filterValue) => {
    const rowDate = new Date(row.getValue(columnId));

    const [start, end] = filterValue || [];

    if (!start && !end) return true;
    if (start && !end) return rowDate >= new Date(start);
    if (!start && end) return rowDate <= new Date(end);

    return rowDate >= new Date(start) && rowDate <= new Date(end);
};
