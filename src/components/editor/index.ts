import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import Notes, {Note} from '../../notes.ts';

@Component({
    selector: 'editor',
    template: `<div [(innerHTML)]="note.content" contentEditable="true"></div>`
})
export default class Editor {
    note: Note;

    constructor(private routeParams: RouteParams) {
        const id = +routeParams.get('id');
        this.note = Notes.get(id);
    }
}
