import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss',
})
export class ClientForm {
  close = output<void>();
  saved = output<void>();

  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);

  public form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
  });

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, phone } = this.form.getRawValue();

    this.clientService.createClient({
      name: name!,
      email: email!,
      phone: phone || undefined,
    }).subscribe(() => {
      this.saved.emit();
      this.close.emit();
    });
  }
}
