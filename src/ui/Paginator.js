export default class Paginator {
    #parentId;
    #buttons
    #currentElement
    #pagesCallback

    constructor(parentId) {
        this.#parentId = parentId;
    }

    filldata(pages, currentPage, pagesCallback) {
        this.#pagesCallback = pagesCallback;
        const parentElement = document.getElementById(this.#parentId);
        document.getElementById(this.#parentId).innerHTML = '';
        if (pages) {
            let i;
            if (currentPage == pages || currentPage + 10 >= pages) {
                i = pages - 10;
            } else {
                i = currentPage;
            }
            let pageButtons = `<button class ='page-button' ${i == 1 ? 'disabled' : ''} value = ${i - 1}>prev</button>`;
            pageButtons += `<button class ='page-button' value = 1>Go First</button>`;
            for (i; i < currentPage + 10 && i <= pages; i++) {
                pageButtons += `<button class ='page-button' value ='${i}' id = 'page-${i}'>${i}</button>`;
            }
            pageButtons += `<button class ='page-button' value = ${pages}>...${pages}</button>`
            pageButtons += `<button class ='page-button' value = ${i - 9}>next</button>`
            parentElement.innerHTML = pageButtons;
            this.#buttons = parentElement.childNodes;
            this.#currentElement = document.getElementById(`page-${currentPage}`);

            this.#currentElement.classList.add('page-active');
            this.#addListeners()
        } else {
            parentElement.innerHTML = ''
        }
    }

    #addListeners() {
        this.#buttons.forEach((b) => {
            b.addEventListener('click', this.#pageHandler.bind(this, (b.value)))
        });
    }

    async #pageHandler(value) {
        this.#currentElement.classList.remove('page-active')
        await this.#pagesCallback(value)
    }
}