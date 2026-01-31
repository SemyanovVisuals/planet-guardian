@component
export class Planet extends BaseScriptComponent {
    @input rotationSpeed : number = 0.1

    onAwake() {
        this.createEvent("UpdateEvent").bind(this.update.bind(this))
    }

    private update() {
        const transform = this.getTransform();
        const rotation = quat.fromEulerAngles(0, getTime() * this.rotationSpeed, 0);
        transform.setLocalRotation(rotation);
    }
}
