import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"

@component
export class TriggerObject extends BaseScriptComponent {

    private bodyComponent: BodyComponent | null = null
    private colliderComponent: ColliderComponent | null = null
    private isTriggered: boolean | false
    
    onAwake() {
        this.colliderComponent = this.getSceneObject().getComponent("Physics.ColliderComponent")
    }

    onTrigger(hand: TrackedHand) {
        if(!this.isTriggered){
            this.isTriggered = true
            print("🚀 LAUNCH THE ROCKET")
        }
    }
}
