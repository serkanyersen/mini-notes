import {Component, Inject, ElementRef} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import Notes, {Note} from '../../notes.ts';

import './style.scss';

@Component({
  selector: 'editor',
  template: `
      <div class="Editor-editable" [(innerHTML)]="note.content"
          (keyup)="onChange()"
          contentEditable="true">
      </div>
    `,
  host: {
    class: 'Editor'
  }
})
export default class Editor {
  note: Note;
  root: HTMLElement;

  constructor(
    private routeParams: RouteParams,
    @Inject(ElementRef) elementRef: ElementRef
  ) {
    this.root = elementRef.nativeElement;
    const id = +routeParams.get('id');
    this.note = Notes.get(id);
  }

  ngAfterViewInit() {
    this.root.querySelector('.Editor-editable').addEventListener("paste", function(e) {
      // cancel paste
      e.preventDefault();

      // get text representation of clipboard
      var text = (<any>e).clipboardData.getData("text/plain");

      // Escape html
      text = text.replace(/\</g, '&lt;');

      // insert text manually
      document.execCommand("insertHTML", false, text);
    });
  }

  onChange() {
    console.log(this.note.content);
  }
}
