"use strict";
class DropUp extends HTMLElement {
    constructor() {
        super();
        // Atributes
        this.title = "";
        this.description = "";
        const shadowRoot = this.attachShadow({
            mode: "open"
        });
    }
    connectedCallback() {
        this.render();
    }
    disconectedCallback() {
        console.log("-- unmounted");
    }
    // Used to get witch atributes should be liscened
    static get observedAttributes() {
        return ['title', 'description'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // Prevent "Infinite" loopback
        if (newValue === oldValue)
            return;
        // Update the atributes
        switch (name) {
            case 'title':
                this.title = newValue || '';
                break;
            case 'description':
                this.description = newValue || '';
                break;
        }
        this.render;
    }
    // Render the html content
    render() {
        if (this.shadowRoot == null)
            return;
        this.shadowRoot.innerHTML =
            /*html*/ `
        <!-- Link the stylesheet -->
        <link rel="stylesheet" href="./assets/css/baba.css">
        
        
        <h2 id="id">Title : ${this.title}</h2>
        <p>Description : ${this.description}</p>
        `;
        this.getDataInHTML();
    }
    getDataInHTML() {
        var _a;
        this.titleElem = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("id");
        console.log("Title is ", this.titleElem.textContent);
    }
    get titleText() {
        var _a;
        this.titleElem = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("id");
        return this.titleElem.textContent || "";
    }
}
customElements.define("drop-up", DropUp);
