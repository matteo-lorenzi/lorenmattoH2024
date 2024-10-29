import { Component, OnInit } from '@angular/core';
import { WeaponInterface } from '../../data/weaponInterface';
import { WeaponService } from '../../services/weapon.service';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { WeaponDetailComponent } from '../weapon-detail/weapon-detail.component';
import { NgForOf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterSortComponent } from '../filter-sort/filter-sort.component';

interface FilterConfig {
  field: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

@Component({
  selector: 'app-weapons',
  standalone: true,
  imports: [
    FormsModule,
    WeaponDetailComponent,
    NgForOf,
    UpperCasePipe,
    FilterSortComponent,
  ],
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.css'],
})
export class WeaponsComponent implements OnInit {
  weapons: WeaponInterface[] = [];
  filteredWeapons: WeaponInterface[] = [];
  selectedWeapon?: WeaponInterface;
  filterConfig: FilterConfig[] = [
    { field: 'name', label: 'Name', type: 'text' },
    { field: 'attack', label: 'Attack', type: 'number' },
    { field: 'dodge', label: 'Dodge', type: 'number' },
    { field: 'damage', label: 'Damage', type: 'number' },
    { field: 'hp', label: 'HP', type: 'number' },
  ];

  sortableFields = [
    { value: 'name', label: 'Name' },
    { value: 'attack', label: 'Attack' },
    { value: 'dodge', label: 'Dodge' },
    { value: 'damage', label: 'Damage' },
    { value: 'hp', label: 'HP' },
  ];

  constructor(
    private weaponService: WeaponService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getWeapons();
  }

  onSelect(weapon: WeaponInterface): void {
    this.selectedWeapon = weapon;
    this.messageService.add(
      `WeaponsComponent: Selected weapon id=${weapon.id}`
    );
  }

  getWeapons(): void {
    this.weaponService.getWeapons().subscribe((weapons) => {
      this.weapons = weapons;
      this.filteredWeapons = weapons;
    });
  }

  goToDetail(id: number): void {
    this.router.navigate(['/weapon-details', id]);
  }

  onFilterChange(filterValues: any): void {
    this.filteredWeapons = this.weapons.filter((weapon) => {
      return Object.keys(filterValues).every((key) => {
        if (!filterValues[key]) {
          return true;
        }

        const weaponValue = (weapon as any)[key];
        const filterValue = filterValues[key];

        if (typeof weaponValue === 'number') {
          return weaponValue === Number(filterValue);
        }

        return weaponValue
          .toString()
          .toLowerCase()
          .includes(filterValue.toString().toLowerCase());
      });
    });
  }

  onSortChange(sort: { field: string; order: 'asc' | 'desc' }): void {
    const { field, order } = sort;
    this.filteredWeapons.sort((a, b) => {
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
