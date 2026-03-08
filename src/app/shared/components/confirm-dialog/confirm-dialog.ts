import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  title = input<string>('Confirm');
  message = input<string>('Are you sure?');
  confirmed = output<void>();
  cancelled = output<void>();
}
