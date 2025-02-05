import { AbstractControl, ValidationErrors } from '@angular/forms';

export function numericValidator(
  control: AbstractControl
): ValidationErrors | null {
  const validNumberPattern = /^[0-9]+$/;
  const isValid = validNumberPattern.test(control.value);
  return isValid ? null : { invalidNumber: true };
}
