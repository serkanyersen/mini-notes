import {extend} from 'lodash';
import {Injectable, bind} from 'angular2/core';
import {Subject, Observable} from 'rxjs';

export interface INote {
    id?: number;
    title?: string;
    content?: string;
}

interface INotesOperation extends Function {
  (messages: INote[]): INote[];
}

// const NOTES: Map<number, INote> = new Map<number, INote>();

// class Notes {

//   get(id: number): INote {
//     return NOTES.get(id);
//   }

//   getList(): INote[] {
//       var summaries: INote[] = [];

//       NOTES.forEach((note) => {
//           summaries.push({
//               id: note.id,
//               title: note.title
//           });
//       });
//       return summaries;
//   }

//   set(id: number, note: INote) {
//       let updatedNote: INote = note;

//       if (NOTES.has(id)) {
//           updatedNote = extend(NOTES.get(id), note);
//       }

//       NOTES.set(id, updatedNote);
//   }
// }

// const singleton = new Notes();

// singleton.set(1, {id: 1, title: 'My note', content: 'This is my note'});
// singleton.set(2, {id: 2, title: 'test note', content: 'hello world test'});
// singleton.set(3, {id: 3, title: 'html note', content: 'hello <i>world</i><hr>this is <b>note<b>'});
// singleton.set(4, {id: 4, title: 'test', content: 'hmm.'});

// export default singleton;

let initialNotes: INote[] = [
  {id: 1, title: 'My note', content: 'This is my note'},
  {id: 2, title: 'test note', content: 'hello world test'},
  {id: 3, title: 'html note', content: 'hello <i>world</i><hr>this is <b>note<b>'},
  {id: 4, title: 'test', content: 'hmm.'}
];

@Injectable()
export class NotesService {
  notes: Observable<INote[]>;
  newNotes: Subject<INote> = new Subject<INote>();
  updates: Subject<any> = new Subject<any>();
  create: Subject<INote> = new Subject<INote>();

  constructor() {
    this.notes = this.updates
      .scan((
            notes: INote[],
            operation: INotesOperation) => {
              return operation(notes)
            },
            initialNotes)
      .publishReplay(1)
      .refCount();

    this.create.map(function(note: INote): INotesOperation {
      return (notes: INote[]) => {
        return notes.concat(note);
      }
    })
    .subscribe(this.updates);

    this.newNotes
      .subscribe(this.create);
  }

  addNote(note: INote): void {
    this.newNotes.next(note);
  }
}

export var notesServiceInjectables: Array<any> = [
  bind(NotesService).toClass(NotesService)
]
