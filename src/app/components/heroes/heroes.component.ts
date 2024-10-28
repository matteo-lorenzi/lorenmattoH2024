import { Component, OnInit } from '@angular/core';
import { HeroInterface } from '../../data/heroInterface';
import { FormsModule } from '@angular/forms';
import { HEROES } from '../../data/mock-heroes';
import { NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { HeroService } from '../../services/hero.service';
import { MessageComponent } from '../message/message.component';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [
    FormsModule,
    UpperCasePipe,
    NgForOf,
    NgIf,
    HeroDetailComponent,
    MessageComponent,
  ],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css',
})
export class HeroesComponent implements OnInit {
  heroes: HeroInterface[] = [];
  selectedHero?: HeroInterface;

  constructor(
    private heroService: HeroService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero: HeroInterface): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  goToDetail(id: number): void {
    this.router.navigate(['/hero-details', id]);
  }
}

