import { Component, OnInit } from '@angular/core';
import { WeaponInterface } from '../../data/weaponInterface';
import { WeaponService } from '../../services/weapon.service';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { WeaponDetailComponent } from "../weapon-detail/weapon-detail.component";
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-weapons',
  standalone: true,
  imports: [WeaponDetailComponent, NgForOf],
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.css'],
})
export class WeaponsComponent implements OnInit {
  weapons: WeaponInterface[] = [];
  selectedWeapon?: WeaponInterface;

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
    this.messageService.add(`WeaponsComponent: Selected weapon id=${weapon.id}`);
  }

  getWeapons(): void {
    this.weaponService.getWeapons().subscribe((weapons) => (this.weapons = weapons));
  }

  goToDetail(id: number): void {
    this.router.navigate(['/weapon-details', id]);
  }
}
