export class CheckoutPosition {
    get currentPosition() {
        const currentUrl = window.location.href;
        const positions = {
            "meu carrinho": ["cart", "email"],
            pagamento: ["profile", "shipping", "payment"],
            confirmacao: ["orderPlaced"],
        };

        for (let stage in positions) {
            for (let stepName of positions[stage]) {
                if (currentUrl.includes(stepName)) {
                    return stage;
                }
            }
        }
        new Error(
            `unable to find current position from url ${currentUrl}\nAdd it to the positions object`
        );
        return "";
    }

    get currentPositionNumber() {
        const positionsNumber = ["meu carrinho", "pagamento", "confirmacao"];
        const currentPosition = this.currentPosition;
        return positionsNumber.indexOf(currentPosition);
    }

    addEvent() {
        window.addEventListener("hashchange", () => {
            this.update();
        });
    }

    update() {
        const currentPositionNumber = this.currentPositionNumber;
        const circles = document.querySelectorAll("[data-checkoutposition]");

        for (let $circle of circles) {
            const positionNumber = $circle.dataset.checkoutposition;

            if (positionNumber <= currentPositionNumber) {
                $circle.classList.add("checkout-position__circle--active");
            } else {
                $circle.classList.remove("checkout-position__circle--active");
            }
        }
    }
}
