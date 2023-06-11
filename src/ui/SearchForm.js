const INPUT_CLASS = 'input-form';

export default class SearchForm{
    #parentId;
    #selectElement;
    #dataObj;
    #searchMoovies
    #searchingResults
    constructor(parentId, searchMoovies, searchingResults){
        this.#parentId = parentId;
        this.#dataObj = {}
        this.#searchMoovies = searchMoovies;
        this.#searchingResults = searchingResults;
    }

    fillData(genres){
        const parentElement = document.getElementById(this.#parentId);
        parentElement.innerHTML = `<div class = '${this.#parentId}-title'> Searching Page</div> 
            <form class='${this.#parentId}-form-control' id ='${this.#parentId}-form'>
                <input class = ${INPUT_CLASS} name = 'company' placeholder = 'Movie Company'>
                <label for = 'company' class = 'input-label'>Add one or several companies using , </label>
                <select id = '${this.#parentId}-genres' class = ${INPUT_CLASS} name = 'genre'></select>
                <label for = 'company' class = 'input-label'>Choose genre </label>
                <input type ='number' class = ${INPUT_CLASS} placeholder = 'Year' name = 'year'>
                <label for = 'year' class = 'input-label'>Chose year from 1900 to nowadays</label>
                <button id = '${this.#parentId}-submit' type = 'submit' class = 'submit-btn'>Search</button>`;
        this.#selectElement = document.getElementById(`${this.#parentId}-genres`)
        this.#setOptions(genres);
        const formElement = document.getElementById(`${this.#parentId}-form`);
        formElement.onsubmit =  async b => {
            b.preventDefault();
            const formData = new FormData(formElement);
            this.#dataObj.company = formData.get('company');
            this.#dataObj.year = formData.get('year');
            this.#dataObj.genre = formData.get('genre');
            document.getElementById(this.#parentId).style.display = 'none';
            document.getElementById(this.#searchingResults).style.display = 'flex';
            this.#searchMoovies();
        }
    }

    #setOptions(genres){
        let genresName = `<option value = ''> Nothing </option>`;
        genresName += genres.map(genre => 
            `<option value = '${genre.id}'> ${genre.name} </option> `).join('');
        this.#selectElement.innerHTML = genresName;
    }

    getDataFromForm(){
        return this.#dataObj
    }
}