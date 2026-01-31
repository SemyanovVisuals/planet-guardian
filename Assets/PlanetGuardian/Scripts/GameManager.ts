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

        // Create new asteroid at a random orbit every 3 seconds
        setInterval(() => this.getRandomOrbit().spawnAsteroid(), 1000 * 3);
        setInterval(() => {
            const res = this.getRandomAsteroid();
            console.log(res);    
            res?.enterPlanet()
        }, 1000 * 5);
    }

    private getRandomOrbit() : Orbit {
        const orbitIdx = Math.floor(Math.random() * this.orbits.length);
        return this.orbits[orbitIdx];
    }

    private getRandomAsteroid() : Asteroid | null {
        // TODO: At the moment it is not guranteed to actually return an asteroid even if one exists,
        // as the random orbit it picked might have no asteroids at the moment
        const orbit = this.getRandomOrbit();
        const asteroids = orbit.getAsteroids();
        
        if (asteroids.length == 0)
            return null;

        return asteroids[Math.random() * asteroids.length];
    }

    private update() {
        // Main Game Loop
    }
}