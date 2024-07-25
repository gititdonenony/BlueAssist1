import { AbstractControl } from '@angular/forms';

import moment from 'moment';

export function ValidateCellNumber(control: AbstractControl) {
    if (control.value.match(/^(\+\d{1,3}[- ]?)?\d{10}$/)) {
        return null;
    }
    return { validCellNumber: true };
}

export function ValidateDateNotInFuture(control: AbstractControl) {
    const formattedDate = moment(control.value);
    const dateNow = moment(new Date());
    if (formattedDate.isBefore(dateNow)) {
        return null;
    }
    return { dateInFuture: true };
}
