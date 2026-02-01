import { setInterval } from "./Util"

@component
export class Score extends BaseScriptComponent {
    @input camera : Camera
    @input populationText : Text
    @input rocketsText : Text

    private population : number = 1
    private rockets : number = 0

    onAwake() {
        this.createEvent("UpdateEvent").bind(this.update.bind(this));
    
        setInterval(() => {
            this.population += 1 / Math.sqrt(this.population);
        }, 10);
        
        setInterval(() => {
            this.rockets += 1;
        }, 10_000);
    }

    public takeRocket(): boolean {
        const canTake = this.rockets > 0;

        if (canTake) this.rockets --;

        return canTake
    }

    private fmt(population: number): string {
        const units = [ "", "K", "M", "B" ];

        for (const unit of units) {
            if (population < 1000)
                return Math.floor(population) + unit;

            population /= 1000;
        }

        /*for (const unit of units) {
            if (population < 1000)
                return Math.floor(population) + unit;

            population -= 1000;
        }*/

        return population + "?";
    }

    public impact(amount: number) {
        this.population *= Math.max(0.0, Math.min(1.0, 1.0 - amount * 2.0));
    }

    public damage(amount: number) {
        this.population = Math.max(this.population - amount, 0);
    }

    private update() {
        const src = this.getTransform().getWorldPosition();
        const target = this.camera.getTransform().getWorldPosition();
        const dir = target.sub(src).normalize();
        this.getTransform().setWorldRotation(quat.lookAt(dir, vec3.up()));

        this.populationText.text = this.fmt(this.population);
        this.rocketsText.text = this.rockets.toString();
    }
}
