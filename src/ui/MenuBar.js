export default class MenuBar {
    #buttons;
    #sectionElements;
    #activeIndex;
    #callback;
    #hidenElements;
    #favoritesBtn;
    #watchingListBtn;

    constructor(parentId, sections, callback, hidenElements) {
        this.#fillButtons(parentId, sections.map(t => t.title));
        this.#setSectionElements(sections.map(s => s.id));
        this.#addListeners();
        this.#hidenElements = hidenElements;
        this.#callback = callback;
    }

    #fillButtons(parentId, titles) {
        const parentElement = document.getElementById(parentId);
        parentElement.innerHTML = titles.map(t => `<button class = 'menu-button' id = ${t.toLowerCase().replace(" ", '-')}> ${t}</button>`).join('');
        this.#buttons = parentElement.childNodes;
        this.#watchingListBtn = document.getElementById('watching-list');
        this.#favoritesBtn = document.getElementById('favorites');
        this.#watchingListBtn.hidden = true;
        this.#favoritesBtn.hidden = true;
    }


    #setSectionElements(sectionIds) {
        this.#sectionElements = sectionIds.map(id => document.getElementById(id));
    }

    #addListeners() {
        this.#buttons.forEach((b, index) => {
            b.addEventListener('click', this.#handler.bind(this, index))
        });
    }



    async #handler(index) {
        if (this.#activeIndex != undefined) {
            this.#buttons[this.#activeIndex].classList.remove('active');
            this.#sectionElements[this.#activeIndex].style.display = 'none';
        }
        this.#hidenElements.forEach(el => document.getElementById(el).style.display = 'none');
        this.#buttons[index].classList.add('active');
        await this.#callback(index);
        this.#sectionElements[index].style.display = 'flex';
        this.#activeIndex = index;
    }

    signIn() {
        this.#watchingListBtn.hidden = false;
        this.#favoritesBtn.hidden = false;
    }

    logout() {
        this.#watchingListBtn.hidden = true;
        this.#favoritesBtn.hidden = true;
    }




}