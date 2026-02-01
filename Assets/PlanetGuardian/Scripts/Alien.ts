import { DestroyableObject } from "../../Scripts/DestroyableObject"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"

@component
export class Alien extends DestroyableObject {
    @input squishAudio : AudioComponent
    @input beam : SceneObject

    onAwake() {
        const orbit = 45.0;
        const dir = vec3.randomDirection();
        const pos = dir.uniformScale(orbit);
        const rot = quat.rotationFromTo(vec3.up(), dir);

        this.getTransform().setLocalPosition(pos);
        this.getTransform().setLocalRotation(rot);
        
        this.createEvent("UpdateEvent").bind(this.update.bind(this));
                
        this.beam.getTransform().setLocalPosition(new vec3(0, 4 - orbit * 0.5, 0));
        this.beam.getTransform().setLocalScale(new vec3(1, orbit * 0.5, 1));

        animate({
            easing: "ease-out-sine",
            duration: 2,
            update: (t: number) => {
                this.getTransform()?.setLocalPosition(vec3.lerp(pos.uniformScale(1.2), pos, Math.sqrt(t)))
                this.getTransform()?.setLocalScale(vec3.lerp(vec3.zero(), vec3.one(), t))
            },
        })
    }

    onDestroy(hand: TrackedHand | null) {
        console.log("ASTEROID DESTROY!");

        const currentScale = this.getTransform().getLocalScale();

        this.squishAudio.play(1);

        animate({
            easing: "ease-out-cubic",
            duration: 1,
            update: (t: number) => {
                this.getTransform()?.setLocalScale(vec3.lerp(currentScale, vec3.zero(), t))
            },
            ended: () => this.sceneObject.destroy(),
        })
    }

    private update() {
       // this.getTransform().setLocalRotation(quat.fromEulerAngles(0, getTime(), 0));
    }
}
