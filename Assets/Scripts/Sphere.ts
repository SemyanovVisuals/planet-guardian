@component
export class Sphere extends BaseScriptComponent {

    private bodyComponent: BodyComponent | null = null
    private colliderComponent: ColliderComponent | null = null

    onAwake() {
        this.colliderComponent = this.getSceneObject().getComponent("Physics.ColliderComponent")

        // this.colliderComponent.onOverlapEnter.add((e: OverlapEnterEventArgs) => {
        //     print("OVERLAP")
        // })
    }
}
