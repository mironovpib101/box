import Stats from "three/examples/jsm/libs/stats.module";

export default class FPS {
  private readonly stats: Stats;

  constructor() {
    this.stats = Stats();
    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.top = "0px";
  }

  public getDOMElement(): HTMLDivElement {
    return this.stats.domElement;
  }
}
