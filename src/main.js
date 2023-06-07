import FilmsGrid from "./ui/FilmsGrid.js";
import MenuBar from "./ui/MenuBar.js"
import config from "./config/config.json" assert {type: "json"}
import FilmService from "./service/FilmService.js";
import FilmInfo from "./ui/FilmInfo.js";


const menuItems = [
    {title: "Home", id: "movies-place-container"},
    {title: "Now Playing", id: "movies-place-container"},
    // {title: "", id: "movies-place"},
    {title: "SearchMoovie", id: "movies-search-place"}
]

const menu = new MenuBar("menu-place", menuItems, menuHandler);
const filmsGrid = new FilmsGrid("movies-place", getFilmInfo)
const filmService = new FilmService(config.baseUrl, config.apiKey);
const filmInfo = new FilmInfo("film-info-place");


async function menuHandler(index){
    switch(index){
        case 0: {
           getPopularFilms(1)
            break;
        }

        case 1: {
           getNowPlayingFilms(1)
            break;
        }
    }
}

async function getFilmInfo(id){
    film = await filmService.getFilmInfo(id); 
    filmInfo.fillData(film, config.cardImageUrl)

}

async function getPopularFilms(page){
    const films =  await  filmService.getPopularFilms( config.popularFilms, page);
    filmsGrid.fillData(films, config.cardImageUrl, getPopularFilms);
}

async function getNowPlayingFilms(page){
    const films =  await  filmService.getPopularFilms( config.nowPlayingFilms, page);
    filmsGrid.fillData(films, config.cardImageUrl, getNowPlayingFilms);
}



async function action(serviceFun){
    return await serviceFun();
}