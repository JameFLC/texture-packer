class ImagePacker extends HTMLElement {
  // Properties

  // Red Channel Image
  private _redImage = new Image();
  public get redImage() {
    return this._redImage;
  }
  public set redImage(value) {
    this._redImage = value;
    console.log("Recieved Red Image ", this._redImage);
  }

  // Green Channel Image
  private _greenImage = new Image();
  public get greenImage() {
    return this._greenImage;
  }
  public set greenImage(value) {
    this._greenImage = value;
    console.log("Recieved Green Image ", this._greenImage);
  }

  // Blue Channel Image
  private _blueImage = new Image();
  public get blueImage() {
    return this._blueImage;
  }
  public set blueImage(value) {
    this._blueImage = value;
    console.log("Recieved blue Image ", this._blueImage);
  }

  // Alpha Channel Image
  private _alphaImage = new Image();
  public get alphaImage() {
    return this._alphaImage;
  }
  public set alphaImage(value) {
    this._alphaImage = value;
    console.log("Recieved alpha Image ", this._blueImage);
  }

  constructor() {
    super();

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

  render(): void {
    // Check if the element is renerable
    if (this.shadowRoot == null) return;

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
  setupEventLisceners(): void {
    const btnPack = this.shadowRoot?.getElementById("btn-pack");
    const btnDownload = this.shadowRoot?.getElementById("btn-download");

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

  onPackTextureClicked = () => {
    if (this.shadowRoot == null) return;
    const resultChannelCanvas = this.shadowRoot.getElementById(
      "result-channel-canvas"
    ) as HTMLCanvasElement;
    const redChannelCanvas = this.shadowRoot.getElementById(
      "red-channel-canvas"
    ) as HTMLCanvasElement;
    const greenChannelCanvas = this.shadowRoot.getElementById(
      "green-channel-canvas"
    ) as HTMLCanvasElement;
    const blueChannelCanvas = this.shadowRoot.getElementById(
      "blue-channel-canvas"
    ) as HTMLCanvasElement;
    const alphaChannelCanvas = this.shadowRoot.getElementById(
      "alpha-channel-canvas"
    ) as HTMLCanvasElement;

    this.applyGrayScale(resultChannelCanvas);

    const images = [
      this._redImage,
      this._greenImage,
      this._blueImage,
      this._alphaImage,
    ];
    console.log(
      "Red image size is ",
      this._redImage.width,
      " by ",
      this._redImage.height,
      this._redImage
    );
    const canvases = [
      redChannelCanvas,
      greenChannelCanvas,
      blueChannelCanvas,
      alphaChannelCanvas,
    ];

    const biggestImageIndex = this.getBiggestImageIndex(images);

    for (let i = 0; i < images.length; i++) {
      this.setupCanvas(
        canvases[i],
        images[i],
        images[biggestImageIndex].naturalWidth,
        images[biggestImageIndex].naturalHeight
      );
    }

    this.setupCanvas(
      resultChannelCanvas,
      images[0],
      images[biggestImageIndex].naturalWidth,
      images[biggestImageIndex].naturalHeight
    );
    // Unifor each canvas color channels
    this.applyGrayScale(redChannelCanvas);
    this.applyGrayScale(greenChannelCanvas);
    this.applyGrayScale(blueChannelCanvas);
    this.applyGrayScale(alphaChannelCanvas);

    this.packChannels(
      resultChannelCanvas,
      redChannelCanvas,
      greenChannelCanvas,
      blueChannelCanvas,
      alphaChannelCanvas
    );
  };

  packChannels(
    resultCanvas: HTMLCanvasElement,
    redCanvas: HTMLCanvasElement,
    greenCanvas: HTMLCanvasElement,
    blueCanvas: HTMLCanvasElement,
    alphaCanvas: HTMLCanvasElement
  ): void {
    let resultcanvasContext = resultCanvas.getContext("2d");

    const redImage = redCanvas
      ?.getContext("2d")
      ?.getImageData(0, 0, redCanvas.width, redCanvas.height);
    const greenImage = greenCanvas
      ?.getContext("2d")
      ?.getImageData(0, 0, greenCanvas.width, greenCanvas.height);
    const blueImage = blueCanvas
      ?.getContext("2d")
      ?.getImageData(0, 0, blueCanvas.width, blueCanvas.height);
    const alphaImage = alphaCanvas
      ?.getContext("2d")
      ?.getImageData(0, 0, alphaCanvas.width, alphaCanvas.height);
    const resultImage = resultCanvas
      ?.getContext("2d")
      ?.getImageData(0, 0, resultCanvas.width, resultCanvas.height);

    const redData = redImage?.data;
    const greenData = greenImage?.data;
    const blueData = blueImage?.data;
    const alphaData = alphaImage?.data;
    const resultData = resultImage?.data;

    if (
      redData == null ||
      greenData == null ||
      blueData == null ||
      alphaData == null ||
      resultData == null
    )
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

    if (resultcanvasContext == null || resultImage == null) return;

    resultcanvasContext.putImageData(resultImage, 0, 0);
    this.setDisplayImage(resultCanvas);
  }

  getBiggestImageIndex(images: HTMLImageElement[]) {
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

  setupCanvas(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    width: number,
    height: number
  ) {
    let canvasContext = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    if (canvasContext == null) return;
    canvasContext.drawImage(image, 0, 0, width, height);
  }

  applyGrayScale(canvas: HTMLCanvasElement): void {
    let canvasContext = canvas.getContext("2d");

    if (canvasContext == null) return;

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

  setDisplayImage(canvas: HTMLCanvasElement) {
    const displayImage = this.shadowRoot?.getElementById(
      "display-image"
    ) as HTMLImageElement;

    displayImage.src = canvas.toDataURL("image/png");
  }
}
customElements.define("image-packer", ImagePacker);
function applyGrayScale(resultCanvas: any) {
  throw new Error("Function not implemented.");
}
