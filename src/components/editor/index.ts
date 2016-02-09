import {Component, Inject, ElementRef} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {INote, NotesService} from '../../notes.ts';
import {find, extend} from 'lodash';

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
  note: INote;
  root: HTMLElement;
  editable: HTMLDivElement;
  content: string = '';

  constructor(
    private routeParams: RouteParams,
    private notesService: NotesService,
    @Inject(ElementRef) elementRef: ElementRef
  ) {
    this.root = elementRef.nativeElement;
    this.id = +routeParams.get('id');

    this.notesService.notes.map((notes: INote[]) => {
        return find(notes, ['id', this.id]);
    }).subscribe((note: INote) => {
        this.note = note;
    });

    if (this.note) {
      this.content = this.note.content;
    } else {
      this.notesService.add({
        id: this.id,
        title: 'Untitled Note'
      });
    }
  }

  ngAfterViewInit(): void {
    this.editable = <HTMLDivElement>this.root.querySelector('.Editor-editable');

    this.editable.addEventListener('paste', function(e: ClipboardEvent): void {
      // cancel paste
      e.preventDefault();

      // get text representation of clipboard
      let text: string = e.clipboardData.getData('text/plain');

      // Escape html
      text = text.replace(/\</g, '&lt;');

      // insert text manually
      document.execCommand('insertHTML', false, text);
    });
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.keyCode === 9) {
        document.execCommand('styleWithCSS', true, null);
        if (e.shiftKey) {
          document.execCommand('outdent', true, null);
        } else {
          document.execCommand('indent', true, null);
        }
        e.preventDefault();
    }
  }

  onChange(): void {
    const content: string = this.editable.innerHTML;
    const contentText: string = this.editable.innerText;
    const title: string = contentText.split(/\n|\<br\>/)[0] || 'Untitled Note';

    this.notesService.update.next(extend({}, this.note, {
      title,
      content
    }));
  }
}
