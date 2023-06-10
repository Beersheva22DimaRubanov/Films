const PAGE_LIMIT = 500;

export default class FilmsGrid {
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
        this.#parentId =parentId;
        this.#pagesPlace = pagesPlace;
        this.#buildFilmPlace(filmsCardsId);
        this.#buttons = "";
        this.#filmCards =[];
        this.#filmCardCallback = filmCardCallback
    }

    #buildFilmPlace(parentId) {
       const parentElement = document.getElementById(parentId)
        this.#filmsContainer = document.getElementById(parentId)
    }

     fillData(films, imageUrl, callback){
        this.#filmsContainer.innerHTML =  films.map( (film) => this.#createFilmCard(film, imageUrl)).join('');
        this.#currentPage = films.page;
        this.#pages = films.total_pages;
        this.#showPages();
        this.#pagesCallback = callback;
        const parentElement = document.getElementById(this.#filmsCardsId)
        this.#filmCards = parentElement.childNodes;
        this.#filmCardsAddListener();
    }

    #filmCardsAddListener(){
        console.log(typeof this.#filmCards); 
        this.#filmCards.forEach(el => {
            el.addEventListener('click', this.#filmCardHandler.bind(this, (el.id)))
        })
    }

    #filmCardHandler(id){
        document.getElementById(this.#parentId).style.display = "none";
        this.#filmCardCallback(id);
    }

    #showPages(){
        this.#buttons = `<button class ='page-button' value = 1>Go First</button>`;
        let i;
        if(this.#currentPage == this.#pages || this.#currentPage + 10 >= this.#pages){
            i = this.#pages - 10;
        } else{
            i = this.#currentPage;
        }
        // let i = this.#currentPage == this.#pages? this.#pages - 10: this.#currentPage;
        for(i ; i<this.#currentPage + 10 && i <= this.#pages; i++){
            this.#buttons +=  `<button class ='page-button' value ='${i}'>${i}</button>`;
        }
        this.#buttons += `<button class ='page-button' value = ${this.#pages}>...${this.#pages}</button>`
       const parentElement = document.getElementById(this.#pagesPlace);
        parentElement.innerHTML = this.#buttons;
        this.#buttons = parentElement.childNodes;
        this.#addListeners()

    }

    #addListeners(){
        this.#buttons.forEach((b) => {
            b.addEventListener('click', this.#pageHandler.bind(this, (b.value)))
        });
    }

    async #pageHandler(index){
        if(!this.#currentPage == undefined || this.#currentPage != index){
            // this.#buttons[this.#currentPage-1].classList.remove('page-active')
            this.#buttons[index-1].classList.add('page-active');
            index <= 500 ? await  this.#pagesCallback(index): alert(`Please choose page from 1 to ${PAGE_LIMIT}`);
        }
    }

    #createFilmCard(film, imageUrl){
        return `<div class = "film-card" id='${film.id}' data="film-card"> 
                    <img src = "${imageUrl + film.poster_path}" class ="film-card-img"/>
                    <div class ="film-card-title"> ${film.title}</div>
                    <div class = "film-card-date">Year: ${film.release_date.slice(0, 4)}</div>
                </div> `
    }


}