import {extend} from 'lodash';

export interface Note {
    id?: number;
    title?: string;
    content?: string;
}

const NOTES: Map<number, Note> = new Map<number, Note>();

class Notes {

  get(id: number): Note {
    return NOTES.get(id);
  }

  getList(): Note[] {
      var summaries: Note[] = [];

      NOTES.forEach((note) => {
          summaries.push({
              id: note.id,
              title: note.title
          });
      });
      return summaries;
  }

  set(id: number, note: Note) {
      let updatedNote: Note = note;

      if (NOTES.has(id)) {
          updatedNote = extend(NOTES.get(id), note);
      }

      NOTES.set(id, updatedNote);
  }
}

const singleton = new Notes();

singleton.set(1, {id: 1, title: 'My note', content: 'This is my note'});
singleton.set(2, {id: 2, title: 'test note', content: 'hello world test'})
singleton.set(3, {id: 3, title: 'html note', content: 'hello <i>world</i> <hr> this is note'})
singleton.set(4, {id: 4, title: 'test', content: 'hmm.'})

export default singleton;
