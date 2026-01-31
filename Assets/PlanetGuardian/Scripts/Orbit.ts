import { Planet } from "./Planet"
import { Asteroid } from "./Asteroid"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class Orbit extends BaseScriptComponent {
    @input rotationSpeed : number = 0.1
    @input orbitRadius : number = 20.0
    @input asteroidPrefab : ObjectPrefab

    @typename
    Asteroid: keyof ComponentNameMap

    private static readonly MAX_ASTEROIDS = 3;  // same for every Orbit instance
    asteroids : Asteroid[]

    onAwake() {
        this.asteroids = [];
        this.createEvent("UpdateEvent").bind(this.update.bind(this))
    }

    public spawnAsteroid() {
        if (this.asteroids.length >= Orbit.MAX_ASTEROIDS) {
            return;
        }
        console.log("Spawning asteroid in: " + this.getSceneObject().name);

        const spawnedObj = this.asteroidPrefab.instantiate(this.getSceneObject());
        const newAsteroid = this.findAsteroidComponent(spawnedObj)

        if(newAsteroid) {
            newAsteroid.setOrbit(this as Orbit)
            this.asteroids.push(newAsteroid)
        }

        print("NUM OF ASTEROIDS: " + this.asteroids.length)
    }

    public removeAsteroid(asteroid: Asteroid) {
        const idx = this.asteroids.indexOf(asteroid);

        if (idx !== -1) {
            this.asteroids.splice(idx, 1);

            print("ASTEROID REMOVED")
            print("NUM OF ASTEROIDS: " + this.asteroids.length)
            // this.spawnAsteroid()
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

    // TODO: Check
    public getAsteroids(): object[] {

        return this.asteroids;
    }
}
