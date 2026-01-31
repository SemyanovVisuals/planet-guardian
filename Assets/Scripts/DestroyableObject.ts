import TrackedHand from "SpectaclesInteractionKit.lspkg/Providers/HandInputData/TrackedHand"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"

@component
export class DestroyableObject extends BaseScriptComponent {

    private bodyComponent: BodyComponent | null = null
    private colliderComponent: ColliderComponent | null = null

    onAwake() {
        this.colliderComponent = this.getSceneObject().getComponent("Physics.ColliderComponent")
    }

    onDestroy(hand: TrackedHand) {
        this.sceneObject.destroy()
    }
}
