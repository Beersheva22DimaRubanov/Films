
export default class FilmService{
    #apiKey;
    #baseUrl;
    #jsonUrl
    #user

    constructor(baseUrl, apiKey, jsonUrl){
        this.#apiKey = apiKey;
        this.#baseUrl = baseUrl;
        this.#jsonUrl = jsonUrl;
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

    async getFilmInfo(id){
        const response = await fetch(this.#baseUrl + "/"+ id + "?language=en-US" + this.#apiKey);
        return response.json()
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

    async getFilmsFromUserList(listName, id){
        const user = await this.getUserById(id);
        // const user = await response.json();
        return user[listName]
    }

    async getUser(email, password){
        const response = await fetch(`${this.#jsonUrl}?email=${email}&password=${password}`)
        this.#user = response.json()
        return this.#user
    }

    async getUserById(id){
        const response = await fetch(`${this.#jsonUrl}/${id}`)
        return response.json()
    }

    async updateUserFilms(id, filmId, listName){
        const user = await this.getUserById(id);
        let moviesList = user[listName];
        moviesList.includes(filmId)? moviesList.splice(moviesList.indexOf(filmId), 1): moviesList.push(filmId); 
        // user[listName].push(filmId);
        console.log("list: " + user[listName])
        const response = await fetch(`${this.#jsonUrl}/${user.id}`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        });
        return await response.json();
    }

}