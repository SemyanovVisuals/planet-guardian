import { Planet } from "./Planet"
import { Orbit } from "./Orbit"
import { Asteroid } from "./Asteroid"
import { Alien } from "./Alien"
import { setInterval } from "./Util"
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
    @input mix : SceneObject
    @input score : Score

    private static instance: GameManager

    // DO NOT CALL FROM onAwake, not guranted to be not null
    public static getInstance(): GameManager | null {
        return GameManager.instance;
    }

    onAwake() {
        GameManager.instance = this
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


        let interval = this.randint(10, 15)

        setInterval(() => {
            const res = this.getRandomAsteroid();
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

    public toggleScanner() {
        this.mix.enabled = !this.mix.enabled;
        var temp = this.audioMusicNormal.volume
        this.audioMusicNormal.volume = this.audioMusicScan.volume
        this.audioMusicScan.volume = temp;
        this.camera.renderLayer = this.mix.enabled ?
         LayerSet.fromNumber(1).union(LayerSet.fromNumber(2)) :
            LayerSet.fromNumber(0).union(LayerSet.fromNumber(2));
    }
    private randint(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}