import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import { Asteroid } from "./Asteroid";

@component
export class Rocket extends BaseScriptComponent {
    //private startTime: number;

    onAwake() {
        // this.sceneObject.getComponent("Physics.ColliderComponent").onCollisionEnter.add((arg) => {
        //     const asteroid = this.findAsteroidComponent()
            
        //     this.onDestroy();
        //     if (asteroid) {
        //         asteroid.onDestroy(null);
        //     }
        // });

        const collider = this.sceneObject.getComponent("Physics.ColliderComponent")

        collider.onOverlapEnter.add((e: OverlapEnterEventArgs) => {
            // this.onFingerOverlapEnter(e, isLeftHand)
            this.onRocketOverlapEnter(e)
        })

        this.createEvent("UpdateEvent").bind(this.update.bind(this));
        setTimeout(this.onDestroyRocket.bind(this), 10_000);
    } 

    onRocketOverlapEnter(e: OverlapEnterEventArgs) {
        const overlappedObject = e.overlap.collider.getSceneObject()

        print(`Rocket: detected overlap with ${overlappedObject.name}`)

        // Check if this object has a GrabbableObject component
        const asteroid = this.findAsteroidComponent(overlappedObject)

        if(asteroid) {
            // ROCKET HIT ASTEROID: destroy both
            asteroid.onDestroyAsteroid()
            this.onDestroyRocket()
        }
    }
    
    /**
   * Find Asteroid component on a scene object
   */
    private findAsteroidComponent(sceneObject: SceneObject): Asteroid | null {
        const allComponents = sceneObject.getComponents("Component.ScriptComponent")
        for (let i = 0; i < allComponents.length; i++) {
            const comp = allComponents[i]
            // Check if this is a TriggerObject by checking if it has the required methods
            if (comp && typeof (comp as any).enterPlanet === "function") {
                return comp as Asteroid
            }
        }
        return null
    }

    onDestroyRocket() {
        this.sceneObject.destroy();
    }

    update() {
        const current = this.getTransform().getWorldPosition();
        const change = this.getTransform().up.uniformScale(getDeltaTime() * 10.0);
        this.getTransform().setWorldPosition(current.add(change));
    }
}
