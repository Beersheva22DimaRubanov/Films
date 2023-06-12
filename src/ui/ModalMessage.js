export default class ModalMessage{
    #black
    #parentElement
    #button

    constructor(parentElement){
        this.#parentElement = parentElement;
        this.#black = document.getElementById("black")
    }

    fillData(message){
        const parentElement = document.getElementById(this.#parentElement);
        parentElement.innerHTML = `<div class ='modal-title'>Message</div>
        <div class='modal-text'>${message}</div><div id = 'close-message' class='modal-btn'>Close</div>`;
        this.#showMessage()
        this.#button = document.getElementById('close-message').addEventListener('click', this.#close.bind(this))
    }

    #showMessage(){
        document.getElementById(this.#parentElement).style.display = 'flex';
        this.#black.style.display = 'flex';
    }

    #close(){
        document.getElementById(this.#parentElement).style.display = 'none';
        this.#black.style.display = 'none';
    }




}