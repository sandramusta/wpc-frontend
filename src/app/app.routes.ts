import { Routes } from '@angular/router';
import { Esileht } from './esileht/esileht';
import { Homepage } from './homepage/homepage';
import { Galerii } from './galerii/galerii';
import { Kkk } from './kkk/kkk';
import { Juhendid } from './juhendid/juhendid';
import { Ostukorv } from './ostukorv/ostukorv';
import { Makse } from './makse/makse';
import { Tulekul } from './tulekul/tulekul';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    { path: '', component: Esileht },
    { path: 'e-pood', component: Homepage },
    { path: 'galerii', component: Galerii },
    { path: 'kkk', component: Kkk },
    { path: 'ostukorv', component: Ostukorv },
    { path: 'makse', component: Makse },
    { path: 'juhendid', component: Juhendid },
    { path: 'blogi', component: Tulekul, data: { title: 'Blogi' } },
    { path: 'edasimuujale', component: Tulekul, data: { title: 'Edasimüüjale', text: 'Aiapaigaldajad ja edasimüüjad saavad partnerhinna. Partnerkonto, kus näed oma hindu, laoseisu ja tellimusi, on valmimisel.' } },
    { path: '**', component: NotFound },
];
