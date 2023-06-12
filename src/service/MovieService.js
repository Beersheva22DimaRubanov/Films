
export default class MovieService{
    #apiKey;
    #baseUrl;
    #jsonUrl
    #genresUrl
    #searchUrl

    constructor(baseUrl, apiKey, jsonUrl, genresUrl, searchUrl){
        this.#apiKey = apiKey;
        this.#baseUrl = baseUrl;
        this.#jsonUrl = jsonUrl;
        this.#genresUrl = genresUrl;
        this.#searchUrl = searchUrl;
    }

    async  getPopularFilms( filmsType, page){
        return this.#getMovies(page, filmsType)
    }

    async getNowPlayingFilms(page, filmsType){
        return this.#getMovies(page, filmsType);
    }

    async #getMovies(page, filmsType){
        const response = await fetch(this.#baseUrl + filmsType + page + this.#apiKey);
        if(response.ok){
            return  response.json();
        } else{
            response.json().then(d => alert(d.errors))
        }
    
    }

    async getMovieInfo(id){
        const response = await fetch(this.#baseUrl + "/"+ id + "?language=en-US" + this.#apiKey);
        return response.json()
    }
    
    async getGenres(){
        const response = await fetch(`${this.#genresUrl}${this.#apiKey}`)
        return response.json();
    }

    async searchMovies(dataObj, page){
        const params = `page=${page}${dataObj.year != ''? `&primary_release_year=${dataObj.year}`:''}${dataObj.genre != ''? `&with_genres=${dataObj.genre}`:''}${dataObj.company? `&with_companies=${dataObj.company}`: ''}&sort_by=popularity.desc${this.#apiKey}`;
        const response = await fetch(`${this.#searchUrl}${params}`);
        return response.json();
        
    }

    async createUser(email, password){
        const isCreated = await this.getUser(email);
        if(Object.keys(isCreated).length != 0){
            alert('There is a user with such email')
        } else{
            const user = {email, password, 'favoriteList': [], 'watchingList': []}
            const response = await fetch(this.#jsonUrl, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user)
            });
            return await response.json();
        }
     
    }

    async getMoviesFromUserList(listName, id){
        const user = await this.getUserById(id);
        return user[listName]
    }

    async getUser(email, password){
        const response = await fetch(`${this.#jsonUrl}?email=${email}${password? `&password=${password}` : ''}`)
        return response.json()
    }

    async getUserById(id){
        const response = await fetch(`${this.#jsonUrl}/${id}`)
        return response.json()
    }

    async updateUserFilms(id, filmId, listName){
        const user = await this.getUserById(id);
        let moviesList = user[listName];
        moviesList.includes(filmId)? moviesList.splice(moviesList.indexOf(filmId), 1): moviesList.push(filmId); 
        console.log("list: " + user[listName])
        const response = await fetch(`${this.#jsonUrl}/${user.id}`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        });
        return await response.json();
    }

}