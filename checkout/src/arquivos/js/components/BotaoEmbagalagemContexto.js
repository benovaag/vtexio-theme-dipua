export class BotaoEmbagalagemContexto {
    constructor(nomeProduto) {
        this._ativo = false;
        this.nomeProduto = nomeProduto;
        this.$button = this.create();
    }

    get ativo() {
        return this._ativo;
    }

    set ativo(estado) {
        this._ativo = estado;
    }

    create() {
        const $button = document.createElement("button");
        $button.classList.add("checkout__specialButton");
        $button.classList.add("checkout__specialButton--bag");
        $button.innerHTML = "embalar para presente";

        return $button;
    }
}
