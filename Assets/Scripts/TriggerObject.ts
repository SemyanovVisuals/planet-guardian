import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import { GameManager } from "../PlanetGuardian/Scripts/GameManager"

@component
export class TriggerObject extends BaseScriptComponent {

    private bodyComponent: BodyComponent | null = null
    private colliderComponent: ColliderComponent | null = null
    @input rocketPrefab: ObjectPrefab
    
    onAwake() {
        this.colliderComponent = this.getSceneObject().getComponent("Physics.ColliderComponent")
   
        //setTimeout(this.onTrigger.bind(this), 1000);
    }

    onTrigger() {
        if (!GameManager.getInstance()?.score?.takeRocket())
            return;

        console.log("🚀 LAUNCH THE ROCKET")
        const prefab = this.rocketPrefab.instantiate(null);
        prefab.getTransform().setWorldPosition(this.getTransform().getWorldPosition());
        prefab.getTransform().setWorldRotation(this.getTransform().getWorldRotation());
    }
}
