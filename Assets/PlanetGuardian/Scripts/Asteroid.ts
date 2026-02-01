import { Orbit } from "./Orbit";
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { DestroyableObject } from "../../Scripts/DestroyableObject";

@component
export class Asteroid extends DestroyableObject {
    @input model: SceneObject;
    @input particles: SceneObject;
    @input explosion: ObjectPrefab;
    @input rotationSpeed: number = 0.1;
    @input orbitRadius: number = 30.0;

    private rotation: vec3 = vec3.zero();
    private finalScale: vec3 = vec3.one();
    private finalPos: vec3 = vec3.zero();
    private dir: vec3 = vec3.forward();
    private spawnTime: number = 0;

    private orbit: Orbit | null = null;
    private isDestroying: boolean = false;

    private isFalling: boolean = false;
    private lastOrbitPos: mat4 = null;

    onAwake() {
        const tr = this.getTransform();

        this.dir = vec3.randomDirection().mult(new vec3(1, 0.1, 1)).normalize();

        const pos = this.dir.uniformScale(this.orbitRadius);
        const randomOffset = vec3.randomDirection();
        this.finalPos = pos.add(randomOffset);

        this.finalScale = vec3.one().uniformScale(Math.random() * 0.5 + 0.5);
        this.spawnTime = getTime();

        this.rotation = vec3.randomDirection().uniformScale(Math.random() * 2 + 1);

        // flame orientation
        tr.setLocalRotation(quat.rotationFromTo(vec3.zero(), this.finalPos));

        this.createEvent("UpdateEvent").bind(this.update.bind(this));
    }

    public setOrbit(orbit: Orbit) {
        this.orbit = orbit;
    }

    public onDestroyAsteroid() {
        if (this.isDestroying) return;
        this.isDestroying = true;

        // Remove from orbit list if we have one
        this.orbit?.removeAsteroid(this);

        const tr = this.getTransform();
        const startScale = tr.getLocalScale();

        animate({
            easing: "ease-out-bounce",
            duration: 1,
            update: (t: number) => {
                tr.setLocalScale(vec3.lerp(startScale, vec3.zero(), t));
            },
            ended: () => this.sceneObject.destroy(),
        });
    }

    public enterPlanet() {
        if (this.isDestroying) return;

        const tr = this.getTransform();
        const startPos = tr.getLocalPosition();
        const lastOrbitPos = tr.getWorldTransform();

        this.particles.enabled = true;

        // TODO: remove parent, move the object!!
        //this.getSceneObject.

        // animate({
        //     easing: "ease-out-sine",
        //     duration: 5,
        //     update: (t: number) => {
        //         tr.setLocalPosition(vec3.lerp(startPos, vec3.zero(), t));
        //     },
        //     ended: () => this.onDestroyAsteroid(),
        // });
    }

    private update() {
        if (this.isDestroying) return;

        const tr = this.getTransform();

        const timePast = Math.min((getTime() - this.spawnTime) / 10.0, 1.0);
        const t = Math.sin(timePast * (Math.PI / 2));

        const rot = quat.fromEulerVec(this.rotation.uniformScale(getTime() * this.rotationSpeed));
        this.model.getTransform().setLocalRotation(rot);

        const enterOrbit = this.dir.uniformScale((1 - Math.sqrt(t)) * 40);

        tr.setLocalScale(vec3.lerp(vec3.zero(), this.finalScale, t));
        tr.setLocalPosition(this.finalPos.add(enterOrbit));
    }
}
