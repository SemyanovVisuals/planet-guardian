import { setInterval } from "./Util"

@component
export class Score extends BaseScriptComponent {
    @input camera : Camera
    @input populationText : Text
    @input rocketsText : Text

    private population : number = 1
    private rockets : number = 0

    onAwake() {
        this.createEvent("UpdateEvent").bind(this.facePlayer.bind(this));
    
        setInterval(() => {
            this.population += 1 / Math.sqrt(this.population);
            this.populationText.text = this.fmt(this.population);
        }, 10);
        
        setInterval(() => {
            this.rockets += 1;
            this.rocketsText.text = this.rockets.toString();
        }, 10_000);
    }

    private fmt(population: number): string {
        const units = [ "", "K", "M", "B" ];

        /*for (const unit of units) {
            if (population < 1000)
                return Math.floor(population) + unit;

            population /= 1000;
        }*/

        for (const unit of units) {
            if (population < 1000)
                return Math.floor(population) + unit;

            population -= 1000;
        }

        return population + "?";
    }

    public impact(damage: number) {
        this.population /= 2;
    }

    private facePlayer() {
        const src = this.getTransform().getWorldPosition();
        const target = this.camera.getTransform().getWorldPosition();
        const dir = target.sub(src).normalize();
        this.getTransform().setWorldRotation(quat.lookAt(dir, vec3.up()));
    }
}
