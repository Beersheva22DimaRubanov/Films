export default class AuthorizationForm{
    #type;
    #parentId;
    #callback

    constructor(parentId, type, callback){
        this.#parentId = parentId;
        this.#type = type;
        this.#callback = callback;
    }

    fillForm(){
        const parentElement = document.getElementById(this.#parentId);
        parentElement.innerHTML = `<form class='form-control' id ='${this.#parentId}-form'>
            <input type = 'email' class = 'form-input' placeholder = 'Enter email' name = 'email' required>
            <input  type = 'password' class = 'form-input' placeholder = 'Enter password' name = 'password' required >
            <input  id = '${this.#parentId}-confirm' class = 'form-input' placeholder = 'Repeat password' 
                name ='confirm'   ${this.#type == 'signUp' ? 'required' : 'hidden'}>
            <button id = '${this.#parentId}-submit' class = 'submit-button'> Submit</button>`

        document.getElementById(`${this.#parentId}-submit`).addEventListener('click', this.#handler())
    }

    #handler(){
        const formElement = document.getElementById(`${this.#parentId}-form`);
        formElement.addEventListener('submit', b => {
            b.preventDefault();
            const formData = new FormData(formElement);
            this.#callback(formData.get('email'), formData.get('password'))
        })
    }

}