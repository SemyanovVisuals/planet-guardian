import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import { Asteroid } from "../PlanetGuardian/Scripts/Asteroid"

@component
export class DestroyableObject extends BaseScriptComponent {

    private bodyComponent: BodyComponent | null = null
    private colliderComponent: ColliderComponent | null = null

    onAwake() {
        this.colliderComponent = this.getSceneObject().getComponent("Physics.ColliderComponent")
    }

    onDestroy(hand: TrackedHand) {
        const asteroid = this.findAsteroidComponent(this.sceneObject)

        if(asteroid){
            asteroid.onDestroyAsteroid()
            return
        }

        this.sceneObject.destroy()
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
}
