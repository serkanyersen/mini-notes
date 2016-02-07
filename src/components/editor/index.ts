import {Component, Inject, ElementRef} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import Notes, {Note} from '../../notes.ts';

import './style.scss';

@Component({
  selector: 'editor',
  template: `
    <div class="Editor-editable" [innerHTML]="content"
        (input)="onChange()"
        (keydown)="onKeyDown($event)"
        contentEditable="true">
    </div>
  `,
  host: {
    class: 'Editor'
  }
})
export default class Editor {
  id: number;
  note: Note;
  root: HTMLElement;
  editable: HTMLDivElement;
  content: string;

  constructor(
    private routeParams: RouteParams,
    @Inject(ElementRef) elementRef: ElementRef
  ) {
    this.root = elementRef.nativeElement;
    this.id = +routeParams.get('id');
    this.note = Notes.get(this.id);
    this.content = this.note.content;
  }

  ngAfterViewInit() {
    this.editable = <HTMLDivElement>this.root.querySelector('.Editor-editable');

    this.editable.addEventListener("paste", function(e) {
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

  onKeyDown(e: KeyboardEvent) {
    if(e.keyCode == 9) {
        document.execCommand('styleWithCSS', true, null);
        if (e.shiftKey) {
          document.execCommand('outdent', true, null);
        } else {
          document.execCommand('indent', true, null);
        }
        e.preventDefault();
    }
  }

  onChange() {
    const content = this.editable.innerHTML;
    const contentText = this.editable.innerText;
    const title = contentText.split(/\n|\<br\>/)[0];

    Notes.set(this.id, {
      title,
      content
    });
  }
}
