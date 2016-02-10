import 'reflect-metadata';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {notesServiceInjectables} from './notes';
import Main from './components/main';

bootstrap(Main, [ROUTER_PROVIDERS, notesServiceInjectables]);
