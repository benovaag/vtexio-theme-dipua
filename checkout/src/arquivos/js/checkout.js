import "regenerator-runtime/runtime.js";
import { CheckoutPosition } from "./components/CheckoutPosition";
import { createInputSeach } from "./components/InputSeach";
import { addBagComponent } from "./helpers/addBagComponent";
import { weAreEmptyCartPage } from "./helpers/weArePage";
import { sellerCodeForm } from "./components/sellerCodeForm/index";
import CheckoutUI from "./components/CheckoutUI";
import { alterarTamanhoImagemSrcVtex } from "./helpers/vtexUtils";
import { ButtonContinueShopping } from "./components/buttonContinueShopping";
import { RemoveOldPriceOfProductsThatAreNotOffCategory } from "./components/RemoveOldPriceOfProductsThatAreNotOffCategory";
const vendorSellerCodeForm = new sellerCodeForm();
const buttonContinueShopping = new ButtonContinueShopping();
const removeOldPriceOfProductsThatAreNotOffCategory =
    new RemoveOldPriceOfProductsThatAreNotOffCategory();

document.addEventListener("DOMContentLoaded", () => {
    const checkoutPosition = new CheckoutPosition();
    checkoutPosition.update();
    checkoutPosition.addEvent();
    buttonContinueShopping.init();

    if (weAreEmptyCartPage()) {
        takeCareIfShouldAddInputSeach();
        addBagComponent();
        vendorSellerCodeForm.start();
        removeOldPriceOfProductsThatAreNotOffCategory.start();
    }
    window.addEventListener("orderFormUpdated.vtex", () => {
        setTimeout(() => {
            document.querySelectorAll(".product-image img").forEach(($el) => {
                $el.src = alterarTamanhoImagemSrcVtex($el.src, 80, 120);
            });
        }, 10000);
    });
});

window.addEventListener("hashchange", () => {
    if (weAreEmptyCartPage()) {
        takeCareIfShouldAddInputSeach();
        addBagComponent();
        vendorSellerCodeForm.start();
    }
});

const RenderizaImagemEmAltaQualidade = new CheckoutUI();
RenderizaImagemEmAltaQualidade.init();

function takeCareIfShouldAddInputSeach() {
    const $inputSeach = createInputSeach();
    const $titleEmptyCart = document.querySelector(".empty-cart-title");

    // adiciona o input abaixo do tilo do carrinho
    $titleEmptyCart.after($inputSeach);
}

const faviconURL = "/arquivos/favicon__dipua--transparent.ico";

document.querySelector("link[rel~='icon']").href = faviconURL;
