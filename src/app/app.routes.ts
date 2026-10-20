import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    { path: '', component: Homepage },
    { path: '**', component: NotFound },
];