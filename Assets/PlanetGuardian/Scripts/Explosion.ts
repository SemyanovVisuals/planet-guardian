import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"

@component
export class Explosion extends BaseScriptComponent {
    onAwake() {
        setTimeout(() => this.sceneObject.destroy(), 1000);
    }
}
