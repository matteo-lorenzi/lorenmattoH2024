import { Component, OnInit } from '@angular/core';
import { HeroInterface } from '../../data/heroInterface';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { HeroService } from '../../services/hero.service';
import { MessageComponent } from '../message/message.component';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { FilterSortComponent } from "../filter-sort/filter-sort.component";

interface FilterConfig {
  field: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

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
    FilterSortComponent
  ],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: HeroInterface[] = [];
  filteredHeroes: HeroInterface[] = [];
  selectedHero?: HeroInterface;

  filterConfig: FilterConfig[] = [
    { field: 'name', label: 'Name', type: 'text' },
    { field: 'attack', label: 'Attack', type: 'number' },
    { field: 'dodge', label: 'Dodge', type: 'number' },
    { field: 'damage', label: 'Damage', type: 'number' },
    { field: 'hp', label: 'HP', type: 'number' }
  ];

  sortableFields = [
    { value: 'name', label: 'Name' },
    { value: 'attack', label: 'Attack' },
    { value: 'dodge', label: 'Dodge' },
    { value: 'damage', label: 'Damage' },
    { value: 'hp', label: 'HP' }
  ];

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
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
      this.filteredHeroes = heroes;
    });
  }

  goToDetail(id: number): void {
    this.router.navigate(['/hero-details', id]);
  }

  onFilterChange(filterValues: any): void {
    this.filteredHeroes = this.heroes.filter(hero => {
      return Object.keys(filterValues).every(key => {
        if (!filterValues[key]) {
          return true;
        }
        
        const heroValue = (hero as any)[key];
        const filterValue = filterValues[key];
        
        if (typeof heroValue === 'number') {
          return heroValue === Number(filterValue);
        }
        
        return heroValue.toString().toLowerCase()
          .includes(filterValue.toString().toLowerCase());
      });
    });
  }

  onSortChange(sort: { field: string; order: 'asc' | 'desc' }): void {
    const { field, order } = sort;
    this.filteredHeroes.sort((a, b) => {
      const aValue = (a as any)[field];
      const bValue = (b as any)[field];
      
      if (typeof aValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return order === 'asc' 
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
  }
}