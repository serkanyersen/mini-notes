import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import Editor from '../editor';
import NoteNav from '../note-nav';
import {NotesService} from '../../notes';

import './style.scss';

@Component({
  selector: 'main',
  template: `
    <div class="Header">
      <button (click)="newNote()">New Note</button>
    </div>
    <div class="Container">
        <div class="Sidebar" (click)="sidebarClick($event)">
            <note-nav></note-nav>
        </div>
        <div class="Content">
            <router-outlet></router-outlet>
        </div>
    </div>
    <div class="Footer">Footer</div>
  `,
  directives: [Editor, NoteNav, ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/note/:id', component: Editor, as: 'Note' }
])
export default class Main {

  constructor(
    // typescript automatically puts private or public arguments in `this`
    private notesService: NotesService
  ) { } // Empty constructor is super ugly

  /**
   * Utility function to find parent of given class on a DOMElement
   */
  findParent(el: HTMLElement, className: string): HTMLElement {
    while (el.parentNode) {
      el = <HTMLElement>el.parentNode;
      if (el.classList.contains(className)) {
        return el;
      }
    }
    return null;
  }

  /**
   * Creates a new note with empty values
   */
  newNote(): void {
    this.notesService.add({
      id: Date.now(), // needs to be replaced by random ID generator,
      title: 'New Note',
      content: ''
    });
  }

  /**
   * When sidebar is clicked toggle the --show class
   * so on mobile sidebar slides in.
   */
  sidebarClick(event: Event): void {
    const el: HTMLDivElement = <HTMLDivElement>event.target;

    if (el.classList.contains('Sidebar')) {
      el.classList.toggle('Sidebar--show');
    } else {
      const parent: HTMLElement = this.findParent(el, 'Sidebar');
      if (parent) {
        parent.classList.toggle('Sidebar--show');
      }
    }
  }
}
