
export default class MoviesGrid {
    #pages;
    #filmsContainer;
    #currentPage;
    #buttons
    #pagesCallback
    #filmCardCallback
    #filmCards;
    #parentId
    #filmsCardsId;
    #pagesPlace;


    constructor(parentId, filmsCardsId, filmCardCallback, pagesPlace) {
        this.#filmsCardsId = filmsCardsId;
        this.#parentId = parentId;
        this.#pagesPlace = pagesPlace;
        this.#buildFilmPlace(filmsCardsId);
        this.#buttons = "";
        this.#filmCards = [];
        this.#filmCardCallback = filmCardCallback
    }

    #buildTitle(title){
        return `<h2 class = 'page-title'>${title}</h2>`
    }

    #buildFilmPlace(parentId) {
        const parentElement = document.getElementById(parentId)
        this.#filmsContainer = document.getElementById(parentId)
    }

    fillData(films, imageUrl, title, pagesCallback, pages, page) {
        document.getElementById(`${this.#parentId}-title`).innerHTML = this.#buildTitle(title) 
        this.#filmsContainer.innerHTML = films.map((film) => this.#createFilmCard(film, imageUrl)).join('');
        this.#currentPage = page;
        this.#pages = pages;
        this.#showPages();
        this.#pagesCallback = pagesCallback;
        const parentElement = document.getElementById(this.#filmsCardsId)
        this.#filmCards = parentElement.childNodes;
        this.#filmCardsAddListener();
    }

    removeEverithyng(){
        this.#filmsContainer.innerHTML = '';
        document.getElementById(this.#pagesPlace).innerHTML='';
        document.getElementById(`${this.#parentId}-title`).innerHTML='';
    }

    #filmCardsAddListener() {
        console.log(typeof this.#filmCards);
        this.#filmCards.forEach(el => {
            el.addEventListener('click', this.#filmCardHandler.bind(this, (el.id)))
        })
    }

    #filmCardHandler(id) {
        document.getElementById(this.#parentId).style.display = "none";
        this.#filmCardCallback(id);
    }


    #showPages() {
        document.getElementById(this.#pagesPlace).innerHTML='';
        if (this.#pages) {
            
            let i;

            if (this.#currentPage == this.#pages || this.#currentPage + 10 >= this.#pages) {
                i = this.#pages - 10;
            } else {
                i = this.#currentPage;
            }
            let pageButtons = `<button class ='page-button' ${i == 1 ? 'disabled' : ''} value = ${i - 1}>prev</button>`;
            pageButtons += `<button class ='page-button' value = 1>Go First</button>`;
            for (i; i < this.#currentPage + 10 && i <= this.#pages; i++) {
                pageButtons += `<button class ='page-button' value ='${i}' id = 'page-${i}'>${i}</button>`;
            }
            pageButtons += `<button class ='page-button' value = ${this.#pages}>...${this.#pages}</button>`
            pageButtons += `<button class ='page-button' value = ${i - 9}>next</button>`
            const parentElement = document.getElementById(this.#pagesPlace);
            parentElement.innerHTML = pageButtons;
            this.#buttons = parentElement.childNodes;
            document.getElementById(`page-${this.#currentPage}`).classList.add('page-active');
            this.#addListeners()
        }
    }

    #addListeners() {
        this.#buttons.forEach((b) => {
            b.addEventListener('click', this.#pageHandler.bind(this, (b.value)))
        });
    }

    async #pageHandler(index) {

        this.#buttons[this.#currentPage - 1].classList.remove('page-active')
        await this.#pagesCallback(index)

    }

    #createFilmCard(film, imageUrl) {
        return `<div class = "film-card" id='${film.id}' data="film-card"> 
                    <img src = "${imageUrl + film.poster_path}" class ="film-card-img"/>
                    <div class ="film-card-title"> ${film.title}</div>
                    <div class = "film-card-date">Year: ${film.release_date.slice(0, 4)}</div>
                </div> `
    }


}