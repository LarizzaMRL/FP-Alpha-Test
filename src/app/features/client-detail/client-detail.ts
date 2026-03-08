import { LowerCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Client } from '../../core/models/client.model';
import { Note } from '../../core/models/note.model';
import { ClientService } from '../../core/services/client.service';
import { NoteService } from '../../core/services/note.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { PhoneFormatPipe } from '../../shared/pipes/phone-format-pipe';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-client-detail',
  imports: [
    FormsModule,
    LowerCasePipe,
    PhoneFormatPipe,
    TimeAgoPipe,
    ConfirmDialog
  ],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss',
})
export class ClientDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);
  private noteService = inject(NoteService);

  client = signal<Client | null>(null);
  notes = signal<Note[]>([]);
  loading = signal(true);
  noteTitle = signal('');
  noteText = signal('');
  showConfirmDialog = signal(false);
  noteToDelete = signal<Note | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.clientService.getClientById(id).subscribe(client => {
      this.client.set(client);
      this.loading.set(false);
    });

    this.noteService.getNotesByUserId(id).subscribe(notes => {
      this.notes.set(notes);
    });
  }

  public addNote(): void {
    const title = this.noteTitle().trim();
    const text = this.noteText().trim();
    if (!title || !text || !this.client()) return;

    this.noteService.createNote({
      userId: this.client()!.id,
      title: title,
      body: text,
    }).subscribe(note => {
      this.notes.update(notes => [note, ...notes]);
      this.noteTitle.set('');
      this.noteText.set('');
    });
  }

  public confirmDelete(note: Note): void {
    this.noteToDelete.set(note);
    this.showConfirmDialog.set(true);
  }

  public deleteNote(): void {
    const note = this.noteToDelete();
    if (!note) return;

    this.noteService.deleteNote(note.id, note.userId).subscribe(() => {
      this.notes.update(notes => notes.filter(n => n.id !== note.id));
      this.showConfirmDialog.set(false);
      this.noteToDelete.set(null);
    });
  }

  public cancelDelete(): void {
    this.showConfirmDialog.set(false);
    this.noteToDelete.set(null);
  }
}
