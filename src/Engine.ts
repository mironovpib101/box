import Ammo from "ammojs-typed";
import * as BABYLON from "babylonjs";

export default class Engine {
  private static scene: BABYLON.Scene;
  private static canvas: HTMLCanvasElement;
  private static e3d;

  private static createBox(): void {
    const playerBox = BABYLON.MeshBuilder.CreateBox(
      "pBox",
      { size: 10 },
      Engine.scene
    );
    playerBox.physicsImpostor = new BABYLON.PhysicsImpostor(
      playerBox,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 1,
      },
      Engine.scene
    );
    playerBox.position.y = 50;
    console.log("BOX INIT");
  }

  private static async createGround(): Promise<BABYLON.GroundMesh> {
    return new Promise((resolve) => {
      const groundMaterial = new BABYLON.StandardMaterial(
        "ground",
        Engine.scene
      );
      groundMaterial.diffuseTexture = new BABYLON.Texture(
        "https://playground.babylonjs.com/textures/earth.jpg",
        Engine.scene
      );
      const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
        "ground",
        "https://playground.babylonjs.com/textures/worldHeightMap.jpg",
        {
          width: 200,
          height: 200,
          subdivisions: 50,
          minHeight: 0,
          maxHeight: 30,
          updatable: false,
          onReady: () => {
            ground.physicsImpostor = new BABYLON.PhysicsImpostor(
              ground,
              BABYLON.PhysicsImpostor.HeightmapImpostor,
              { mass: 0 },
              Engine.scene
            );
            ground.material = groundMaterial;
            ground.receiveShadows = true;
            ground.checkCollisions = true;
            console.log("GROUND INIT");
            return resolve(ground);
          },
        },
        Engine.scene
      );
    });
  }

  private static async createScene(): Promise<void> {
    Engine.scene = new BABYLON.Scene(Engine.e3d);
    await Ammo();
    // Enable physics
    Engine.scene.enablePhysics(
      new BABYLON.Vector3(0, -10, 0),
      new BABYLON.AmmoJSPlugin()
    );

    // Light
    const spot = new BABYLON.PointLight(
      "spot",
      new BABYLON.Vector3(0, 300, 100),
      Engine.scene
    );
    spot.diffuse = new BABYLON.Color3(1, 1, 1);
    spot.specular = new BABYLON.Color3(0, 0, 0);

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      -1,
      0.5,
      200,
      BABYLON.Vector3.Zero(),
      Engine.scene
    );
    camera.attachControl(Engine.canvas, true);

    // Ground
    const ground = await Engine.createGround();
    camera.setTarget(ground);

    //box
    Engine.createBox();
  }

  public static createCanvas(): void {
    Engine.canvas = document.getElementById(
      "renderCanvas"
    ) as HTMLCanvasElement;
    Engine.canvas.width = window.innerWidth;
    Engine.canvas.height = window.innerHeight;
  }

  public static async run(): Promise<void> {
    // Get the canvas DOM element
    Engine.createCanvas();

    //create
    Engine.e3d = new BABYLON.Engine(Engine.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    });
    // CreateScene function that creates and return the scene
    await Engine.createScene();
    // run the render loop
    Engine.e3d.runRenderLoop(function () {
      Engine.scene.render();
    });
  }
}

Engine.run();
