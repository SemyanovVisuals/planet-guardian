import { Asteroid } from "./Asteroid"

@component
export class Planet extends BaseScriptComponent {
    @input rotationSpeed : number = 0.1

    onAwake() {
        this.createEvent("UpdateEvent").bind(this.update.bind(this))

        const collider = this.sceneObject.getComponent("Physics.ColliderComponent")

        collider.onOverlapEnter.add((e: OverlapEnterEventArgs) => {
            this.onPlanetOverlapEnter(e)
        })
    }

    onPlanetOverlapEnter(e: OverlapEnterEventArgs) {
        const overlappedObject = e.overlap.collider.getSceneObject()

        print(`Planet: detected overlap with ${overlappedObject.name}`)

        // Check if this object has a GrabbableObject component
        const asteroid = this.findAsteroidComponent(overlappedObject)

        // NOTE: not working. The collider appears to be super large, so 
        // collides with asteroids all the time. Disable for now!
        if(asteroid) {
            // ROCKET HIT ASTEROID: destroy both
            //asteroid.onDestroyAsteroid()
            //this.onAsteroidImpact()
            //print("PLANET HIT")
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

    private update() {
        const transform = this.getTransform();
        const rotation = quat.fromEulerAngles(0, getTime() * this.rotationSpeed, 0);
        transform.setLocalRotation(rotation);
    }

     onAsteroidImpact() {
        // TODO: haptics, population decrease
    }

}
