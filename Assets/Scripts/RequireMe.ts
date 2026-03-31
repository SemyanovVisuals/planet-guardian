@component
export class RequireMe extends BaseScriptComponent {
  @input
  someNumericInput: number;

  @input
  someDefaultInput2: number = 10;

  protected value: number = 1;

  setValue(value: number) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}