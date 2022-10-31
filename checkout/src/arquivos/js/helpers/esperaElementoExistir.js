/**
 * @description cria uma promisse que vai rodar a cada intervalo e verificar
 * se o elemento existe e quando ele existir ele resolve a promisse
 *
 * @param {Object} employee
 * @param {string} employee.seletorCss
 * @param {number} employee.intervalo
 * @param {number} employee.tempoMaximo
 * @returns {Promise<void|HTMLElement>}
 *
 */

export function espereElementoExistir({
    seletorCss,
    tempoMaximo = 120000,
    intervalo = 100,
}) {
    return new Promise((resolve, reject) => {
        const intervalo1 = setInterval(() => {
            const $elemento = document.querySelector(seletorCss);
            if ($elemento) {
                resolve($elemento);
                clearInterval(intervalo1);
            }
        }, intervalo);

        setTimeout(() => {
            clearInterval(intervalo1);
            reject(new Error("Elemento não encontrado a tempo"));
        }, tempoMaximo);
    });
}
