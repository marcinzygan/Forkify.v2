import iconSvg from '../../img/icons.svg';
export default class View {
  _data = '';

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    const markup = this._generateMarkup();
    if (!render) return markup;

    //remove message from recipe container
    this._clear();
    // dispay recipe
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    // create html markup (document fragment) to compare to old markup
    const newDom = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDom.querySelectorAll('*'));

    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];

      // Updates text
      if (
        !newEl.isEqualNode(curEl) && //Check if newEl is different to curEl
        newEl.firstChild?.nodeValue.trim() !== '' // Check if new element first child contains any text
      ) {
        curEl.textContent = newEl.textContent; // Replece the text content of differnet element for newEl
      }
      //Updates data attributes on buttons
      if (!newEl.isEqualNode(curEl)) {
        //check if attributes on newEl are diffrent from curEl
        Array.from(newEl.attributes).forEach(
          //loop over newEl array and set the curEl attributes to newEl attributes
          attr => curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  renderSpinner() {
    const markup = `
    <div class="spinner">
    <svg>
      <use href="${iconSvg}#icon-loader"></use>
    </svg>
    </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
    <div>
      <svg>
        <use href="${iconSvg}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
    <div>
      <svg>
        <use href="${iconSvg}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
