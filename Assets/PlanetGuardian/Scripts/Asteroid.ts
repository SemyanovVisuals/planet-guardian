import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class Asteroid extends BaseScriptComponent {
    @input model : SceneObject
    @input particles : SceneObject
    @input rotationSpeed : number = 0.1
    @input orbitRadius : number = 25.0
    
    private rotation : vec3

    onAwake() {
        const dir = vec3.randomDirection().mult(new vec3(1, 0.1, 1)).normalize();
        const pos = dir.uniformScale(this.orbitRadius);
        const randomOffset = vec3.randomDirection();
        const finalPos = pos.add(randomOffset);
        const finalScale = vec3.one().uniformScale(Math.random() * 0.5 + 0.5);

        // Orbit animation
        animate({
            easing: "ease-out-sine",
            duration: 10,
            update: (t: number) => {
                const enterOrbit = dir.uniformScale((1 - Math.sqrt(t)) * 40);
   
                this.getTransform().setLocalScale(vec3.lerp(vec3.zero(), finalScale, t))
                this.getTransform().setLocalPosition(finalPos.add(enterOrbit));
            },
            ended: null,
        })

        this.createEvent("UpdateEvent").bind(this.update.bind(this))
        this.rotation = vec3.randomDirection().uniformScale(Math.random() * 2 + 1)
        
        // This is so that the flame particles are moving in the correct direction
        this.getTransform()
            .setLocalRotation(quat.rotationFromTo(vec3.zero(), finalPos))
    }

    public enterPlanet() {
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

    public test() { return 1 }

    private update() {
        const rotation = quat.fromEulerVec(this.rotation.uniformScale(getTime() * this.rotationSpeed));
        this.model.getTransform().setLocalRotation(rotation);
    }
}
