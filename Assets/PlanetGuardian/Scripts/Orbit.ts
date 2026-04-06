import { Planet } from "./Planet"
import { Asteroid } from "./Asteroid"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"
import { getScriptComponent } from "./Util"

@component
export class Orbit extends BaseScriptComponent {
    @input rotationSpeed : number = 0.1
    @input orbitRadius : number = 20.0
    @input asteroidPrefab : ObjectPrefab

    @typename
    Asteroid: keyof ComponentNameMap

    private static readonly MAX_ASTEROIDS = 3;  // same for every Orbit instance
    private asteroids : Asteroid[]
    private paused : boolean = true

    onAwake() {
        this.asteroids = [];
        this.createEvent("UpdateEvent").bind(this.update.bind(this))
    }

    public spawnAsteroid() {
        if (this.asteroids.length >= Orbit.MAX_ASTEROIDS) {
            return;
        }
        console.log("Spawning asteroid in: " + this.getSceneObject().name);

        const newAsteroid = getScriptComponent(Asteroid, this.asteroidPrefab.instantiate(this.getSceneObject()));

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

    private update() {
        if (this.paused)
            return;

        const transform = this.getTransform();
        const rotation = quat.fromEulerAngles(0, getTime() * this.rotationSpeed, 0);
        transform.setLocalRotation(rotation);
    }

    public getAsteroids(): object[] {
        return this.asteroids;
    }

    public setPaused(state: boolean) {
        this.paused = state;
    }
}
