"use strict";
class ImageInput extends HTMLElement {
    constructor() {
        super();
        // Atributes
        this.channelName = "Some ";
        const shadowRoot = this.attachShadow({
            mode: "open",
        });
    }
    // Render the web component when it is connected
    connectedCallback() {
        this.render();
        this.setupEventLisceners();
    }
    // Used to get witch atributes should be liscened
    static get observedAttributes() {
        return ["channel-name"];
    }
    // Watch HTML atribute changes and update the rendered HTML
    attributeChangedCallback(name, oldValue, newValue) {
        // Prevent "Infinite" loopback
        if (newValue === oldValue)
            return;
        // Update the atributes
        switch (name) {
            case "channel-name":
                this.channelName = newValue || "";
                break;
        }
        this.render();
    }
    // Render the html in the DOM
    render() {
        // Check if the element is renerable
        if (this.shadowRoot == null)
            return;
        this.shadowRoot.innerHTML = /*html*/ `
        <link rel="stylesheet" href="./assets/css/index.css">

        <div class="image-box-container">
            <div class="image-input-box" id="image-box">
                <input id="image-input" type="file" name="" accept="image/*" class="hidden">
                <label for="image-input" title="Image file input">
                    <img id="display-image" src="./assets/images/transparent-pixel.png" alt="">
                </label>
                <canvas id="storage-canvas" class="hidden"></canvas>
            </div>
            <h2>${this.channelName} Channel</h2>
        </div>
        `;
    }
    setupEventLisceners() {
        if (this.shadowRoot == null)
            return;
        const imageInput = this.shadowRoot.getElementById("image-input");
        const imageBox = this.shadowRoot.getElementById("image-box");
        imageInput.addEventListener("change", (event) => {
            var _a;
            const files = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files;
            if (files == null)
                return;
            this.setupChannel(files);
        });
        imageBox.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        imageBox.addEventListener("drop", (event) => {
            var _a;
            event.preventDefault();
            const files = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files;
            if (files == null)
                return;
            this.setupChannel(files);
        });
    }
    setupChannel(files) {
        var _a;
        if (files.length === 0)
            return;
        const displayImage = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("display-image");
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            displayImage.onload = () => {
                this.updateCanvas(displayImage);
            };
            displayImage.src = reader.result;
            console.log(this.channelName + "  channel image is ", files[0], " ");
        };
    }
    updateCanvas(displayImage) {
        var _a;
        const storageCanvas = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("storage-canvas");
        if (storageCanvas == null)
            return;
        let canvasContext = storageCanvas.getContext("2d");
        if (canvasContext == null)
            return;
        storageCanvas.width = displayImage.width;
        storageCanvas.height = displayImage.height;
        canvasContext.drawImage(displayImage, 0, 0, displayImage.width, displayImage.height);
    }
    getCanvas() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("storage-canvas");
    }
}
customElements.define("image-input", ImageInput);
