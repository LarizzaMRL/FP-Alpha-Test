import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { CreateNoteDto, Note } from '../models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  private notesMap = signal<Map<number, Note[]>>(new Map());
  private nextId = 101;

  public getNotesByUserId(userId: number): Observable<Note[]> {
    const cached = this.notesMap().get(userId);
    if (cached) {
      return new Observable(subscriber => {
        subscriber.next(cached);
        subscriber.complete();
      });
    }

    return this.http.get<Note[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      tap(notes => {
        this.notesMap.update(map => {
          const newMap = new Map(map);
          newMap.set(userId, notes);
          return newMap;
        });
      })
    );
  }

  public createNote(dto: CreateNoteDto): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, dto).pipe(
      map(() => {
        const newNote: Note = {
          id: this.nextId++,
          userId: dto.userId,
          title: dto.title,
          body: dto.body,
        };
        return newNote;
      }),
      tap(note => {
        this.notesMap.update(map => {
          const newMap = new Map(map);
          const current = newMap.get(note.userId) || [];
          newMap.set(note.userId, [note, ...current]);
          return newMap;
        });
      })
    );
  }

  public deleteNote(noteId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${noteId}`).pipe(
      tap(() => {
        this.notesMap.update(map => {
          const newMap = new Map(map);
          const current = newMap.get(userId) || [];
          newMap.set(userId, current.filter(n => n.id !== noteId));
          return newMap;
        });
      })
    );
  }
}
