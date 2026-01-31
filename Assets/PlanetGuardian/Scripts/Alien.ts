import { DestroyableObject } from "../../Scripts/DestroyableObject"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"

@component
export class Alien extends DestroyableObject {
    @input squishAudio : AudioComponent
    @input beam : SceneObject

    onAwake() {
        const dir = vec3.randomDirection().normalize();
        const pos = dir.uniformScale(45.0);

        this.getTransform().setLocalPosition(pos);
        this.getTransform().setLocalRotation(quat.lookAt(dir, vec3.up()));
        
        this.createEvent("UpdateEvent").bind(this.update.bind(this));

        animate({
            easing: "ease-in-sine",
            duration: 2,
            update: (t: number) => {
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
