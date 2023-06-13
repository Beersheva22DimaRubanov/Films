
export default class MoviesGrid {
    #filmsContainer;
    #filmCardCallback
    #filmCards;
    #parentId
    #filmsCardsId;


    constructor(parentId, filmsCardsId, filmCardCallback) {
        this.#filmsCardsId = filmsCardsId;
        this.#parentId = parentId;
        this.#buildFilmPlace(filmsCardsId);
        this.#filmCards = [];
        this.#filmCardCallback = filmCardCallback
    }

    #buildTitle(title){
        let res;
        title? res =`<h2 class = 'page-title'>${title}</h2>`: res = ''
        return res;
    }

    #buildFilmPlace(parentId) {
        const parentElement = document.getElementById(parentId)
        this.#filmsContainer = document.getElementById(parentId)
    }

    fillData(films, imageUrl, title) {
        document.getElementById(`${this.#parentId}-title`).innerHTML = this.#buildTitle(title) 
        this.#filmsContainer.innerHTML = films.map((film) => this.#createFilmCard(film, imageUrl)).join('');
        const parentElement = document.getElementById(this.#filmsCardsId)
        this.#filmCards = parentElement.childNodes;
        this.#filmCardsAddListener();
    }

    removeEverithyng(){
        this.#filmsContainer.innerHTML = '';
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


    #createFilmCard(film, imageUrl) {
        const defaultImg = '../img/noImage.png'
        return `<div class = "film-card" id='${film.id}' data="film-card"> 
                    <img src = ${film.poster_path != null? imageUrl + film.poster_path: './src/img/noImage.png'} class ="film-card-img"/>
                    <div class ="film-card-title"> ${film.title}</div>
                    <div class = "film-card-date">Year: ${film.release_date.slice(0, 4)}</div>
                </div> `
    }


}