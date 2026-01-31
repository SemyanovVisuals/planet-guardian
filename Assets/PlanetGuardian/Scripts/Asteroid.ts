import { Orbit } from "./Orbit"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"
import { DestroyableObject } from "../../Scripts/DestroyableObject"
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"

@component
export class Asteroid extends DestroyableObject {
    @input model : SceneObject
    @input particles : SceneObject
    @input explosion : ObjectPrefab
    @input rotationSpeed : number = 0.1
    @input orbitRadius : number = 30.0
    
    private rotation : vec3
    private finalScale : vec3
    private finalPos : vec3
    private dir : vec3
    private spawnTime : number
    private orbit: Orbit
    private isDestroying : boolean

    onAwake() {
        this.dir = vec3.randomDirection().mult(new vec3(1, 0.1, 1)).normalize();
        const pos = this.dir.uniformScale(this.orbitRadius);
        const randomOffset = vec3.randomDirection();
        this.finalPos = pos.add(randomOffset);
        this.finalScale = vec3.one().uniformScale(Math.random() * 0.5 + 0.5);
        this.spawnTime = getTime();
        this.orbit = null;

        // Orbit animation
        /*animate({
            easing: "ease-out-sine",
            duration: 10,
            update: (t: number) => {
                const enterOrbit = dir.uniformScale((1 - Math.sqrt(t)) * 40);
   
                this.getTransform()?.setLocalScale(vec3.lerp(vec3.zero(), finalScale, t))
                this.getTransform()?.setLocalPosition(finalPos.add(enterOrbit));
            },
            ended: null,
            cancelSet: this.cancelSet,
        })*/

        this.createEvent("UpdateEvent").bind(this.update.bind(this))
        this.rotation = vec3.randomDirection().uniformScale(Math.random() * 2 + 1)
        
        // This is so that the flame particles are moving in the correct direction
        this.getTransform()
            .setLocalRotation(quat.rotationFromTo(vec3.zero(), this.finalPos))

        //setTimeout(() => this.onDestroy(null), 4_000);
    }

    public setOrbit(orbit: Orbit) {
        this.orbit = orbit;
    }

    public onDestroyAsteroid() {
        if (this.isDestroying)
            return;
        
        this.orbit.removeAsteroid(this as Asteroid)

        print("DESTROYING AN ASTEROID")

        this.isDestroying = true;

        /*
        this.explosion.instantiate(null).getTransform()
            .setWorldTransform(this.getTransform().getWorldTransform());
        this.sceneObject.destroy()*/

        const currentScale = this.getTransform().getLocalScale();

        animate({
            easing: "ease-out-bounce",
            duration: 1,
            update: (t: number) => {
                this.getTransform()?.setLocalScale(vec3.lerp(currentScale, vec3.zero(), t))
            },
            ended: () => this.sceneObject.destroy(),
        })
    }

    public enterPlanet() {
        print("ENTERING PLANET")
        const startPos = this.getTransform().getLocalPosition();
        this.particles.enabled = true;
        console.log("smash");

        animate({
            easing: "ease-out-sine",
            duration: 5,
            update: (t: number) => {
                this.getTransform().setLocalPosition(vec3.lerp(startPos, vec3.zero(), t));
            },
            ended: () => {
                this.sceneObject.destroy();
            },
        })
    }

    private update() {
        if (this.isDestroying) return;

        const timePast = Math.min((getTime() - this.spawnTime) / 10.0, 1.0);
        const t = Math.sin(timePast * (Math.PI / 2));
        const rotation = quat.fromEulerVec(this.rotation.uniformScale(getTime() * this.rotationSpeed));
        this.model.getTransform().setLocalRotation(rotation);

        const enterOrbit = this.dir.uniformScale((1 - Math.sqrt(t)) * 40);
   
        this.getTransform().setLocalScale(vec3.lerp(vec3.zero(), this.finalScale, t))
        this.getTransform().setLocalPosition(this.finalPos.add(enterOrbit));
    }
}
