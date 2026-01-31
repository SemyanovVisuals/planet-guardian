import { Planet } from "./Planet"
import { Orbit } from "./Orbit"
import { Asteroid } from "./Asteroid"
import { setInterval } from "./Util"

@component
export class GameManager extends BaseScriptComponent {
    @input planet : Planet
    @input orbits : Orbit[]

    onAwake() {
        this.createEvent("UpdateEvent").bind(this.update.bind(this))

        // OLD SPAWNING:
        // setInterval(() => this.getRandomOrbit().spawnAsteroid(), 1000 * 3);
        // NEW SPAWNING: For every orbit, spawn asteroids with an inteval
        setInterval(() => {
            for (let i = 0; i < this.orbits.length; i++) {
                this.orbits[i].spawnAsteroid();
            }
        }, 1000 * 2);

        // RANDOM DROP
        let interval = this.randint(5, 10)

        setInterval(() => {
            const res = this.getRandomAsteroid();
            console.log(res);    
            (res as any)?.enterPlanet()
        }, 1000 * interval);
    }

    private getRandomOrbit() : Orbit {
        const orbitIdx = Math.floor(Math.random() * this.orbits.length);
        return this.orbits[orbitIdx];
    }

    private getRandomAsteroid() : object | null {
        // TODO: At the moment it is not guranteed to actually return an asteroid even if one exists,
        // as the random orbit it picked might have no asteroids at the moment
        // NOTE: should be fixed now with the updated replacement logic control
        const orbit = this.getRandomOrbit();
        const asteroids = orbit.getAsteroids();

        print("NUM OF ASTEROIDS ON SELECTED ORBIT: " + asteroids.length)
        
        if (asteroids.length == 0)
            return null;

        return asteroids[Math.floor(Math.random() * asteroids.length)];
    }

    private update() {
        // Main Game Loop
    }

    private randint(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}