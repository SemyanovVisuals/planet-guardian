import { Planet } from "./Planet"
import { Asteroid } from "./Asteroid"

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
        const randomDir = vec3.randomDirection().mult(new vec3(1, 0, 1)).normalize();
        // I still dont know how to multiply by scalar value :/
        const randomPos = randomDir.mult(new vec3(this.orbitRadius, this.orbitRadius, this.orbitRadius));
        prefab.getTransform().setLocalPosition(randomPos);
    }

    private update() {
        const transform = this.getTransform();
        const rotation = quat.fromEulerAngles(0, getTime() * this.rotationSpeed, 0);
        transform.setLocalRotation(rotation);
    }
}
