import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
    /**
     * Check if two fields match (e.g., password and confirm password).
     * @param controlName The name of the main control
     * @param matchingControlName The name of the control to match against
     */
    static mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const control = formGroup.get(controlName);
            const matchingControl = formGroup.get(matchingControlName);

            if (!control || !matchingControl) {
                return null;
            }

            // If another error exists, don't overwrite it
            if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
                return null;
            }

            // Check values
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
                return { mustMatch: true };
            } else {
                matchingControl.setErrors(null);
                return null;
            }
        };
    }
}
