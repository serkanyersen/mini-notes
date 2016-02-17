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
    // Adds this class to component itself
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
    // url paramaters
    private routeParams: RouteParams,
    // notes data stream
    private notesService: NotesService,
    // gets the component element
    @Inject(ElementRef) elementRef: ElementRef
  ) {

    this.root = elementRef.nativeElement;
    this.id = +routeParams.get('id');

    // Map the notes to receive only the note with current ID
    this.notesService.notes.map((notes: INote[]) => {
        return find(notes, ['id', this.id]);
    }).subscribe((note: INote) => {
        this.note = note;
    });

    // If note was ound set content.
    // I bind content as string here to
    // prevent unintentional two-way binding
    if (this.note) {
      this.content = this.note.content;
    } else {
      // If note was not found with given ID
      // Create a new one anyways to not to lose
      // any data
      this.notesService.add({
        id: this.id,
        title: 'Untitled Note'
      });
    }
  }

  /**
   * After the component completely rendered
   * you can make css queries to it's child elements
   *
   * This might not be needed, this is just a workaround I found
   * to get querySelector working
   */
  ngAfterViewInit(): void {
    // contentEditable element
    this.editable = <HTMLDivElement>this.root.querySelector('.Editor-editable');

    /**
     * When a new paste happens turn it into
     * plain text to get rid of all HTML styling
     */
    this.editable.addEventListener('paste', function(e: ClipboardEvent): void {
      // cancel paste
      e.preventDefault();

      // get text representation of clipboard
      let text: string = e.clipboardData.getData('text/plain');

      // Escape possible html
      text = text.replace(/\</g, '&lt;');

      // insert text manually
      document.execCommand('insertHTML', false, text);
    });

    // When component is first rendered
    // put focus on the editor and set
    // cursor position at the end
    this.editable.focus();
    this.setCursorToEnd();
  }

  /**
   * Special keyboard operations for the editor
   * like tab key etc
   */
  onKeyDown(e: KeyboardEvent): void {

    // When tab key is hit, actually indent the content
    // instead of focusing on the next input
    if (e.keyCode === 9) {
        // I don't know what this does :)
        document.execCommand('styleWithCSS', true, null);

        // if shift is clicked, remove the indent
        if (e.shiftKey) {
          document.execCommand('outdent', true, null);
        } else {
          document.execCommand('indent', true, null);
        }
        // so that we don't lose focus
        e.preventDefault();
    }
  }

  /**
   * When there is a change in the editor
   * Update the current note.
   */
  onChange(): void {
    const content: string = this.editable.innerHTML;
    const contentText: string = this.editable.innerText;
    // Calculate note title from the first line of the text representation
    const title: string = contentText.split(/\n|\<br\>/)[0] || 'Untitled Note';

    // Insert the current change in the update stream
    this.notesService.update.next(extend({}, this.note, {
      title,
      content
    }));
  }

  /**
   * Move the cursor at the end of the input
   */
  setCursorToEnd(): void {
    let range: Range;
    let selection: Selection;

    range = document.createRange(); // Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(this.editable); // Select the entire contents of the element with the range
    range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection(); // get the selection object (allows you to change selection)
    selection.removeAllRanges(); // remove any selections already made
    selection.addRange(range); // make the range you have just created the visible selection
}
}
