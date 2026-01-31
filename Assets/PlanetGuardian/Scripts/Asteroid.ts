import animate, {CancelSet} from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class Asteroid extends BaseScriptComponent {
    @input model : SceneObject
    @input particles : SceneObject
    @input rotationSpeed : number = 0.1
    @input orbitRadius : number = 25.0
    
    private rotation : vec3
    private finalScale : vec3
    private finalPos : vec3
    private dir : vec3
    private spawnTime : number

    onAwake() {
        this.dir = vec3.randomDirection().mult(new vec3(1, 0.1, 1)).normalize();
        const pos = this.dir.uniformScale(this.orbitRadius);
        const randomOffset = vec3.randomDirection();
        this.finalPos = pos.add(randomOffset);
        this.finalScale = vec3.one().uniformScale(Math.random() * 0.5 + 0.5);
        this.spawnTime = getTime();

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
    }

    public onDestroy() {
       // this.cancelSet.cancel();
        this.sceneObject.destroy();
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

    private update() {
        const timePast = Math.min((getTime() - this.spawnTime) / 10.0, 1.0);
        const t = Math.sin(timePast * (Math.PI / 2));
        const rotation = quat.fromEulerVec(this.rotation.uniformScale(getTime() * this.rotationSpeed));
        this.model.getTransform().setLocalRotation(rotation);

        const enterOrbit = this.dir.uniformScale((1 - Math.sqrt(t)) * 40);
   
        this.getTransform().setLocalScale(vec3.lerp(vec3.zero(), this.finalScale, t))
        this.getTransform().setLocalPosition(this.finalPos.add(enterOrbit));
    }
}
