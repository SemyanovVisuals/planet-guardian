import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class Asteroid extends BaseScriptComponent {
    @input rotationSpeed : number = 0.1

    private rotation : vec3

    onAwake() {
        // Scale-in animation
        /*animate({
            easing: "ease-out-elastic",
            duration: 1.5,
            update: (t: number) => {
                this.getTransform().setLocalScale(vec3.lerp(vec3.zero(), vec3.one(), t))
            },
            ended: null,
        })
        */
        this.getTransform().setLocalScale(vec3.one().uniformScale(Math.random() * 0.5 + 0.5))
        this.createEvent("UpdateEvent").bind(this.update.bind(this))
        this.rotation = vec3.randomDirection()
    }

    private update() {
        const transform = this.getTransform();
        // idk how to multiply by scalar value :/
        const rotation = quat.fromEulerVec(this.rotation.uniformScale(getTime() * this.rotationSpeed));
        transform.setLocalRotation(rotation);
    }
}
