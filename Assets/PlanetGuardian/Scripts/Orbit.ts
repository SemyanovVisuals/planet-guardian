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
        
        const dir = vec3.randomDirection().mult(new vec3(1, 0, 1)).normalize();
        const pos = dir.uniformScale(this.orbitRadius);
        const randomOffset = vec3.randomDirection().uniformScale(3);

        prefab.getTransform().setLocalPosition(pos.add(randomOffset));

        // Scale-in animation
        /*animate({
        //    easing: "ease-in-elastic",
            duration: 5,
            update: (t: number) => {
                this.getTransform().setLocalScale(vec3.lerp(vec3.zero(), vec3.one(), t))
   
                const randomPos = randomDir.uniformScale(this.orbitRadius);
                prefab.getTransform().setLocalPosition(randomPos);
            },
            ended: null,
        })*/
    }

    private update() {
        const transform = this.getTransform();
        const rotation = quat.fromEulerAngles(0, getTime() * this.rotationSpeed, 0);
        transform.setLocalRotation(rotation);
    }
}
