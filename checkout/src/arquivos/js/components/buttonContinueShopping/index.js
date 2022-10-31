import { weArePaymentPage } from "../../helpers/weArePage";

export class ButtonContinueShopping {
    constructor() {
        this.button = this.create();
    }

    init() {
        this.render();
        this.controlTimeDisappear();
    }

    render() {
        const $container = document.querySelector(
            ".cart-template.mini-cart.span4"
        );
        $container.append(this.button);
        this.ocultaSeTiverPaginaPagamento();
    }

    create() {
        const $a = document.createElement("a");
        $a.classList.add("buttonContinueShopping__button");
        $a.innerText = "Continuar Comprando";
        $a.href = "/";
        return $a;
    }

    controlTimeDisappear() {
        window.addEventListener("hashchange", () => {
            this.ocultaSeTiverPaginaPagamento();
        });
    }

    ocultaSeTiverPaginaPagamento() {
        this.button.classList.toggle("hidden", weArePaymentPage());
    }
}
