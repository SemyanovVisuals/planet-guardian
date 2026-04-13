import { DestroyableObject } from "../../Scripts/DestroyableObject"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"
import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import { Score } from "./Score"
import { Interval, setInterval } from "./Util"

@component
export class Satellite extends DestroyableObject {
    @input squishAudio : AudioComponent
    @input beam : SceneObject
    @input model : SceneObject

    public startTime : number
    damageInterval : Interval

    onAwake() {
        this.startTime = getTime()

        const orbit = 45.0;
        const dir = vec3.randomDirection();
        const pos = dir.uniformScale(orbit);
        const rot = quat.rotationFromTo(vec3.back(), dir);

        this.getTransform().setLocalPosition(pos);
        this.getTransform().setLocalRotation(rot);
        
        this.createEvent("UpdateEvent").bind(this.update.bind(this));
                
        this.beam.getTransform().setLocalPosition(new vec3(0, 0, orbit * 0.5));
        this.beam.getTransform().setLocalScale(new vec3(0.25, orbit * 0.65, 0.25));
        this.beam.getTransform().setLocalRotation(quat.fromEulerAngles(Math.PI / 2, 0, 0));

        this.damageInterval = setInterval(() => Score.instance.damage(5), 500);
        this.damageInterval.setPaused(false);

        animate({
            easing: "ease-out-sine",
            duration: 2,
            update: (t: number) => {
                this.getTransform()?.setLocalPosition(vec3.lerp(pos.uniformScale(1.2), pos, Math.sqrt(t)))
                this.getTransform()?.setLocalScale(vec3.lerp(vec3.zero(), vec3.one(), t))
            },
        })
    }
    
    public setPaused(state: boolean) {
        this.damageInterval.setPaused(state);
    }

    onDestroy(hand: TrackedHand | null) {
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
        this.model.getTransform().setLocalRotation(quat.fromEulerAngles(0, 0, getTime() * 0.1));
    }
}
