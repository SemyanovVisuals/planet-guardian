import { DestroyableObject } from "../../Scripts/DestroyableObject"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"

@component
export class Alien extends DestroyableObject {
    onAwake() {
        const dir = vec3.randomDirection().mult(new vec3(1, 0.1, 1)).normalize();
        const pos = dir.uniformScale(40.0);

        this.getTransform().setLocalPosition(pos);
        
        this.createEvent("UpdateEvent").bind(this.update.bind(this));
    }

    onDestroy(hand: TrackedHand | null) {
        console.log("ASTEROID DESTROY!");

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

    private update() {
        this.getTransform().setLocalRotation(quat.fromEulerAngles(0, getTime(), 0));
    }
}
