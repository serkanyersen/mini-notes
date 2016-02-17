import {Component, ChangeDetectorRef} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Observable} from 'rxjs';
import {INote, NotesService} from '../../notes';

import './style.scss';

@Component({
  selector: 'note-nav',
  template: `<nav>
    <ul>
      <li *ngFor="#note of notes | async" class="NoteItem"
          [class.NoteItem--active]="router.isRouteActive(router.generate(['Note', {id: note.id}]))">
        <a [routerLink]="['Note', {id:note.id}]">
            {{ note.title }}
        </a>
        <span class="NoteItem-delete" (click)="deleteNote(note)">&times;</span>
      </li>
    </ul>
  </nav>`,
  directives: [NgFor, ROUTER_DIRECTIVES]
})
export default class NoteNav {
  // Notes list to be used in the template
  notes: Observable<INote[]>;

  constructor(
    private router: Router,
    // This was needed to trigger change detection
    // It's completely unjustified, I assume it's a bug
    private cdr: ChangeDetectorRef,
    private notesService: NotesService) { // End of args

      // but notes stream in the scope, you can see this used
      // in the template followed by `| async` rest is handled
      // by angular. Very simple
      this.notes = notesService.notes;

      // Watch when a new note is created and simply
      // navigate to the new note.
      notesService.newNotes.subscribe((newNote: INote) => {
        router.navigate(['Note', { id: newNote.id }]);
      });
  }

  /**
   * Thanks for your service note, bye now.
   */
  deleteNote(note: INote): void {
    this.notesService.deleteNote(note);
  }

  /*
   * This must be a bug with angular at the moment
   *
   * there is agreat explanation in here
   * http://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked
   *
   * but this should not have happened for this code. there is nothing changing `notes` to cause
   * change detection initially.
   *
   * Anyway, this resolves the warnings/errors prompted initially
   */
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}
