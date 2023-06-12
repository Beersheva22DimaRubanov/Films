export default class Spinner{
   #spinner
   #black
    constructor(){
       this.#spinner = document.getElementById("spinner")
       this.#black = document.getElementById("black")
    }

    start(){
        this.#spinner.style.display = 'block';
        this.#black.style.display = 'block';
    }

    stop(){
        this.#spinner.style.display = 'none';
        this.#black.style.display = 'none';
    }
}