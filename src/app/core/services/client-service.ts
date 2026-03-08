import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiUser, Client, CreateClientDto } from '../models/client.model';

@Injectable({
  providedIn: 'root',
})

export class ClientService {
  private http = inject(HttpClient);
  private clientsSignal = signal<Client[]>([]);
  private loadedSignal = signal<boolean>(false);
  private loadingSignal = signal<boolean>(false);

  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private nextId = 11;

  public clients = this.clientsSignal.asReadonly();
  public loaded = this.loadedSignal.asReadonly();
  public loading = this.loadingSignal.asReadonly();

  private mapApiUserToClient(user: ApiUser): Client {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: date.toISOString(),
    };
  }

  public loadClients(): Observable<Client[]> {
    if (this.loadedSignal()) {
      return new Observable(subscriber => {
        subscriber.next(this.clientsSignal());
        subscriber.complete();
      });
    }

    this.loadingSignal.set(true);

    return this.http.get<ApiUser[]>(this.apiUrl).pipe(
      map(users => users.map(user => this.mapApiUserToClient(user))),
      tap(clients => {
        this.clientsSignal.set(clients);
        this.loadedSignal.set(true);
        this.loadingSignal.set(false);
      })
    );
  }

  public getClientById(id: number): Observable<Client> {
    const localClient = this.clientsSignal().find(c => c.id === id);
    if (localClient) {
      return new Observable(subscriber => {
        subscriber.next(localClient);
        subscriber.complete();
      });
    }

    return this.http.get<ApiUser>(`${this.apiUrl}/${id}`).pipe(
      map(user => this.mapApiUserToClient(user))
    );
  }

  public createClient(dto: CreateClientDto): Observable<Client> {
    return this.http.post<ApiUser>(this.apiUrl, dto).pipe(
      map(() => {
        const newClient: Client = {
          id: this.nextId++,
          name: dto.name,
          email: dto.email,
          phone: dto.phone || '',
          createdAt: new Date().toISOString(),
        };
        return newClient;
      }),
      tap(client => {
        this.clientsSignal.update(clients => [client, ...clients]);
      })
    );
  }
}
