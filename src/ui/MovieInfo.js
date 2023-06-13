export default class MovieInfo {
    #parentId;
    #buttons;
    #homePage;
    #signIn
    #userId
    #addFilmToUser;
    #filmId

    constructor(parentId, homepage, addFilmToUser) {
        this.#buttons = [];
        this.#parentId = parentId;
        this.#homePage = homepage;
        this.#signIn = false;
        this.#addFilmToUser = addFilmToUser;
       
    }

    fillData(film, imageUrl , isFavorite, isWatching) {
        this.#filmId = film.id;
        document.getElementById("movie-info-place").style.display = 'flex';
        const genres = film.genres.map(s => s.name);
        const parentElement = document.getElementById(this.#parentId)
        parentElement.innerHTML = `<div class='${this.#parentId}-img'>
            <img src = '${film.poster_path != null ? imageUrl + film.poster_path: './src/img/noImage.png'}'>
        </div>
        <div class = '${this.#parentId}-container'>
            <h1 class= '${this.#parentId}-title'>${film.title}</h1>
            <h3 class='${this.#parentId}-tagline'>${film.tagline}</h3>
            <div class ='${this.#parentId}-genres'>${genres}</div>
            <div class='${this.#parentId}-genres'>Release date: ${film.release_date}</div>
            <div class='${this.#parentId}-budget'>Budget: ${film.budget}</div>
            <div class='${this.#parentId}-raiting'>Raiting: ${film.popularity}</div>
            <div class='${this.#parentId}-overview'> Overview: ${film.overview}</div>
            <div id='${this.#parentId}-buttons'>
            <button id ='${this.#parentId}-favoriteList-add-btn' class='${this.#parentId}-button' 
            value ='favoriteList' ${!this.#signIn ? 'disabled' : ''} ${isFavorite? 'hidden': ''}>Add to favorites</button>
            <button id ='${this.#parentId}-favoriteList-remove-btn'  class='${this.#parentId}-button' 
            value ='favoriteList' ${isFavorite? '': 'hidden'}>Remove from favorites</button>
            <button id ='${this.#parentId}-watchingList-add-btn'  class='${this.#parentId}-button' 
            value ='watchingList' ${!this.#signIn ? 'disabled' : '' } ${isWatching? 'hidden': ''}>Add to watching list</button>
            <button id ='${this.#parentId}-watchingList-remove-btn' class='${this.#parentId}-button' 
            value ='watchingList' ${isWatching? '': 'hidden'}>Remove from watching list</button>
            <button class='${this.#parentId}-button' value ='back'>Back to films</button>
        </div>
        </div>`;
        this.#buttons = document.getElementById(`${this.#parentId}-buttons`).childNodes;
        this.#addListeners();
    }

    #addListeners() {
        this.#buttons.forEach((b) => b.addEventListener('click',
            this.#handler.bind(this, (b.value))));
    }

    #handler(value) {
        if (value == 'back') {
            document.getElementById(this.#parentId).style.display = 'none';
            document.getElementById(this.#homePage).style.display = 'flex';
        } else {
            this.#addFilmToUser(this.#userId, this.#filmId, value);
            const addbutton = document.getElementById(`${this.#parentId}-${value}-add-btn`);
            const removebutton = document.getElementById(`${this.#parentId}-${value}-remove-btn`);
            addbutton.hidden?  addbutton.hidden = false: addbutton.hidden = true;
            removebutton.hidden? removebutton.hidden = false: removebutton.hidden = true;
        }

    }

    signIn(state, userId) {
        this.#signIn = state;
        this.#userId = userId;
    }

    logout(state) {
        this.#signIn = state;
    }

}