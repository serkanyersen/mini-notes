import {Component, ChangeDetectorRef} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import './style.scss';
import {INote, NotesService} from '../../notes';
import {Observable} from 'rxjs';

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
  notes: Observable<INote[]>;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notesService: NotesService) {

    this.notes = notesService.notes;

    notesService.newNotes.subscribe((newNote: INote) => {
      router.navigate(['Note', { id: newNote.id }]);
    });
  }

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
