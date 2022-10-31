export function createInputSeach() {
    // eslint-disable-next-line no-unused-vars
    function handleForm(event) {
        event.preventDefault();
        const { value } = inputSeach__input;
        const { hostname } = window.location;
        const urlRedirect = `https://${hostname}/${value}`;

        window.location.href = urlRedirect;
    }

    const inputString = `
      <form
        class="input-seach__container"
      >
        <input
          id="inputSeach__input"
          type="search"
          autocomplete="on"
          autofocus
          class="input-seach__input"
          placeholder="Digite sua busca"
          required
        />
        <input
          type="button"
          class="input-seach__button"
        />

      </form>
      `;

    let parser = new DOMParser();
    let $document = parser.parseFromString(inputString, "text/html");
    let $input = $document.body.firstChild;
    $input.addEventListener("submit", handleForm);

    return $input;
}
