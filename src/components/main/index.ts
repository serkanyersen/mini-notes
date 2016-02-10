import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import Editor from '../editor';
import NoteNav from '../note-nav';
import {NotesService} from '../../notes';

import './style.scss';
// Typescript does not support string imports yet
const template: string = require('./template.html');

@Component({
  selector: 'main',
  template,
  directives: [Editor, NoteNav, ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/note/:id', component: Editor, as: 'Note' }
])
export default class Main {

  constructor(
    private notesService: NotesService
  ) { }

  findParent(el: HTMLElement, className: string): HTMLElement {
    while (el.parentNode) {
      el = <HTMLElement>el.parentNode;
      if (el.classList.contains(className)) {
        return el;
      }
    }
    return null;
  }

  newNote(): void {
    this.notesService.add({
      id: Date.now(), // needs to be replaced by random ID generator,
      title: 'New Note',
      content: ''
    });
  }

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
