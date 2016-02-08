import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import './style.scss';
import {INote, NotesService} from '../../notes';

@Component({
  selector: 'note-nav',
  template: `<nav>
    <ul>
      <li *ngFor="#note of notes" class="NoteItem"
          [class.NoteItem--active]="router.isRouteActive(router.generate(['Note', {id: note.id}]))">
        <a [routerLink]="['Note', {id:note.id}]">
            {{ note.title }}
        </a>
      </li>
    </ul>
  </nav>`,
  directives: [NgFor, ROUTER_DIRECTIVES]
})
export default class NoteNav {
  notes: INote[];

  constructor(private router: Router, NotesService: NotesService) {
    console.log(NotesService);

    NotesService.notes
      .map((notes: INote) => {
        console.log(notes);
        return notes;
      }).subscribe((notes: INote[]) => {
        // console.log(notes);
        this.notes = notes;
      });
  }
}
