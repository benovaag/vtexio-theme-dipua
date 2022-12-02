export function getTitleColor(title: string | undefined): string | undefined{
    if (!title) return undefined;
    const colors = ["ouro", "prata"];

    for (const color of colors) {
        if (title.toLowerCase().includes(color.toLowerCase())) {
            return color;
        }
    }

    return undefined;
}
