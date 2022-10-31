import { espereElementoExistir } from "../../helpers/esperaElementoExistir";

const CSS_SELECTOR_CART_ITEM = ".table.cart-items .product-item";
const CSS_SELECTOR_CONTAINER_CART_ITENS = ".table.cart-items";
const CATEGORY_ID_OFF = 7;
const CSS_SELECTOR_OLD_PRICE_DESKTOP = ".new-product-real-price";
const CSS_SELECTOR_OLD_PRICE_MOBILE = ".total-price.hide";

function observe($element, callback) {
    const mutationObserverConfig = {
        attributes: true,
        characterData: true,
        childList: false,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false,
    };

    const mutationObserver = new MutationObserver(() => {
        callback();
    });

    mutationObserver.observe($element, mutationObserverConfig);
}

export class RemoveOldPriceOfProductsThatAreNotOffCategory {
    constructor() {
        this.categoryId = CATEGORY_ID_OFF;
    }

    async start() {
        await espereElementoExistir({
            seletorCss: CSS_SELECTOR_CART_ITEM,
        });
        this.handleRemove();

        const $containerCartItams = document.querySelector(
            CSS_SELECTOR_CONTAINER_CART_ITENS
        );

        observe($containerCartItams, this.handleRemove.bind(this));
    }

    handleRemove() {
        const $cartItens = document.querySelectorAll(CSS_SELECTOR_CART_ITEM);

        $cartItens.forEach(($cartItem, index) => {
            if (this.isFromTheCategory(index)) return;

            this.remove($cartItem);
        });
    }

    remove($cartItem) {
        const $oldpriceDesktop = $cartItem.querySelector(
            CSS_SELECTOR_OLD_PRICE_DESKTOP
        );
        const $oldpriceMobile = $cartItem.querySelector(
            CSS_SELECTOR_OLD_PRICE_MOBILE
        );
        if ($oldpriceDesktop) $oldpriceMobile.remove();
        if ($oldpriceDesktop) $oldpriceDesktop.remove();
    }

    isFromTheCategory(index) {
        const has =
            vtexjs.checkout.orderForm.items[index].productCategories[
                this.categoryId
            ];
        return has !== undefined;
    }
}
