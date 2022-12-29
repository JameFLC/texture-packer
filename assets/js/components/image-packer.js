"use strict";
class ImagePacker extends HTMLElement {
    get redImage() {
        return this._redImage;
    }
    set redImage(value) {
        this._redImage = value;
        console.log("Recieved Red Image ", this._redImage);
    }
    get greenImage() {
        return this._greenImage;
    }
    set greenImage(value) {
        this._greenImage = value;
        console.log("Recieved Green Image ", this._greenImage);
    }
    get blueImage() {
        return this._blueImage;
    }
    set blueImage(value) {
        this._blueImage = value;
        console.log("Recieved blue Image ", this._blueImage);
    }
    get alphaImage() {
        return this._alphaImage;
    }
    set alphaImage(value) {
        this._alphaImage = value;
        console.log("Recieved alpha Image ", this._blueImage);
    }
    constructor() {
        super();
        // Properties
        // Red Channel Image
        this._redImage = new Image();
        // Green Channel Image
        this._greenImage = new Image();
        // Blue Channel Image
        this._blueImage = new Image();
        // Alpha Channel Image
        this._alphaImage = new Image();
        this.onPackTextureClicked = () => {
            if (this.shadowRoot == null)
                return;
            const resultChannelCanvas = this.shadowRoot.getElementById("result-channel-canvas");
            const redChannelCanvas = this.shadowRoot.getElementById("red-channel-canvas");
            const greenChannelCanvas = this.shadowRoot.getElementById("green-channel-canvas");
            const blueChannelCanvas = this.shadowRoot.getElementById("blue-channel-canvas");
            const alphaChannelCanvas = this.shadowRoot.getElementById("alpha-channel-canvas");
            this.applyGrayScale(resultChannelCanvas);
            const images = [
                this._redImage,
                this._greenImage,
                this._blueImage,
                this._alphaImage,
            ];
            console.log("Red image size is ", this._redImage.width, " by ", this._redImage.height, this._redImage);
            const canvases = [
                redChannelCanvas,
                greenChannelCanvas,
                blueChannelCanvas,
                alphaChannelCanvas,
            ];
            const biggestImageIndex = this.getBiggestImageIndex(images);
            for (let i = 0; i < images.length; i++) {
                this.setupCanvas(canvases[i], images[i], images[biggestImageIndex].naturalWidth, images[biggestImageIndex].naturalHeight);
            }
            this.setupCanvas(resultChannelCanvas, images[0], images[biggestImageIndex].naturalWidth, images[biggestImageIndex].naturalHeight);
            // Unifor each canvas color channels
            this.applyGrayScale(redChannelCanvas);
            this.applyGrayScale(greenChannelCanvas);
            this.applyGrayScale(blueChannelCanvas);
            this.applyGrayScale(alphaChannelCanvas);
            this.packChannels(resultChannelCanvas, redChannelCanvas, greenChannelCanvas, blueChannelCanvas, alphaChannelCanvas);
        };
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
            <img id="display-image" src="./assets/images/transparent-pixel.png" alt="">
          </div>
          <div style="display: flex; whidth: 100%; margin-top : 1em;margin-bottom : 1em">
              <button id="btn-pack" style="flex: 1 1 0">Pack Textures</button>
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
              <button id="btn-download" style="flex: 1 1 0" disabled>Download Texture</button>
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
          <canvas id="result-channel-canvas" class="hidden" height=32 width=32 style="outline: 1px solid #000000"></canvas>
          <canvas id="red-channel-canvas" class="hidden" height=32 width=32 style="outline: 1px solid #000000"></canvas>
          <canvas id="green-channel-canvas" class="hidden" height=32 width=32 style="outline: 1px solid #000000"></canvas>
          <canvas id="blue-channel-canvas" class="hidden" height=32 width=32 style="outline: 1px solid #000000"></canvas>
          <canvas id="alpha-channel-canvas" class="hidden" height=32 width=32 style="outline: 1px solid #000000"></canvas>
      </div>
      `;
    }
    setupEventLisceners() {
        var _a, _b;
        const btnPack = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("btn-pack");
        const btnDownload = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById("btn-download");
        if (btnPack != null) {
            btnPack.addEventListener("click", () => {
                this.onPackTextureClicked();
            });
        }
        if (btnDownload != null) {
            btnDownload.addEventListener("click", () => {
                return;
            });
        }
    }
    packChannels(resultCanvas, redCanvas, greenCanvas, blueCanvas, alphaCanvas) {
        var _a, _b, _c, _d, _e;
        let resultcanvasContext = resultCanvas.getContext("2d");
        const redImage = (_a = redCanvas === null || redCanvas === void 0 ? void 0 : redCanvas.getContext("2d")) === null || _a === void 0 ? void 0 : _a.getImageData(0, 0, redCanvas.width, redCanvas.height);
        const greenImage = (_b = greenCanvas === null || greenCanvas === void 0 ? void 0 : greenCanvas.getContext("2d")) === null || _b === void 0 ? void 0 : _b.getImageData(0, 0, greenCanvas.width, greenCanvas.height);
        const blueImage = (_c = blueCanvas === null || blueCanvas === void 0 ? void 0 : blueCanvas.getContext("2d")) === null || _c === void 0 ? void 0 : _c.getImageData(0, 0, blueCanvas.width, blueCanvas.height);
        const alphaImage = (_d = alphaCanvas === null || alphaCanvas === void 0 ? void 0 : alphaCanvas.getContext("2d")) === null || _d === void 0 ? void 0 : _d.getImageData(0, 0, alphaCanvas.width, alphaCanvas.height);
        const resultImage = (_e = resultCanvas === null || resultCanvas === void 0 ? void 0 : resultCanvas.getContext("2d")) === null || _e === void 0 ? void 0 : _e.getImageData(0, 0, resultCanvas.width, resultCanvas.height);
        const redData = redImage === null || redImage === void 0 ? void 0 : redImage.data;
        const greenData = greenImage === null || greenImage === void 0 ? void 0 : greenImage.data;
        const blueData = blueImage === null || blueImage === void 0 ? void 0 : blueImage.data;
        const alphaData = alphaImage === null || alphaImage === void 0 ? void 0 : alphaImage.data;
        const resultData = resultImage === null || resultImage === void 0 ? void 0 : resultImage.data;
        if (redData == null ||
            greenData == null ||
            blueData == null ||
            alphaData == null ||
            resultData == null)
            return;
        for (let i = 0; i < redData.length; i += 4) {
            const red = redData[i];
            const green = greenData[i];
            const blue = blueData[i];
            const alpha = alphaData[i];
            resultData[i + 0] = red;
            resultData[i + 1] = green;
            resultData[i + 2] = blue;
            resultData[i + 3] = alpha;
        }
        if (resultcanvasContext == null || resultImage == null)
            return;
        resultcanvasContext.putImageData(resultImage, 0, 0);
        this.setDisplayImage(resultCanvas);
    }
    getBiggestImageIndex(images) {
        let biggestImage = 0;
        let biggestImageSize = 0;
        for (let i = 0; i < images.length; i++) {
            let currentImageSize = images[i].naturalWidth * images[i].naturalHeight;
            if (currentImageSize > biggestImageSize) {
                biggestImageSize = currentImageSize;
                biggestImage = i;
            }
        }
        return biggestImage;
    }
    setupCanvas(canvas, image, width, height) {
        let canvasContext = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        if (canvasContext == null)
            return;
        canvasContext.drawImage(image, 0, 0, width, height);
    }
    applyGrayScale(canvas) {
        let canvasContext = canvas.getContext("2d");
        if (canvasContext == null)
            return;
        const image = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const imageData = image.data;
        for (let i = 0; i < imageData.length; i += 4) {
            const red = imageData[i];
            const green = imageData[i + 1];
            const blue = imageData[i + 2];
            const grayValue = (red + green + blue) / 3;
            imageData[i] = grayValue;
            imageData[i + 1] = grayValue;
            imageData[i + 2] = grayValue;
            imageData[i + 3] = 255;
        }
        canvasContext.putImageData(image, 0, 0);
    }
    setDisplayImage(canvas) {
        var _a;
        const displayImage = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("display-image");
        displayImage.src = canvas.toDataURL("image/png");
    }
}
customElements.define("image-packer", ImagePacker);
function applyGrayScale(resultCanvas) {
    throw new Error("Function not implemented.");
}
