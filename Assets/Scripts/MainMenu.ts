@component
export class NewScript extends BaseScriptComponent {
    onAwake() {

    }

    show() {
        this.sceneObject.enabled = true;
    }

    hide() {
        this.sceneObject.enabled = false;
    }
}
