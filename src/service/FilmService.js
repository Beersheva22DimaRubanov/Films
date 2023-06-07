
export default class FilmService{
    #apiKey;
    #baseUrl;

    constructor(baseUrl, apiKey){
        this.#apiKey = apiKey;
        this.#baseUrl = baseUrl;
    }

    async  getPopularFilms( filmsType, page){
        return this.#getFilms(page, filmsType)
    }

    async getNowPlayingFilms(page, filmsType){
        return this.#getFilms(page, filmsType);
    }

    async #getFilms(page, filmsType){
        const response = await fetch(this.#baseUrl + filmsType + page + this.#apiKey);
        // const jsonRes = await response.json();
        return  response.json();
    }




}