 export default class FilmInfo{
    #film;
    #parentId;

    constructor(parentId, film){
        this.#film = film;
        this.#parentId = parentId;
    }

    fillData(film, imageUrl){
        document.getElementById("movie-info-place").hidden = false;
        const genres = film.genres.map(s => s.name).split(', ')
        this.#parentId.innerHTML = 
        `<div class='${this.#parentId}-img'>
            <img src = ${imageUrl + film.poster_path}>
        </div>
        <div class = '${this.#parentId}-info-container>
            <div class= '${this.#parentId}-info-title'>${film.title}</div>
            <div class='${this.#parentId}-info-tagline'>${film.tagline}</div>
            <div class ='${this.#parentId}-genres'>${genres}</div>
            <div class='${this.#parentId}-genres'>Release date: ${film.release_date}</div>
            <div class='${this.#parentId}-budget'>Budget: ${film.budget}</div>
            <div class='${this.#parentId}-raiting'>Raiting: ${film.popularity}</div>
            <div class='${this.#parentId}-overview'> Overview: ${film.overview}</div>
        </div>
        <div class='${this.#parentId}-buttons'>
            <button class='film-info-button>Add to favorites</button>
            <button class='film-info-button>Add to watching list</button>
        </div>`
    }
    
}