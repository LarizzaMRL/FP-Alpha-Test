import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';

    const digits = value.replace(/\D/g, '');
    const phone = digits.substring(0, 10);

    if (phone.length !== 10) return value;

    return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)} - ${phone.substring(6, 10)}`;
  }
}
