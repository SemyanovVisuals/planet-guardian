import { Orbit } from "./Orbit";
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { DestroyableObject } from "../../Scripts/DestroyableObject";

@component
export class Asteroid extends DestroyableObject {
    @input model: SceneObject;
    @input particles: SceneObject;
    @input explosion: ObjectPrefab;
    @input audioSpawn : AudioComponent
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
    private isReturning: boolean = false;
    private lastOrbitPos: vec3 = null;

    onAwake() {
        const tr = this.getTransform();
        // this.audioSpawn.play(1);

        this.dir = vec3.randomDirection().mult(new vec3(1, 0.1, 1)).normalize();

        const pos = this.dir.uniformScale(this.orbitRadius);
        const randomOffset = vec3.randomDirection();
        this.finalPos = pos.add(randomOffset);

        this.finalScale = vec3.one().uniformScale(Math.random() * 0.5 + 0.5);
        this.spawnTime = getTime();

        this.rotation = vec3.randomDirection().uniformScale(Math.random() * 2 + 1);

        this.lastOrbitPos = tr.getLocalPosition()

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

        this.isFalling = true

        const tr = this.getTransform();
        const startPos = tr.getLocalPosition();

        this.lastOrbitPos = startPos

        this.particles.enabled = true;
        
        // TODO: make particles follow asteroid's direction
    }

    public tryRedirect() {
        if (this.isFalling) {
            this.isFalling = false
            this.particles.enabled = false;
            print("REDIRECT")

            this.isReturning = true
        }
    }

    private update() {
        if (this.isDestroying) return;

        const tr = this.getTransform();

        const timePast = Math.min((getTime() - this.spawnTime) / 10.0, 1.0);
        const t = Math.sin(timePast * (Math.PI / 2));

        // Calculate rotation for the model, continue spinning even when falling
        const rot = quat.fromEulerVec(this.rotation.uniformScale(getTime() * this.rotationSpeed));
        this.model.getTransform().setLocalRotation(rot);

        // Orbiting calculation (applies when not falling)
        const enterOrbit = this.dir.uniformScale((1 - Math.sqrt(t)) * 40);

        tr.setLocalScale(vec3.lerp(vec3.zero(), this.finalScale, t));

        // Orbiting motion (if not falling)
        if (this.isFalling) {
            // FALLING: Move vertically toward the center of Earth
            const currentPos = tr.getLocalPosition();

            // Keep the same horizontal direction (X and Z) and move vertically towards (0,0,0)
            const targetPos = vec3.zero(); // center of Earth
            const direction = new vec3(-currentPos.x, -currentPos.y, -currentPos.z).normalize(); // X and Z direction is kept
            const fallSpeed = 3; // adjust fall speed as needed

            // Move along Y-axis towards the center
            const newPos = currentPos.add(direction.uniformScale(fallSpeed * getDeltaTime()));

            tr.setLocalPosition(newPos);

            // If we are very close to the center (Earth), finalize fall
            if (newPos.distance(vec3.zero()) < 8) {
                //tr.setLocalPosition(vec3.zero()); // Ensure it's exactly at the center
                this.onDestroyAsteroid(); // Finalize asteroid destruction
                // TODO: effect
            }
        } else if (this.isReturning) {
            const currentPos = tr.getLocalPosition();
            const targetPos = this.lastOrbitPos;

            const dir = targetPos.sub(currentPos);
            const dist = currentPos.distance(targetPos);

            const returnSpeed = 4;
            const step = returnSpeed * getDeltaTime();

            if (dist > 0.05) {
                tr.setLocalPosition(
                    currentPos.add(dir.normalize().uniformScale(step))
                );
            } else {
                // Snap exactly onto orbit and stop correcting
                tr.setLocalPosition(targetPos);
                this.isReturning = false
                this.lastOrbitPos = null;
            }
        } else {
            tr.setLocalPosition(this.finalPos.add(enterOrbit));
        }
    }

}
