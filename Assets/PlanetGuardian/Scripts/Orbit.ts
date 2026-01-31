import { Planet } from "./Planet"
import { Asteroid } from "./Asteroid"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class Orbit extends BaseScriptComponent {
    @input rotationSpeed : number = 0.1
    @input orbitRadius : number = 20.0
    @input asteroidPrefab : ObjectPrefab

    @typename
    Asteroid: keyof ComponentNameMap

    onAwake() {
        this.createEvent("UpdateEvent").bind(this.update.bind(this))
    }

    public spawnAsteroid() {
        console.log("Spawning asteroid in: " + this.getSceneObject().name);

        const prefab = this.asteroidPrefab.instantiate(this.getSceneObject());
        // TODO: There must be a way to access the Asteroid component from prefab
    }

    private update() {
        const transform = this.getTransform();
        const rotation = quat.fromEulerAngles(0, getTime() * this.rotationSpeed, 0);
        transform.setLocalRotation(rotation);
    }
}
