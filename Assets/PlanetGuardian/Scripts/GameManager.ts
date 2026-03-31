import { Planet } from "./Planet"
import { Orbit } from "./Orbit"
import { Asteroid } from "./Asteroid"
import { Alien } from "./Alien"
import { Interval, setInterval, setIntervalRandom } from "./Util"
import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import { Score } from "./Score"

@component
export class GameManager extends BaseScriptComponent {
    @input planet : Planet
    @input alienPrefab : ObjectPrefab
    @input audioIntroduction : AudioComponent
    @input audioMusicNormal : AudioComponent
    @input audioMusicScan : AudioComponent
    @input orbits : Orbit[]
    @input camera : Camera

    private asteroidSpawnInterval : Interval;
    private alienSpawnInterval : Interval;
    private enterOrbitInterval : Interval;


    onAwake() {
        this.audioIntroduction.play(1);
        // this.createEvent("UpdateEvent").bind(this.update.bind(this))

        // setInterval(() => this.getRandomOrbit().spawnAsteroid(), 1000 * 3);
        // For every orbit, spawn asteroids with an inteval
        this.asteroidSpawnInterval = setIntervalRandom(() => {
            for (let i = 0; i < this.orbits.length; i++) {
                this.orbits[i].spawnAsteroid();
            }
        }, 2_000, 4_000);

        this.alienSpawnInterval = setIntervalRandom(() => {
            this.alienPrefab.instantiate(this.sceneObject);
        }, 15_000, 25_000);

        this.enterOrbitInterval = setIntervalRandom(() => {
            const res = this.getRandomAsteroid();
            (res as any)?.enterPlanet()
        }, 10_000, 15_000);
    }

    public setPaused(state: boolean) {
        for (const orbit of this.orbits)
            orbit.setPaused(state);

        this.asteroidSpawnInterval.setPaused(state);
        this.alienSpawnInterval.setPaused(state);
        this.enterOrbitInterval.setPaused(state);

        Score.instance.setPaused(state);

        print("Game paused=" + state);
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

        return asteroids[Math.floor(Math.random() * asteroids.length)];
    }
}