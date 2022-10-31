export class ProductMessageController {
    create(productName, isDesktop = true) {
        this.active = false;
        this.productName = productName;
        this.isDesktop = isDesktop;
        let messageButton = document.createElement("button");
        messageButton.classList.add(
            "checkout__specialButton",
            "sendMessageButton"
        );
        messageButton.innerHTML = "Enviar Mensagem";
        messageButton.id = this.productName;
        if (!isDesktop) {
            messageButton.classList.add("mobileMessageButton");
        }
        messageButton.onclick = this.addMessage.bind(this);

        let wasSent = sessionStorage.getItem(this.productName);
        if (wasSent) {
            messageButton.classList.add("disabledButton");
            messageButton.innerHTML = "Mensagem Adicionada";
            messageButton.disabled = true;
        }

        return messageButton;
    }

    addMessage(event) {
        this.active = !this.active;

        if (this.active) {
            event.target.classList.add("activeMessage");

            //Cria linha da table
            let tr = document.createElement("tr");
            tr.classList.add("messageRow");

            //Cria table data da linha
            let td = document.createElement("td");
            td.setAttribute("colspan", "100%");

            //Cria container do title e remove button
            let divTitleContainer = document.createElement("div");
            divTitleContainer.classList.add("titleContainer");

            //Cria titulo do field
            let divTitle = document.createElement("div");
            divTitle.classList.add("messageTitle");
            divTitle.innerText = "Mensagem para o (a) presenteado (a)";

            //Cria remove button
            let removeButton = document.createElement("button");
            removeButton.innerText = "Excluir serviço";
            removeButton.classList.add("removeButton");
            removeButton.id = `removeMessage${this.productName}`;
            removeButton.onclick = this.removeMessageRow.bind(this);

            //Cria o campo de input da mensagem
            let input = document.createElement("textarea");
            input.classList.add("messageInput");
            input.placeholder = "Digite sua mensagem";

            //Cria botão de salvar mensagem no orderForm
            let saveMessageButton = document.createElement("button");
            saveMessageButton.innerText = "Adicionar Mensagem";
            saveMessageButton.classList.add("saveButton");
            saveMessageButton.onclick = this.addMessageIntoOrderForm.bind(this);

            //Adiciona os elementos criados na DOM
            tr.insertAdjacentElement("beforeend", td);

            td.insertAdjacentElement("beforeend", divTitleContainer);
            td.insertAdjacentElement("beforeend", input);
            td.insertAdjacentElement("beforeend", saveMessageButton);

            divTitleContainer.insertAdjacentElement("beforeend", divTitle);
            divTitleContainer.insertAdjacentElement("beforeend", removeButton);

            if (this.isDesktop) {
                let product = this.findEventElementByClassName(
                    event,
                    "product-item"
                );
                product.insertAdjacentElement("afterend", tr);
            } else {
                document
                    .getElementById(this.productName)
                    .insertAdjacentElement("afterend", tr);
            }
        } else {
            event.target.classList.remove("activeMessage");
            let closeButton = document.getElementById(
                `removeMessage${this.productName}`
            );
            closeButton.click();
        }
    }

    removeMessageRow(event) {
        let row = this.findEventElementByClassName(event, "messageRow");
        if (row) {
            row.remove();
        }

        document
            .getElementById(this.productName)
            .classList.remove("activeMessage");

        this.active = false;
    }

    findEventElementByClassName(evento, classe) {
        let path =
            evento.path || (evento.composedPath && evento.composedPath());
        return path.find((element) => element.classList.contains(classe));
    }

    async addMessageIntoOrderForm(event) {
        let row = this.findEventElementByClassName(event, "messageRow");

        let message = row.getElementsByClassName("messageInput")[0].value;

        let key = `Mensagem do produto ${this.productName}: `;
        message = `${key}${message}`;

        let orderForm = await vtexjs.checkout.getOrderForm();
        let openTextField = orderForm.openTextField;

        if (openTextField && openTextField.value) {
            openTextField = openTextField.value;
            openTextField = openTextField.replace("Sem mensagem inserida", "");
            openTextField = openTextField.split("||");
            openTextField = openTextField.filter(
                (message) => !message.includes(key)
            );
            openTextField.push(message);
            openTextField = openTextField
                .filter((msg) => msg !== "")
                .join("||");
        } else {
            openTextField = message;
        }

        await vtexjs.checkout.sendAttachment("openTextField", {
            value: openTextField,
        });

        let buttonToDisabled = document.getElementById(this.productName);
        buttonToDisabled.innerText = "Mensagem Adicionada";
        buttonToDisabled.classList.add("disabledButton");
        buttonToDisabled.setAttribute("disabled", true);

        sessionStorage.setItem(this.productName, "true");
    }
}
