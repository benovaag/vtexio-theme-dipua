export function queryVal(val: string) {
    return val?.replace(/\*|OR|or|AND|and/g, "");
}
