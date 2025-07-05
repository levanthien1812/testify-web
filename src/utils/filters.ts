import { FilterFn, Table } from "@tanstack/react-table";

export const dateRangeFilter: FilterFn<any> = (row, columnId, filterValue) => {
    const rowDate = new Date(row.getValue(columnId));

    const [start, end] = filterValue || [];

    if (!start && !end) return true;
    if (start && !end) return rowDate >= new Date(start);
    if (!start && end) return rowDate <= new Date(end);

    return rowDate >= new Date(start) && rowDate <= new Date(end);
};

export const getDistinctValues = (table: Table<any>, column: string) => {
    const rows = table.getPreFilteredRowModel().rows;

    const valueSet = new Set<string>();

    for (const row of rows) {
        const value = row.getValue<string>(column);
        if (value !== undefined) {
            valueSet.add(value);
        }
    }

    return Array.from(valueSet);
};
