import { Planet } from "./Planet"
import { Orbit } from "./Orbit"
import { Asteroid } from "./Asteroid"
import { Alien } from "./Alien"
import { setInterval } from "./Util"

@component
export class GameManager extends BaseScriptComponent {
    @input planet : Planet
    @input alienPrefab : ObjectPrefab
    @input audioIntroduction : AudioComponent
    @input orbits : Orbit[]

    onAwake() {
        this.audioIntroduction.play(1);
        this.createEvent("UpdateEvent").bind(this.update.bind(this))

        // setInterval(() => this.getRandomOrbit().spawnAsteroid(), 1000 * 3);
        // For every orbit, spawn asteroids with an inteval
        setInterval(() => {
            for (let i = 0; i < this.orbits.length; i++) {
                this.orbits[i].spawnAsteroid();
            }
        }, 1000 * 2);

        setInterval(() => {
            this.alienPrefab.instantiate(this.sceneObject);
        }, 1000 * 5);

        // setInterval(() => {
        //     const res = this.getRandomAsteroid();
        //     console.log(res);    
        //     (res as any)?.enterPlanet()
        // }, 1000 * 5);
    }

    private getRandomOrbit() : Orbit {
        const orbitIdx = Math.floor(Math.random() * this.orbits.length);
        return this.orbits[orbitIdx];
    }

    private getRandomAsteroid() : object | null {
        // TODO: At the moment it is not guranteed to actually return an asteroid even if one exists,
        // as the random orbit it picked might have no asteroids at the moment
        const orbit = this.getRandomOrbit();
        const asteroids = orbit.getAsteroids();

        print("NUM OF ASTEROIDS ON SELECTED ORBIT: " + asteroids.length)
        
        if (asteroids.length == 0)
            return null;

        return asteroids[Math.random() * asteroids.length];
    }

    private update() {
        // Main Game Loop
    }
}