import { LowerCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../core/services/client.service';
import { PhoneFormatPipe } from '../../shared/pipes/phone-format-pipe';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';
import { ClientForm } from '../client-form/client-form';

@Component({
  selector: 'app-client-list',
  imports: [
    RouterLink,
    FormsModule,
    TimeAgoPipe,
    PhoneFormatPipe,
    LowerCasePipe,
    ClientForm
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList implements OnInit {
  private clientService = inject(ClientService);
  public showModal = signal(false);
  public searchTerm = signal('');
  public currentPage = signal(1);

  public itemsPerPage = 10;
  public loading = this.clientService.loading;

  public filteredClients = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const clients = this.clientService.clients();
    if (!term) return clients;
    return clients.filter(c => c.name.toLowerCase().includes(term));
  });
  public totalPages = computed(() =>
    Math.ceil(this.filteredClients().length / this.itemsPerPage)
  );
  public paginatedClients = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredClients().slice(start, start + this.itemsPerPage);
  });

  ngOnInit(): void {
    this.clientService.loadClients().subscribe();
  }

  public onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  public openModal(): void {
    this.showModal.set(true);
  }

  public closeModal(): void {
    this.showModal.set(false);
  }

  public goToPage(page: number): void {
    this.currentPage.set(page);
  }

  public previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  public nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }
}
