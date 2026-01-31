import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class Asteroid extends BaseScriptComponent {
    @input rotationSpeed : number = 0.1
    @input orbitRadius : number = 25.0

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

        
        const dir = vec3.randomDirection().mult(new vec3(1, 0.1, 1)).normalize();
        const pos = dir.uniformScale(this.orbitRadius);
        const randomOffset = vec3.randomDirection().uniformScale(3);

       // prefab.getTransform().setLocalPosition(pos.add(randomOffset));

        const finalScale = vec3.one().uniformScale(Math.random() * 0.5 + 0.5);

        // Orbit animation
        animate({
            easing: "ease-out-sine",
            duration: 10,
            update: (t: number) => {
                this.getTransform().setLocalScale(vec3.lerp(vec3.zero(), finalScale, t))

                const enterOrbit = dir.uniformScale((1 - Math.sqrt(t)) * 40);
   
                this.getTransform().setLocalPosition(pos.add(randomOffset).add(enterOrbit));
            },
            ended: null,
        })

        this.createEvent("UpdateEvent").bind(this.update.bind(this))
        this.rotation = vec3.randomDirection().uniformScale(Math.random() * 2 + 1)
    }

    public enterOrbit() {
        const startPos = this.getTransform().getLocalPosition();

        animate({
            easing: "ease-out-sine",
            duration: 5,
            update: (t: number) => {
                this.getTransform().setLocalPosition(vec3.lerp(startPos, vec3.zero(), t));
            },
            ended: null,
        })
    }

    private update() {
        const transform = this.getTransform();
        const rotation = quat.fromEulerVec(this.rotation.uniformScale(getTime() * this.rotationSpeed));
        transform.setLocalRotation(rotation);
    }
}
