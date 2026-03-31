import { RequireMe } from './RequireMe';

@component
export class TestRequireType extends BaseScriptComponent {
  @input
  objectWithRequireMe: SceneObject;

  onAwake() {
    let requireMe = this.getComponent(RequireMe.getTypeName());
    /*let createdRequireMe = this.objectWithRequireMe.createComponent(
      RequireMe.getTypeName()
    );*/

    print(requireMe.getValue());
    print(requireMe.someDefaultInput2);
    print(requireMe.someNumericInput);
  }

    getComponent<T extends Component>(n: TypeName<T>): T {
        return this.objectWithRequireMe.getComponent(n as any) as T
    }
}