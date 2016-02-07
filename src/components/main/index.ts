import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import Editor from '../editor';
import NoteNav from '../note-nav';
import './style.scss';

var template = require('./template.html');

@Component({
  selector: 'main',
  template,
  directives: [Editor, NoteNav, ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/note/:id', component: Editor, as: 'Note' }
])
export default class Main {

  findParent(el: HTMLElement, className: string): HTMLElement {
    while (el.parentNode) {
      el = <HTMLElement>el.parentNode;
      if (el.classList.contains(className)) {
        return el;
      }
    }
    return null;
  }


  sidebarClick(event: Event) {
    const el = <HTMLDivElement>event.target;
    if (el.classList.contains('Sidebar')) {
      el.classList.toggle('Sidebar--show');
    } else {
      const parent = this.findParent(el, 'Sidebar')
      if (parent) {
        parent.classList.toggle('Sidebar--show');
      }
    }
  }
}
