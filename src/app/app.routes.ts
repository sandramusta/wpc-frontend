import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Shop } from './shop/shop';
import { Gallery } from './gallery/gallery';
import { Faq } from './faq/faq';
import { Guides } from './guides/guides';
import { Cart } from './cart/cart';
import { PaymentResult } from './payment-result/payment-result';
import { PartnerPage } from './partner/partner';
import { ComingSoon } from './coming-soon/coming-soon';
import { Resellers } from './resellers/resellers';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'e-pood', component: Shop},
    {path: 'galerii', component: Gallery},
    {path: 'kkk', component: Faq},
    {path: 'ostukorv', component: Cart},
    {path: 'makse', component: PaymentResult},
    {path: 'partner', component: PartnerPage},
    {path: 'juhendid', component: Guides},
    {path: 'blogi', component: ComingSoon, data: {title: 'Blogi'}},
    {path: 'edasimuujale', component: Resellers},
    {path: '**', component: NotFound},
];
