/**
 * formats an integer value from cents to a string in the style of real Brazilian currency
 * @example
 *
 * @param {number} cents - the value to be formatted
 *
 * formatBrazilianCurrency(1234) // "R$ 12,34"
 */

export function formatBrazilianCurrency(cents) {
    const config = {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    };
    const valueFormatter = new Intl.NumberFormat("pt-BR", config).format(cents);

    return valueFormatter;
}
