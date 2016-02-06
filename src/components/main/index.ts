import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import Editor from '../editor';
import NoteNav from '../note-nav';
import './style.scss';

var template =  require('./template.html');

@Component({
    selector: 'main',
    template,
    directives: [Editor, NoteNav, ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/note/:id', component: Editor, as: 'Note'}
])
export default class Main { }
