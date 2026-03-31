@component
export class NewScript extends BaseScriptComponent {

    @input introAudio : AudioComponent

    onAwake() {
        console.log("INTRO AUDIO PLAY");
        this.introAudio.play(1);
    }

    show() {
        this.sceneObject.enabled = true;
    }

    hide() {
        this.sceneObject.enabled = false;
    }
}
