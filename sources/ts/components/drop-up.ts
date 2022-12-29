class DropUp extends HTMLElement {
    // Atributes
    title: string = "";
    description: string = "";

    //
    titleElem: HTMLHeadingElement | undefined;
    constructor() {
        super();

        const shadowRoot = this.attachShadow({
            mode: "open"
        });

        
    }

    connectedCallback(){
        this.render();
    }

    disconectedCallback(){
        console.log("-- unmounted");
    }

    // Used to get witch atributes should be liscened
    static get observedAttributes() {
        return ['title', 'description'];
    }

    attributeChangedCallback(name: any, oldValue: any, newValue: any) {
        // Prevent "Infinite" loopback
        if (newValue === oldValue) return;
        
        // Update the atributes
        switch(name) {
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
    render(): void{
        if (this.shadowRoot == null) return;

        this.shadowRoot.innerHTML = 
        /*html*/`
        <!-- Link the stylesheet -->
        <link rel="stylesheet" href="./assets/css/baba.css">
        
        
        <h2 id="id">Title : ${this.title}</h2>
        <p>Description : ${this.description}</p>
        `;
        this.getDataInHTML();
    }
    
    getDataInHTML(): void{
        this.titleElem = this.shadowRoot?.getElementById("id") as HTMLHeadingElement;
        console.log("Title is ", this.titleElem.textContent);
    }
    get titleText(): string{
        this.titleElem = this.shadowRoot?.getElementById("id") as HTMLHeadingElement;
        return this.titleElem.textContent || "";
    }
}

customElements.define("drop-up", DropUp);