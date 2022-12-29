class ImageInput extends HTMLElement {
  // Atributes
  channelName: string = "Some ";

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
    return ["channel-name"];
  }

  // Watch HTML atribute changes and update the rendered HTML
  attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    // Prevent "Infinite" loopback
    if (newValue === oldValue) return;

    // Update the atributes
    switch (name) {
      case "channel-name":
        this.channelName = newValue || "";
        break;
    }
    this.render();
  }

  // Render the html in the DOM
  render(): void {
    // Check if the element is renerable
    if (this.shadowRoot == null) return;

    this.shadowRoot.innerHTML = /*html*/ `
        <link rel="stylesheet" href="./assets/css/index.css">

        <div class="image-box-container">
            <div class="image-input-box" id="image-box">
                <input id="image-input" type="file" name="" accept="image/*" class="hidden">
                <label for="image-input" title="Image file input. Drop an image or click here.">
                  <img id="display-image"src="./assets/images/transparent-pixel.png" alt="">
                  <p class="image-description">Drop an image or click here !</p>
                </label>
                <canvas id="storage-canvas" class="hidden"></canvas>
            </div>
            <h2>${this.channelName} Channel</h2>
        </div>
        `;
  }

  setupEventLisceners(): void {
    if (this.shadowRoot == null) return;
    const imageInput = this.shadowRoot.getElementById(
      "image-input"
    ) as HTMLInputElement;
    const imageBox = this.shadowRoot.getElementById(
      "image-box"
    ) as HTMLInputElement;

    imageInput.addEventListener("change", (event) => {
      const files = (event.target as HTMLInputElement)?.files;
      if (files == null) return;
      this.setupChannel(files);
    });

    imageBox.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    imageBox.addEventListener("drop", (event) => {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (files == null) return;
      this.setupChannel(files);
    });
  }

  setupChannel(files: FileList): void {
    if (files.length === 0) return;
    const displayImage = this.shadowRoot?.getElementById(
      "display-image"
    ) as HTMLImageElement;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      displayImage.onload = () => {
        this.updateCanvas(displayImage);
      };
      displayImage.src = reader.result as string;
      console.log(this.channelName + "  channel image is ", files[0], " ");
    };
  }

  updateCanvas(displayImage: HTMLImageElement): void {
    const storageCanvas = this.shadowRoot?.getElementById(
      "storage-canvas"
    ) as HTMLCanvasElement;

    if (storageCanvas == null) return;

    let canvasContext = storageCanvas.getContext("2d");

    if (canvasContext == null) return;

    storageCanvas.width = displayImage.width;
    storageCanvas.height = displayImage.height;
    canvasContext.drawImage(
      displayImage,
      0,
      0,
      displayImage.width,
      displayImage.height
    );
  }

  getCanvas(): HTMLCanvasElement {
    return this.shadowRoot?.getElementById(
      "storage-canvas"
    ) as HTMLCanvasElement;
  }
}

customElements.define("image-input", ImageInput);
