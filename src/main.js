import FilmsGrid from "./ui/FilmsGrid.js";
import MenuBar from "./ui/MenuBar.js"
import config from "./config/config.json" assert {type: "json"}
import FilmService from "./service/FilmService.js";
import FilmInfo from "./ui/FilmInfo.js";
import AuthorizationForm from "./ui/AuthorizationForm.js";
import AuthorizationBar from "./ui/AuthorizationBar.js";
import SearchForm from "./ui/SearchForm.js";


const menuItems = [
    { title: "Home", id: "movies-place-container" },
    { title: "Now Playing", id: "movies-place-container" },
    { title: "Favorites", id: "movies-place-container" },
    { title: "Watching list", id: "movies-place-container" },
    { title: "SearchMoovie", id: "movies-search-place" }
]

let userId;
const menu = new MenuBar("movie-menu-place", menuItems, menuHandler, ['movie-info-place', 'authorization-place']);
const filmsGrid = new FilmsGrid("movies-place-container", "movies-place", getFilmInfo, 'pages-place')
const moviesSearch = new FilmsGrid("movies-place-container", "movies-place", getFilmInfo, 'pages-place');
const filmService = new FilmService(config.baseUrl, config.apiKey, config.jsonUrl,  config.genresUrl, config.searchUrl);
const filmInfo = new FilmInfo("movie-info-place", "movies-place-container", moviesInfoHandler);
const authorizationForm = new AuthorizationForm('authorization-place', 'signIn', signIn);
const authorizationMenu = new AuthorizationBar("authorization-menu-place", authHandler,
    ['movie-info-place', 'movies-place-container', 'movies-search-place']);
const searchForm = new SearchForm('movies-search-place', searchMovies, 'movies-place-container')

const registrationForm = new AuthorizationForm('authorization-place', 'signUp', createUser);
let dataObj;


async function menuHandler(index) {
    switch (index) {
        case 0: {
            getPopularFilms(1)
            break;
        }

        case 1: {
            getNowPlayingFilms(1)
            break;
        }

        case 2: {
            getFavoriteFilms('favoriteList');
            break
        }

        case 3: {
            getFavoriteFilms('watchingList')
        }

        case 4: {
            getGenres()
        }
    }
}

async function getGenres(){
    const genres = await filmService.getGenres();
    searchForm.fillData(genres.genres)
}

async function authHandler(name) {
    switch (name) {
        case 0: {
            authorizationForm.fillForm();
            break;
        }
        case 1: {
            registrationForm.fillForm()
            break;
        }
        case 2:{
            logOut()
            break;
        }
    }
}

async function moviesInfoHandler(id, filmId, name) {
    const response = await filmService.updateUserFilms(id, filmId, name)
    console.log(response)
}

async function getFilmInfo(id) {
    let isFavorite = false;
    let isWatching = false;
    const film = await filmService.getFilmInfo(id);
    if(userId != undefined){
        isFavorite = await checkFilm(id, 'favoriteList');
        isWatching = await checkFilm(id, 'watchingList');
    }
    
    filmInfo.fillData(film, config.filmInfoImageUrl, isFavorite, isWatching)
}

async function checkFilm(id, listName){
    const films = await getFilmsFromUser(listName);
    return films.includes(+id);
}

async function getFilmsFromUser(listName) {
    const filmsId = await filmService.getFilmsFromUserList(listName, userId);
    return filmsId;
}


async function getFavoriteFilms(listName) {
    if (userId != undefined) {
        const filmsId = await getFilmsFromUser(listName);
        let films = [];
    films = await Promise.all(filmsId.map(el => filmService.getFilmInfo(el)))
        filmsGrid.fillData(films, config.cardImageUrl)
    } else {
        alert('You should sign in first!')
    }
}

async function searchMovies( page){
    dataObj = searchForm.getDataFromForm();
    const films = await filmService.searchMovies(dataObj, !page? 1: page);
    moviesSearch.fillData(films.results, config.cardImageUrl, searchMovies, films.total_pages, films.page)
}

async function getPopularFilms(page) {
    const films = await filmService.getPopularFilms(config.popularFilms, page);
    filmsGrid.fillData(films.results, config.cardImageUrl, getPopularFilms, films.total_pages, films.page);
}

async function getNowPlayingFilms(page) {
    const films = await filmService.getPopularFilms(config.nowPlayingFilms, page);
    filmsGrid.fillData(films.results, config.cardImageUrl, getNowPlayingFilms, films.total_pages, films.page);
}

async function createUser(email, password) {
    const user = await filmService.createUser(email, password);
    if (user != undefined) {
        signIn(user.email, user.password);
    }
}

function logOut(){
    userId = undefined;
    filmInfo.logout()
    authorizationMenu.logOut()
}

async function signIn(email, password) {
    const user = await filmService.getUser(email, password);
    if (Object.keys(user).length == 0) {
        alert("Wrong email or password")
    } else {
        filmInfo.signIn(true, user[0].id);
        authorizationMenu.signIn(user[0].email);
        userId = user[0].id;
    }
}

async function action(serviceFun) {
    return await serviceFun();
}