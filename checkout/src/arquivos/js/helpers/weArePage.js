export function weAreEmptyCartPage() {
    const currentUrl = window.location.href;
    return currentUrl.includes("/cart");
}

export function weArePaymentPage() {
    const currentUrl = window.location.href;
    return currentUrl.includes("/payment");
}
