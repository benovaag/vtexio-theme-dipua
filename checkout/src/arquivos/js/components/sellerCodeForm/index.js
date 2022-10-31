/* eslint-disable no-debugger */
/* eslint-disable prettier/prettier */
/**
 * @class sellerCodeForm
 *
 * @description class reponsible for rendering and doing the whole process of adding or removing vendor code
 *
 * @author Marlon Passos
 */

const BUTTON_CLASS = ".sellerCodeForm__button";

import { espereElementoExistir } from "../../helpers/esperaElementoExistir";
import { elementHtmlString } from "./elementHtmlString";

export class sellerCodeForm {
    constructor() {
        this._showInput = true;
        this.$form = this.createElement();
        this.$input = this.$form.querySelector(".sellerCodeForm__input");
        this.$buttom = this.$form.querySelector(BUTTON_CLASS);
        this.$result = this.$form.querySelector(".sellerCodeForm__result");
        this.showInput = true;
    }
    async start() {

        await espereElementoExistir({
           seletorCss: ".table.cart-items .product-item",
        })

        const registeredCode = this.getRegisteredCode();
        this.render();
        this.showInput = (registeredCode === null || registeredCode === undefined || registeredCode === "");
        this.$result.innerText = registeredCode||"";

    }

    getRegisteredCode() {
        if (!vtexjs.checkout.orderForm.marketingData) return null;
        return vtexjs.checkout.orderForm.marketingData.utmiCampaign;
    }

    render() {
        const $cupomContainer = document.querySelector(
            ".totalizers.summary-totalizers.cart-totalizers"
        );
        $cupomContainer.prepend(this.$form);
    }

    createElement() {
        let parser = new DOMParser();
        let $document = parser.parseFromString(elementHtmlString, "text/html");
        let $buttom = $document.querySelector(BUTTON_CLASS);
        $buttom.addEventListener("click", this.handleButton.bind(this));

        return $document.body.firstChild;
    }

    handleButton() {
        if (this.showInput) {
            if (!this.inputIsValid()) return;
            this.handleAddCoupon();
        } else {
            this.handleRemoveCoupon();
        }
    }

    inputIsValid() {
        return this.$input.value.length > 0;
    }

    async handleAddCoupon() {
        const code = this.getCode();
        const response = await this.sendSellerCode(code);
        if (!response.ok) return;
        this.$result.innerText = code;
        this.showInput = false;
    }

    async handleRemoveCoupon() {
        const response = await this.sendSellerCode(null);
        if (!response.ok) return;
        this.$input.value = "";
        this.showInput = true;
    }

    getCode() {
        return this.$input.value;
    }

    async sendSellerCode(code) {
        const orderFormId = vtexjs.checkout.orderForm.orderFormId;
        let coupon;
        if (vtexjs.checkout.orderForm.marketingData == null) {
            coupon = null
        }
        else {
            coupon = vtexjs.checkout.orderForm.marketingData.coupon;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                utmSource: null,
                utmMedium: null,
                utmCampaign: null,
                utmipage: null,
                utmiPart: null,
                coupon: coupon,
                utmiCampaign: code,
                marketingTags: ["vtexSocialSelling"],
            }),
            method: "POST",
        };
        const url = `/api/checkout/pub/orderForm/${orderFormId}/attachments/marketingData`;

        const response = await fetch(url, config);
        return response;
    }

    get showInput() {
        return this._showInput;
    }

    set showInput(state) {
        this._showInput = state;
        this.$form.classList.toggle(
            "sellerCodeForm__container--result",
            !state
        );
        this.$input.classList.toggle("sellerCodeForm__input--hidden", !state);
        this.$result.classList.toggle("sellerCodeForm__result--hidden", state);
        this.$buttom.value = state ? "adicionar" : "remover";
    }
}
