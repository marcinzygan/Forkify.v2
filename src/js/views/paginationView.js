import View from './View.js';
import iconSvg from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      console.log(e);

      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = Number(btn.dataset.goto);
      console.log(goToPage);
      handler(goToPage);
    });
  }
  _generateMarkup() {
    console.log(this._data);
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    // Page 1 and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `<button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                <use href="${iconSvg}#icon-arrow-right"></use>
                </svg>
            </button>
                `;
    }

    //Last page
    if (currentPage === numPages && numPages > 1) {
      return `<button data-goto="${
        currentPage - 1
      } "class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${iconSvg}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>`;
    }

    //Other page
    if (currentPage < numPages) {
      return `<button data-goto="${
        currentPage - 1
      }"class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${iconSvg}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
                </button>
                <button  data-goto="${
                  currentPage + 1
                }"class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                <use href="${iconSvg}#icon-arrow-right"></use>
                </svg>
            </button>
                `;
    }

    //Page 1 and no other pages
    return '';
  }
}

export default new PaginationView();
