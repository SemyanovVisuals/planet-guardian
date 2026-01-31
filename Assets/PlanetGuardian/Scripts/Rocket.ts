import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import { Asteroid } from "./Asteroid";

@component
export class Rocket extends BaseScriptComponent {
    //private startTime: number;

    onAwake() {
        this.sceneObject.getComponent("Physics.ColliderComponent").onCollisionEnter.add((arg) => {
            const asteroid = this.isAsteroid(arg.collision.collider.sceneObject);
            
                this.onDestroy();
            if (asteroid) {
                asteroid.onDestroy(null);
            }
        });
        this.createEvent("UpdateEvent").bind(this.update.bind(this));
        setTimeout(this.onDestroy.bind(this), 3_000);
    } 

    isAsteroid(obj : SceneObject): Asteroid {
        for (const script of obj.getComponents("Component.ScriptComponent")) {
            if (script.getTypeName().toString() == Asteroid.getTypeName().toString())
                return script as any as Asteroid;
        }
        return null;
    }

    onDestroy() {
        this.sceneObject.destroy();
    }

    update() {
        const current = this.getTransform().getWorldPosition();
        const change = this.getTransform().up.uniformScale(getDeltaTime() * 10.0);
        this.getTransform().setWorldPosition(current.add(change));
    }
}
