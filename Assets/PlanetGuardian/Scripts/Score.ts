import { Interval, setInterval } from "./Util"

@component
export class Score extends BaseScriptComponent {
    @input camera : Camera
    @input rocketsText : Text
    @input healthMat : Material

    private health : number = 100
    private rockets : number = 0
    private damageIndicator : number = 0

    public static instance : Score;
    
    private healthInterval : Interval;
    private rocketInterval : Interval;

    onAwake() {
        Score.instance = this;
        this.createEvent("UpdateEvent").bind(this.facePlayer.bind(this));
    
        this.healthInterval = setInterval(() => {
            this.health = Math.min(this.health + 0.1, 100);
            this.damageIndicator /= 1.2;
        }, 10);
        
        this.rocketInterval = setInterval(() => {
            this.rockets += 1;
        }, 7_000);
    }

    public setPaused(state: boolean) {
        this.rocketInterval.setPaused(state);
        this.healthInterval.setPaused(state);
    }

    public damage(damage: number) {
        this.damageIndicator = Math.min(damage / 10.0, 1.0);
        this.health = Math.max(0, this.health - damage);
        if (this.health <= 0)
            this.onDeath();
    }

    public onDeath() {

    }

    public takeRocket() : boolean {
        if (this.rockets > 0) {
            this.rockets--;
            return true;
        }
        return false;
    }

    private facePlayer() {
        const src = this.getTransform().getWorldPosition();
        const target = this.camera.getTransform().getWorldPosition();
        const dir = target.sub(src).normalize();
        this.getTransform().setWorldRotation(quat.lookAt(dir, vec3.up()));
        this.rocketsText.text = this.rockets.toString();
        this.healthMat.mainPass.level = this.health / 100.0;
        this.healthMat.mainPass.white = this.damageIndicator;
    }
}
