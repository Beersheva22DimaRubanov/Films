export default class MenuBar{
    #buttons;
   #sectionElements;
   #activeIndex;
   #callback;
constructor(parentId, sections, callback){
    this.#fillButtons(parentId, sections.map(t => t.title));
    this.#setSectionElements(sections.map(s => s.id));
    this.#addListeners();
    this.#callback = callback;
}

#fillButtons(parentId, titles){
    const parentElement = document.getElementById(parentId);
    parentElement.innerHTML = titles.map(t => `<button class = 'menu-button'>${t}</button>`).join('');
    this.#buttons = parentElement.childNodes;
}

#setSectionElements(sectionIds){
    this.#sectionElements = sectionIds.map(id=> document.getElementById(id));
}

#addListeners(){
    this.#buttons.forEach((b, index) => {
        b.addEventListener('click', this.#handler.bind(this, index))
    });
}

async #handler(index){
    if(!this.#activeIndex == undefined || index != this.#activeIndex){
        if(this.#activeIndex != undefined){
            this.#buttons[this.#activeIndex].classList.remove('active');
            this.#sectionElements[this.#activeIndex].hidden = true; 
        }

        this.#buttons[index].classList.add('active');
        await this.#callback(index);
        this.#sectionElements[index].hidden = false;
        this.#activeIndex = index;
    }
}




}