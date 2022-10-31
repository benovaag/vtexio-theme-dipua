import { espereElementoExistir } from "./esperaElementoExistir";
import { formatBrazilianCurrency } from "./formatBrazilianCurrency";
import { BotaoEmbagalagemContexto } from "../components/BotaoEmbagalagemContexto";
import { ProductMessageController } from "../components/productMessageController";
// import waitForEl from "./waitForEl";
/**
 *
 * @param {Element} $element
 * @param {Function} callback
 */

/* function observe($element, callback) {
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
} */

export async function addBagComponent() {
    await espereElementoExistir({
        seletorCss: ".table.cart-items .product-item",
    });

    const bagComponent = new BagComponent();
    bagComponent.addButton();
    bagComponent.addCloseEventToBagList();
    bagComponent.renderPackingList();
    bagComponent.adjustPositionBagList();
    bagComponent.reder();
    bagComponent.handlePackaging();
    bagComponent.addEventRemoveItemCart();
    bagComponent.verifyIfHaveMessage();
}
class BagComponent {
    constructor() {
        this.button = this.createButton();
        this.bagList = document.querySelector("#checkout-packaging");
        this.nameContainerList = document.querySelector("td.product-name");
        this.classHideElement = "checkout-packaging__container--hidden";
        this.idlist = this.getPackageIds();
        this._containerVisible = false;
        this._itensComSacola = [];
        this.selerID = undefined;
        this.skuID = undefined;
        this.nomesDeSacolas = [];
        this.sacolaTemEvento = false;
        this.timer = 0;
    }

    /**
     * @param {HTMLElement} elemento
     * @param {string} CssSelector
     * @return {boolean}
     */
    verificaSeBotaoExiste(elemento, CssSelector) {
        const element = elemento.querySelector(CssSelector);
        const elementoExiste = element ? true : false;
        return elementoExiste;
    }

    get itensComSacola() {
        return this._itensComSacola;
    }

    set itensComSacola(itens) {
        this._itensComSacola = itens;
        const notas = document.querySelector("#cart-note");
        notas.innerHTML = itens.join(", ");
        const totalItens = itens.length;

        (async () => {
            // await this.removeBagToCart();
            // if (totalItens) {
            //     window.vtexjs.checkout.addToCart([
            //         {
            //             id: this.skuID,
            //             quantity: totalItens,
            //             seller: this.selerID,
            //         },
            //     ]);
            // }

            const orderForm = await vtexjs.checkout.getOrderForm();

            const posicaoDaSacola = orderForm.items.findIndex(
                (itemCarrinho) => {
                    return itemCarrinho.id == this.skuID;
                }
            );
            if (posicaoDaSacola > -1) {
                const itemsToUpdate = [
                    {
                        index: posicaoDaSacola,
                        quantity: totalItens,
                    },
                ];
                await vtexjs.checkout.updateItems(itemsToUpdate);
            } else {
                window.vtexjs.checkout.addToCart([
                    {
                        id: this.skuID,
                        quantity: totalItens,
                        seller: this.selerID,
                    },
                ]);
            }
        })();
    }

    async adjustQuantityCart() {
        let quantityItens = 0;

        const orderForm = await vtexjs.checkout.getOrderForm();

        const posicaoDaSacola = orderForm.items.findIndex((itemCarrinho) => {
            return itemCarrinho.id == this.skuID;
        });

        this.itensComSacola.forEach((itemName) => {
            let foundItem = orderForm.items.find(
                (item) => item.name === itemName
            );
            if (foundItem) {
                quantityItens += foundItem.quantity;
            }
        });

        if (quantityItens) {
            if (posicaoDaSacola > -1) {
                const itemsToUpdate = [
                    {
                        index: posicaoDaSacola,
                        quantity: quantityItens,
                    },
                ];
                await vtexjs.checkout.updateItems(itemsToUpdate);
            } else {
                window.vtexjs.checkout.addToCart([
                    {
                        id: this.skuID,
                        quantity: quantityItens,
                        seller: this.selerID,
                    },
                ]);
            }
        }
    }

    async handlePackaging() {
        await espereElementoExistir({
            seletorCss: `tr[data-sku="${this.idlist[0]}"]`,
            tempoMaximo: 30 * 1000,
        });
        const reloginho = setTimeout(() => {
            const $sacola = document.querySelector(
                `tr[data-sku="${this.idlist[0]}"]`
            );
            if (!$sacola) return;

            if ($sacola.classList.contains("sacolaTemEvento")) return;

            const THIS = this;
            const $botaoRemoverTodasSacola =
                $sacola.querySelector(".item-link-remove");
            $botaoRemoverTodasSacola.addEventListener("click", () => {
                THIS.itensComSacola = [];
            });

            $sacola.classList.add("sacolaTemEvento");
        }, 500);

        reloginho;
    }

    get containerVisible() {
        return this._containerVisible;
    }

    /**
     * @param {boolean} estado
     */

    set containerVisible(estado) {
        this._containerVisible = estado;
        this.bagList.classList.toggle(this.classHideElement, !estado);

        const botoesAtivos = document.querySelectorAll(
            ".checkout__specialButton--active"
        );

        for (const botao of botoesAtivos) {
            botao.classList.remove("checkout__specialButton--active");
        }
    }

    reder() {
        const a = this.addButton.bind(this);
        const $table = document.querySelector(".table.cart-items");
        const mutationObserverConfig = {
            attributes: true,
            characterData: true,
            childList: false,
            subtree: true,
            attributeOldValue: false,
            characterDataOldValue: false,
        };

        window.addEventListener("resize", a);
        const THIS = this;
        const mutationObserver = new MutationObserver(() => {
            a();
            THIS.handlePackaging();
        });

        mutationObserver.observe($table, mutationObserverConfig);

        return this;
    }

    addButton() {
        const width = window.innerWidth;
        const widthMobileInPX = 640;

        if (width >= widthMobileInPX) {
            const $containersNomesProdutos =
                document.querySelectorAll("td.product-name");
            for (const $containerNomeProduto of $containersNomesProdutos) {
                const productMessageController = new ProductMessageController();
                const $tr = $containerNomeProduto.parentElement;
                const nomeProduto =
                    $tr.querySelector(".product-name a").innerHTML;
                const botaoJaExiste = this.verificaSeBotaoExiste(
                    $tr,
                    ".checkout__specialButton"
                );

                if (this.checaNomeDoProduto(nomeProduto)) continue;

                if (botaoJaExiste) {
                    const a = $tr.querySelector(".checkout__specialButton");
                    const jaTaComClasse = a.classList.contains(
                        "checkout__specialButton--active"
                    );

                    if (!jaTaComClasse && this.nomeEstaNaDoc(nomeProduto)) {
                        a.classList.add("checkout__specialButton--active");
                    }
                    continue;
                }

                $containerNomeProduto.append(this.createButton(nomeProduto));
                $containerNomeProduto.append(
                    productMessageController.create(nomeProduto)
                );
            }
            return;
        }
        // const productMessageController = new ProductMessageController();
        const $containersProdutos =
            document.querySelectorAll("tr.product-item");

        $containersProdutos.forEach(($containerProduto, index) => {
            const productMessageController = new ProductMessageController();
            const existe = $containerProduto.nextElementSibling;
            const nomeProduto =
                $containerProduto.querySelector(".product-name a").innerHTML;

            if (index === $containersProdutos.length - 1) {
                if (!this.nomesDeSacolas.includes(nomeProduto) && !existe) {
                    $containerProduto.after(
                        productMessageController.create(nomeProduto, false)
                    );
                    $containerProduto.after(this.createButton(nomeProduto));
                }
            }

            if (!existe) return;
            if (existe.classList.contains("checkout__specialButton")) return;

            $containerProduto.after(
                productMessageController.create(nomeProduto, false)
            );
            $containerProduto.after(this.createButton(nomeProduto));
        });
    }

    checaNomeDoProduto(nome) {
        return this.nomesDeSacolas.find((aaa) => {
            const regex = new RegExp(nome, "ig");
            return regex.test(aaa);
        });
    }

    adjustPositionBagList() {
        const $element = document.querySelector("div.row-fluid.summary");
        // adiciona bagList com primeiro filho do elemento
        $element.insertBefore(this.bagList, $element.firstChild);

        return this;
    }

    createButton(nomeProduto) {
        const botaoContexto = new BotaoEmbagalagemContexto(nomeProduto);
        const THIS = this;
        const { $button } = botaoContexto;
        $button.addEventListener("click", (e) => {
            THIS.addClassActiveButton(e, botaoContexto);

            if (!this.nomeEstaNaDoc(nomeProduto)) {
                document
                    .querySelector(".checkout-packaging-item__input")
                    .click();

                this.updateCustomDataOrderForm(this.itensComSacola);
            } else {
                this.removeNomeDoProdutoDaLista(nomeProduto);

                this.updateCustomDataOrderForm(this.itensComSacola);
            }
        });

        if (this.nomeEstaNaDoc(nomeProduto)) {
            $button.classList.add("checkout__specialButton--active");
        } else {
            $button.classList.remove("checkout__specialButton--active");
        }

        return $button;
    }
    nomeEstaNaDoc(nome) {
        if (!this.itensComSacola) return false;

        return this.itensComSacola.includes(nome);
    }

    addClassActiveButton(e, pimba) {
        const { target } = e;
        const temClasseAtivo = target.matches(
            ".checkout__specialButton--active"
        );
        if (
            !this.containerVisible ||
            (!pimba.ativo && temClasseAtivo && this.containerVisible) ||
            (!pimba.ativo && !temClasseAtivo && this.containerVisible) ||
            (pimba.ativo && !temClasseAtivo && this.containerVisible)
        ) {
            this.bagList.dataset.nome = pimba.nomeProduto;
            this.showListOfBags();

            const taNaLista = pimba.nomeProduto.includes(pimba.nomeProduto);
            this.bagList.checked = taNaLista;
        } else {
            this.bagList.dataset.nome = "";
            this.hiddenListOfBags();
        }

        const existe = this.nomeEstaNaDoc(pimba.nomeProduto);
        this.bagList.querySelector(".checkout-packaging-item__input").checked =
            existe;
        if (existe)
            this.bagList.querySelector(".checkout-packaging__button").click();

        if (pimba.ativo && !temClasseAtivo) {
            pimba.ativo = true;
        } else {
            pimba.ativo = !pimba.ativo;
        }

        target.classList.toggle("checkout__specialButton--active", pimba.ativo);
    }

    removeClassActiveButton() {
        this.button.classList.remove("checkout__specialButton--active");
    }

    showListOfBags() {
        this.containerVisible = true;
    }

    hiddenListOfBags() {
        this.containerVisible = false;
    }

    createPackaging({ productName, price, imageUrl, sellersId, productId }) {
        this.nomesDeSacolas.push(productName);
        // Container
        const $li = document.createElement("li");
        $li.classList.add("checkout-packaging-item");
        // image
        const $img = document.createElement("img");
        $img.src = imageUrl;
        $img.classList.add("checkout-packaging-item__image");
        // name
        const $h3 = document.createElement("h3");
        $h3.classList.add("checkout-packaging-item__title");
        $h3.innerHTML = productName;
        // price
        const $p = document.createElement("p");
        $p.classList.add("checkout-packaging-item__price");
        $p.innerHTML = price;
        // input wrapper
        const $inputWrapper = document.createElement("div");
        $inputWrapper.classList.add("checkout-packaging-item__input-wrapper");
        // input
        const $input = document.createElement("input");
        $input.classList.add("checkout-packaging-item__input");
        $input.type = "radio";
        $input.name = "embalagem";
        $input.value = productId;
        const THIS = this;

        $input.addEventListener("click", (e) => {
            THIS.addPackagingToBag(e, {
                id: productId,
                seller: sellersId,
            });
        });

        $inputWrapper.append($input);
        $li.append($inputWrapper);
        $li.append($img);
        $li.append($h3);
        $li.append($p);
        return $li;
    }

    async addPackagingToBag(e, { id, seller }) {
        const target = e.target;
        const nome = this.bagList.dataset.nome;

        const nomeTaNaLista = this.nomeEstaNaDoc(nome);
        this.selerID = seller;
        this.skuID = id;

        if (nomeTaNaLista) {
            target.checked = false;
            this.itensComSacola = this.itensComSacola.filter(
                (item) => item !== nome
            );
        } else {
            target.checked = true;
            this.itensComSacola = [...this.itensComSacola, nome];
        }
    }

    async renderPackingList() {
        const $ul = this.bagList.querySelector("ul");

        for (let embalagem of this.idlist) {
            const resp = await this.getPackagingInformation(embalagem);

            if (!resp) continue;
            const $li = this.createPackaging(resp);
            $ul.append($li);
        }
        await this.pegaProdutosComSacola();

        return this;
    }

    async hasPackaging() {
        const orderForm = await vtexjs.checkout.getOrderForm();
        const items = orderForm.items;
        const hasPackaging = items.some((item) => {
            return this.idlist.includes(item.id);
        });
        return hasPackaging;
    }

    async removeBagToCart() {
        const posicaoDaSacola = vtexjs.checkout.orderForm.items.findIndex(
            (itemCarrinho) => {
                return itemCarrinho.id == this.skuID;
            }
        );

        if (posicaoDaSacola > -1) {
            const itemsToRemove = [
                {
                    index: posicaoDaSacola,
                    quantity: 0,
                },
            ];
            return await vtexjs.checkout.removeItems(itemsToRemove);
        }
        return false;
    }

    addCloseEventToBagList() {
        const $button = this.bagList.querySelector("button");
        $button.addEventListener("click", this.hiddenListOfBags.bind(this));
        $button.addEventListener(
            "click",
            this.removeClassActiveButton.bind(this)
        );

        return this;
    }

    getPackageIds() {
        const htmlTagName = "listaidsembalagens";
        const $idlist = document.querySelector(htmlTagName);
        const idlist = $idlist.innerHTML.replace(/\s/g, "").split(",");
        return idlist;
    }

    async getPackagingInformation(id) {
        const url = `/giftbagapi/id${id}`;

        try {
            let produto = await (
                await fetch(url, {
                    method: "GET",
                    headers: { Accept: "application/json" },
                })
            ).json();
            produto = produto.data;

            const price = 0;
            const imageUrl = produto.ImageUrl;
            const sellersId = produto.SkuSellers[0].SellerId;

            return {
                productName: produto.NameComplete.toLowerCase(),
                price: formatBrazilianCurrency(price),
                imageUrl,
                sellersId,
                productId: id,
            };
        } catch (error) {
            return null;
        }
    }

    removeNomeDoProdutoDaLista(nomeProduto) {
        this.itensComSacola = this.itensComSacola.filter(
            (itemName) => itemName !== nomeProduto
        );
    }

    async updateCustomDataOrderForm(customFieldsData) {
        const orderForm = await vtexjs.checkout.getOrderForm();
        const orderFormId = orderForm.orderFormId;
        const appName = "itenswithgiftbag";
        const appFieldName = "itensName";

        // await this.limparOrderFormCustomData(
        //     orderFormId,
        //     appName,
        //     appFieldName
        // );

        const apiBody = {
            expectedOrderFormSections: [
                "items",
                "gifts",
                "totalizers",
                "clientProfileData",
                "shippingData",
                "paymentData",
                "sellers",
                "messages",
                "marketingData",
                "clientPreferencesData",
                "storePreferencesData",
                "customData",
            ],
            value: JSON.stringify(customFieldsData),
        };

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(apiBody),
        };

        const res = await fetch(
            "/api/checkout/pub/orderForm/" +
                orderFormId +
                "/customData/" +
                appName +
                "/" +
                appFieldName,
            options
        );

        const data = await res.json();
        console.log(data);
    }

    async limparOrderFormCustomData(orderFormId, appName, appFieldName) {
        console.log("LIMPOU");
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        const res = await fetch(
            "/api/checkout/pub/orderForm/" +
                orderFormId +
                "/customData/" +
                appName +
                "/" +
                appFieldName,
            options
        );

        const data = await res.json();
        console.log(data);
    }

    async pegaProdutosComSacola() {
        const orderForm = await vtexjs.checkout.getOrderForm();
        console.log("orderform", orderForm);
        let itensWithGiftBag = [];
        if (orderForm && orderForm.customData) {
            itensWithGiftBag = JSON.parse(
                orderForm.customData.customApps[0].fields.itensName
            );

            console.log("itensWithGiftBag", itensWithGiftBag);
        }

        const itens = Array.from(
            document.getElementsByClassName("product-item")
        );

        if (itens) {
            itens.forEach((item) => {
                let itemName = item
                    .getElementsByClassName("product-name")[0]
                    .getElementsByTagName("a")[0].innerText;

                if (
                    itemName &&
                    itensWithGiftBag.find((name) => name === itemName)
                ) {
                    item.getElementsByClassName(
                        "checkout__specialButton--bag"
                    )[0].click();
                }
            });
        }
    }

    addEventRemoveItemCart() {
        const closeButtons = Array.from(
            document.querySelectorAll("table.cart-items tbody")
        )[0];

        closeButtons.addEventListener("click", (e) => {
            if (e.target.getAttribute("class") === "item-link-remove") {
                let path = e.path || (e.composedPath && e.composedPath());
                let productName =
                    path[2].children[1].firstElementChild.innerText;
                setTimeout(() => {
                    this.removeNomeDoProdutoDaLista(productName);
                    this.updateCustomDataOrderForm(this.itensComSacola);
                }, 1250);
            }
        });
    }

    async verifyIfHaveMessage() {
        let orderForm = await vtexjs.checkout.getOrderForm();
        let openTextField = orderForm.openTextField;

        if (
            !openTextField ||
            !openTextField.value ||
            openTextField.value === ""
        ) {
            await vtexjs.checkout.sendAttachment("openTextField", {
                value: "Sem mensagem inserida",
            });
        }
    }
}
