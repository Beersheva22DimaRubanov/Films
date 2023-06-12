import MoviesGrid from "./ui/MoviesGrid.js";
import MenuBar from "./ui/MenuBar.js"
import config from "./config/config.json" assert {type: "json"}
import MovieService from "./service/MovieService.js";
import MovieInfo from "./ui/MovieInfo.js";
import AuthorizationForm from "./ui/AuthorizationForm.js";
import AuthorizationBar from "./ui/AuthorizationBar.js";
import SearchForm from "./ui/SearchForm.js";
import Spinner from "./ui/Spinner.js";



const menuItems = [
    { title: "Home", id: "movies-place-container" },
    { title: "Now Playing", id: "movies-place-container" },
    { title: "Top rated", id: "movies-place-container" },
    { title: "Upcomming", id: "movies-place-container" },
    { title: "Favorites", id: "movies-place-container" },
    { title: "Watching list", id: "movies-place-container" },
    { title: "SearchMoovie", id: "movies-search-place" }
]

let userId;
const START_PAGE = 1;
const menu = new MenuBar("movie-menu-place", menuItems, menuHandler, ['movie-info-place', 'authorization-place', 'movies-search-place']);
const moviesGrid = new MoviesGrid("movies-place-container", "movies-place", getMovieInfo, 'pages-place')
const moviesSearch = new MoviesGrid("movies-place-container", "movies-place", getMovieInfo, 'pages-place');
const movieService = new MovieService(config.baseUrl, config.apiKey, config.jsonUrl, config.genresUrl, config.searchUrl);
const movieInfo = new MovieInfo("movie-info-place", "movies-place-container", moviesInfoHandler);
const authorizationForm = new AuthorizationForm('authorization-place', 'signIn', signIn, 'Please SignIn');
const authorizationMenu = new AuthorizationBar("authorization-menu-place", authHandler,
    ['movie-info-place', 'movies-place-container', 'movies-search-place']);
const searchForm = new SearchForm('movies-search-place', searchMovies, 'movies-place-container')
const registrationForm = new AuthorizationForm('authorization-place', 'signUp', createUser, 'Registration');
let dataObj;
const spinner = new Spinner();



async function menuHandler(index) {
    switch (index) {
        case 0: {
            getPopularFilms(START_PAGE)
            break;
        }

        case 1: {
            getNowPlayingFilms(START_PAGE)
            break;
        }

        case 2:{
            getTopRatedFilms(START_PAGE)
            break;
        }

        case 3:{
            getUpcomingFilms(START_PAGE)
            break
        }

        case 4: {
            getFavoriteFilms('favoriteList');
            break
        }

        case 5: {
            getFavoriteFilms('watchingList')
        }

        case 6: {
            getGenres()
        }
    }
}

async function getGenres() {
    const genres = await movieService.getGenres();
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
        case 2: {
            logOut()
            break;
        }
    }
}

async function moviesInfoHandler(id, filmId, name) {
    const response = await movieService.updateUserFilms(id, filmId, name)
    console.log(response)
}

async function getMovieInfo(id) {
    let isFavorite = false;
    let isWatching = false;
    const film = await movieService.getMovieInfo(id);
    if (userId != undefined) {
        isFavorite = await checkFilm(id, 'favoriteList');
        isWatching = await checkFilm(id, 'watchingList');
    }

    movieInfo.fillData(film, config.filmInfoImageUrl, isFavorite, isWatching)
}

async function checkFilm(id, listName) {
    const films = await getMoviesFromUser(listName);
    return films.includes(+id);
}

async function getMoviesFromUser(listName) {
    const moviesId = await movieService.getMoviesFromUserList(listName, userId);
    return moviesId;
}


async function getFavoriteFilms(listName) {
    if (userId != undefined) {
        const movieId = await getMoviesFromUser(listName);
        let movies = [];
        movies = await Promise.all(movieId.map(el => movieService.getMovieInfo(el)))
        moviesGrid.fillData(movies, config.cardImageUrl, listName == 'favoriteList'? 'Favorite movies': 'Watchinf list')
    } else {
        alert('You should sign in first!');
        moviesGrid.removeEverithyng();
    }
}

async function searchMovies(page) {
    dataObj = searchForm.getDataFromForm();
    const movies = await action(movieService.searchMovies.bind(movieService, dataObj, !page ? 1 : page));
    moviesSearch.fillData(movies.results, config.cardImageUrl, "Searching results", searchMovies, movies.total_pages, movies.page)
}

async function getMovies(type, page) {
    const movies = await action(movieService.getPopularFilms.bind(movieService, type, page));
    return movies;
}

async function getPopularFilms(page) {
    const films = await getMovies(config.popularFilms, page);
    moviesGrid.fillData(films.results, config.cardImageUrl, 'Popular Movies',  getPopularFilms, films.total_pages, films.page);
}

async function getNowPlayingFilms(page) {
    const films = await getMovies(config.nowPlayingFilms, page);
    moviesGrid.fillData(films.results, config.cardImageUrl, 'Now Playing Moovies', getNowPlayingFilms,  films.total_pages, films.page);
}

async function getUpcomingFilms(page){
    const films = await getMovies(config.upcomingFilms, page);
    moviesGrid.fillData(films.results, config.cardImageUrl, 'Comming soon', getNowPlayingFilms,  films.total_pages, films.page);
}

async function getTopRatedFilms(page){
    const films = await getMovies(config.topRatedFilms, page);
    moviesGrid.fillData(films.results, config.cardImageUrl, 'Top rated movies', getNowPlayingFilms,  films.total_pages, films.page);
}

async function createUser(email, password) {
    const user = await movieService.createUser(email, password);
    if (user != undefined) {
        signIn(user.email, user.password);
    }
}

function logOut() {
    userId = undefined;
    movieInfo.logout()
    authorizationMenu.logOut()
}

async function signIn(email, password) {
    const user = await movieService.getUser(email, password);
    if (Object.keys(user).length == 0) {
        alert("Wrong email or password")
    } else {
        movieInfo.signIn(true, user[0].id);
        authorizationMenu.signIn(user[0].email);
        userId = user[0].id;
    }
}

async function action(serviceFn) {
    spinner.start();
    const res = await serviceFn();
    spinner.stop();
    return res;
}