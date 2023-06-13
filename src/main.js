import MoviesGrid from "./ui/MoviesGrid.js";
import MenuBar from "./ui/MenuBar.js"
import config from "./config/config.json" assert {type: "json"}
import MovieService from "./service/MovieService.js";
import MovieInfo from "./ui/MovieInfo.js";
import AuthorizationForm from "./ui/AuthorizationForm.js";
import AuthorizationBar from "./ui/AuthorizationBar.js";
import SearchForm from "./ui/SearchForm.js";
import Spinner from "./ui/Spinner.js";
import ModalMessage from "./ui/ModalMessage.js";
import Paginator from "./ui/Paginator.js";



const menuItems = [
    { title: "Home", id: "movies-place-container" },
    { title: "Now Playing", id: "movies-place-container" },
    { title: "Top rated", id: "movies-place-container" },
    { title: "Upcomming", id: "movies-place-container" },
    { title: "Favorites", id: "movies-place-container" },
    { title: "Watching list", id: "movies-place-container" },
    { title: "SearchMovie", id: "movies-search-place" }
]

let userId;
const START_PAGE = 1;
const menu = new MenuBar("movie-menu-place", menuItems, menuHandler, ['movie-info-place', 'authorization-place', 'movies-search-place']);
const moviesGrid = new MoviesGrid("movies-place-container", "movies-place", getMovieInfo)
const paginator = new Paginator("pages-place")
// const moviesSearch = new MoviesGrid("movies-place-container", "movies-place", getMovieInfo, 'pages-place');
const movieService = new MovieService(config.baseUrl, config.apiKey, config.jsonUrl, config.genresUrl, config.searchUrl);
const movieInfo = new MovieInfo("movie-info-place", "movies-place-container", moviesInfoHandler);
const authorizationMenu = new AuthorizationBar("authorization-menu-place", authHandler,
    ['movie-info-place', 'movies-place-container', 'movies-search-place']);
const authorizationForm = new AuthorizationForm('authorization-place', 'signIn', signIn, 'Please SignIn');
const registrationForm = new AuthorizationForm('authorization-place', 'signUp', createUser, 'Registration');
const modalMessage = new ModalMessage('modal-message-place');
const searchForm = new SearchForm('movies-search-place', searchMovies, 'movies-place-container');
let dataObj;
const spinner = new Spinner();

async function menuHandler(index) {
    const menuActions = {
        0: () => getPopularFilms(START_PAGE),
        1: () => getNowPlayingFilms(START_PAGE),
        2: () => getTopRatedFilms(START_PAGE),
        3: () => getUpcomingFilms(START_PAGE),
        4: () => getMoviesFromUserList('favoriteList'),
        5: () => getMoviesFromUserList('watchingList'),
        6: () => getGenres()
    }
    menuActions[+index]();
}

async function getGenres() {
    dataObj = undefined;
    const genres = await movieService.getGenres();
    searchForm.fillData(genres.genres)
}

async function authHandler(index) {
    const authActions = {
        0: ()=> authorizationForm.fillForm(),
        1: ()=> registrationForm.fillForm(),
        2: ()=>logOut()
    }
    authActions[+index]();
}

async function moviesInfoHandler(id, filmId, name) {
    const response = await action(movieService.updateUserFilms.bind(movieService, id, filmId, name))
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

async function searchMovies(page) {
    if(!dataObj){
        dataObj = searchForm.getDataFromForm();
    }  
    const films = await action(movieService.searchMovies.bind(movieService, dataObj, !page ? 1 : page));
    paginator.filldata(films.total_pages, films.page, searchMovies);
    moviesGrid.fillData(films.results, config.cardImageUrl, "Searching results")
}

async function getMovies(type, page) {
    const movies = await action(movieService.getMovies.bind(movieService, type, page, errorMessage));
    return movies;
}

async function getPopularFilms(page) {
    const films = await getMovies(config.popularFilms, page);
    paginator.filldata(films.total_pages, films.page, getPopularFilms);
    moviesGrid.fillData(films.results, config.cardImageUrl, 'Popular Movies');
}

async function getNowPlayingFilms(page) {
    const films = await getMovies(config.nowPlayingFilms, page);
    paginator.filldata(films.total_pages, films.page, getNowPlayingFilms);
    moviesGrid.fillData(films.results, config.cardImageUrl, 'Now Playing Moovies');
}

async function getUpcomingFilms(page) {
    const films = await getMovies(config.upcomingFilms, page);
    paginator.filldata(films.total_pages, films.page, getUpcomingFilms);
    moviesGrid.fillData(films.results, config.cardImageUrl, 'Comming soon');
}

async function getTopRatedFilms(page) {
    const films = await getMovies(config.topRatedFilms, page);
    paginator.filldata(films.total_pages, films.page, getTopRatedFilms);
    moviesGrid.fillData(films.results, config.cardImageUrl, 'Top rated movies');
}

//userActions

async function createUser(email, password) {
    const isCreated = await action(movieService.getUser.bind(movieService, email));
    if (Object.keys(isCreated).length != 0) {
        errorMessage('There is a user with such email')
    } else {
        const user = await action(movieService.createUser.bind(movieService, email, password));
        if (user != undefined) {
            signIn(user.email, user.password);
        }
    }
}

function logOut() {
    userId = undefined;
    movieInfo.logout()
    authorizationMenu.logOut()
    menu.logout()
}

async function signIn(email, password) {
    const user = await action(movieService.getUser.bind(movieService, email, password));
    if (Object.keys(user).length == 0) {
        errorMessage("Wrong email or password")
    } else {
        movieInfo.signIn(true, user[0].id);
        authorizationMenu.signIn(user[0].email);
        menu.signIn()
        userId = user[0].id;
    }
}

async function checkFilm(id, listName) {
    const films = await getMoviesFromUser(listName);
    return films.includes(+id);
}

async function getMoviesFromUser(listName) {
    const moviesId = await movieService.getMoviesFromUserList(listName, userId);
    return moviesId;
}

async function getMoviesFromUserList(listName) {
    const movieId = await getMoviesFromUser(listName);
    let movies = [];
    movies = await Promise.all(movieId.map(el => action(movieService.getMovieInfo.bind(movieService, el))));
    paginator.filldata()
    moviesGrid.fillData(movies, config.cardImageUrl, listName == 'favoriteList' ? 'Favorite movies' : 'Watching list')
}

//actions

function errorMessage(message) {
    modalMessage.fillData(message);
}

async function action(serviceFn) {
    spinner.start();
    const res = await serviceFn();
    spinner.stop();
    return res;
}
