import { DefaultTitleStrategy, Routes } from '@angular/router';
import { HeroesComponent } from '../app/components/heroes/heroes.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { WeaponsComponent } from './components/weapons/weapons.component';
import { WeaponDetailComponent } from './components/weapon-detail/weapon-detail.component';
import { AddHeroeComponent } from './components/add-heroe/add-heroe.component';
import { AddWeaponComponent } from './components/add-weapon/add-weapon.component';

export const routes: Routes = [
  { path: 'heroes', component: HeroesComponent },
  { path: 'hero-details/:id', component: HeroDetailComponent },
  { path: 'weapons', component: WeaponsComponent },
  { path: 'weapon-details/:id', component: WeaponDetailComponent },
  { path: 'add-heroe', component: AddHeroeComponent },
  { path: 'add-weapon', component: AddWeaponComponent },
  { path: '', redirectTo: '/heroes', pathMatch: 'full' },
];
