import { Planet } from "./Planet"
import { Orbit } from "./Orbit"
import { setInterval } from "./Util"

@component
export class GameManager extends BaseScriptComponent {
    @input planet : Planet
    @input orbits : Orbit[]

    onAwake() {
        this.createEvent("UpdateEvent").bind(this.update.bind(this))

        // Create new asteroid at a random orbit every 3 seconds
        setInterval(() => {
            this.getRandomOrbit()?.spawnAsteroid()
        }, 1000 * 3);
    }

    private getRandomOrbit() : Orbit | null {
        const orbitIdx = Math.floor(Math.random() * this.orbits.length)
        return this.orbits[orbitIdx]
    }

    private update() {
        // Main Game Loop
    }
}