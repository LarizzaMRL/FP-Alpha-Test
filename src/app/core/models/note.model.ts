export interface Note {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface CreateNoteDto {
  userId: number;
  title: string;
  body: string;
}
