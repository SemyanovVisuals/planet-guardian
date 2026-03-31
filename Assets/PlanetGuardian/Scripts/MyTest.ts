import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"

@component
export class NewScript extends BaseScriptComponent {
    onAwake() {
        //animate()
        animate({
            easing: "ease-out-cubic",
            duration: 1,
            update: (t: number) => {
            },
            ended: () => this.sceneObject.destroy(),
        })
    }
} 
