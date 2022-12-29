"use strict";
class ImagePacker extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({
            mode: "open",
        });
    }
    // Render the web component when it is connected
    connectedCallback() {
        this.render();
    }
    // Used to get witch atributes should be liscened
    static get observedAttributes() {
        return [];
    }
    render() {
        // Check if the element is renerable
        if (this.shadowRoot == null)
            return;
        this.shadowRoot.innerHTML = /*html*/ `
        <link rel="stylesheet" href="./assets/css/index.css" hidden>

        <div class="image-box-container">
            <div class="image-display-box" id="image-box">
                <canvas id="storage-canvas" class=""></canvas>
            </div>
            <div style="display: flex; whidth: 100%; margin-top : 1em;margin-bottom : 1em">
                <button button style="flex: 1 1 0">Pack Textures</button>
                <div class="spacer"></div>
                <div class="input-group" style="max-width: 64em;flex: 1 1 0">
                    <input type="radio" class="radio-input" name="channels" id="rad-col" checked="checked">
                    <label for="rad-col" class="radio-label">C</label>
                    <input type="radio" class="radio-input" name="channels" id="rad-red">
                    <label for="rad-red" class="radio-label">R</label>
                    <input type="radio" class="radio-input" name="channels" id="rad-green">
                    <label for="rad-green" class="radio-label">G</label>
                    <input type="radio" class="radio-input" name="channels" id="rad-blue">
                    <label for="rad-blue" class="radio-label">B</label>
                    <input type="radio" class="radio-input" name="channels" id="rad-alpha">
                    <label for="rad-alpha" class="radio-label">A</label>
                </div>
            </div>
            <div style="display: flex; whidth: 100%; margin-top : 1em;margin-bottom : 1em">
                <button button style="flex: 1 1 0" disabled>Download Texture</button>
                <div class="spacer"></div>
                <div class="input-group" style="max-width: 64em;flex: 1 1 0">
                    <input type="radio" class="radio-input" name="formats" id="rad-png" checked="checked">
                    <label for="rad-png" class="radio-label">PNG</label>
                    <input type="radio" class="radio-input" name="formats" id="rad-bmp">
                    <label for="rad-bmp" class="radio-label">BMP</label>
                    <input type="radio" class="radio-input" name="formats" id="rad-jpg">
                    <label for="rad-jpg" class="radio-label">JPG</label>
                </div>
            </div>
        </div>
        `;
    }
}
customElements.define("image-packer", ImagePacker);
