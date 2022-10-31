/**
 * @description receber um elemento html como filho e um selor CSS
 * e retornar o parente de da direçao escolhida
 *
 * @param {Object} employee
 * @param {HTMLElement} employee.$elemento
 * @param {string} employee.seletorCss
 * @param {"parentNode"|"nextElementSibling"|"previousElementSibling"} employee.direcao
 * @returns {HTMLElement}
 */
export function elementoParenteComEsseSeletor({
    $elemento,
    seletorCss,
    direcao = "parentElement",
}) {
    console.log("$elemento", $elemento);
    console.log("seletorCss", seletorCss);
    console.log("direcao", direcao);

    const $pai = $elemento[direcao];
    if ($pai.matches(seletorCss)) {
        return $pai;
    } else if ($pai.matches("body")) {
        return null;
    } else {
        return elementoParenteComEsseSeletor({
            $elemento: $pai,
            seletorCss,
            direcao,
        });
    }
}
