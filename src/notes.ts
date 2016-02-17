import {Injectable, bind} from 'angular2/core';
import {Subject, Observable} from 'rxjs';

/**
 * Simple interface for the Note objects
 * This should actually be a Model and
 * used as new Note({}) everywhere. But
 * interface also does the job
 */
export interface INote {
    id?: number;
    title?: string;
    content?: string;
}

// Each stream operation requires a map function
// this is simply an interface for it
interface INotesOperation extends Function {
  (notes: INote[]): INote[];
}

/**
 * Get initial mock data or read it from localStorage
 */
const initialNotes: INote[] = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [
  {id: 1, title: 'My note', content: 'My note<br>yes my note dude.'},
  {id: 2, title: 'test note', content: 'hello world test'},
  {id: 3, title: 'html note', content: 'hello <i>world</i><hr>this is <b>note<b>'},
  {id: 4, title: 'test', content: 'hmm.'}
];

@Injectable()
export class NotesService {
  // Main stream that keeps the up-to-date list of notes
  notes: Observable<INote[]>;
  newNotes: Subject<INote> = new Subject<INote>();
  updatesStream: Subject<any> = new Subject<any>();
  update: Subject<INote> = new Subject<INote>();
  create: Subject<INote> = new Subject<INote>();
  delete: Subject<INote> = new Subject<INote>();

  constructor() {
    this.notes = this.updatesStream
      .scan(
        (notes: INote[], operation: INotesOperation) => {
          return operation(notes);
        },
        initialNotes)
      .startWith(initialNotes)
      .publishReplay(1)
      .refCount(); // keep connected as long as there is an observer

    this.create.map((note: INote) => {
      return (notes: INote[]) => {
        return notes.concat(note);
      };
    })
    .subscribe(this.updatesStream);

    this.newNotes
      .subscribe(this.create);

    this.update.map((updatedNote: INote) => {
      return (notes: INote[]) => {
        return notes.map((note: INote) => {
          if (note.id === updatedNote.id) {
            return updatedNote;
          }
          return note;
        });
      };
    })
    .subscribe(this.updatesStream);

    this.delete.map((deletedNote: INote) => {
      return (notes: INote[]) => {
        return notes.filter((note: INote) => {
          return note.id !== deletedNote.id;
        });
      };
    })
    .subscribe(this.updatesStream);

    // Let's save notes to localStorage for now
    this.notes.subscribe((notes: INote[]) => {
      localStorage.setItem('notes', JSON.stringify(notes));
    });
  }

  add(note: INote): void {
    this.newNotes.next(note);
  }

  deleteNote(note: INote): void {
    this.delete.next(note);
  }
}

export var notesServiceInjectables: Array<any> = [
  bind(NotesService).toClass(NotesService)
];
