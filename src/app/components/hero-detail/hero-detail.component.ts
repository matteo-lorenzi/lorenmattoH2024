import { Component, Input, OnInit } from '@angular/core';
import { HeroInterface } from '../../data/heroInterface';
import { HeroService } from '../../services/hero.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { MessageComponent } from '../message/message.component';
import { WeaponInterface } from '../../data/weaponInterface';
import { WeaponService } from '../../services/weapon.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    UpperCasePipe,
    MessageComponent,
  ],
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  @Input() hero?: HeroInterface;
  heroForm!: FormGroup;
  weapons: WeaponInterface[] = [];
  selectedWeapon?: WeaponInterface;

  // Base stats pour le héros (utilisées pour réinitialiser après changement d'arme)
  baseStats = { attack: 0, dodge: 0, damage: 0, hp: 0 };

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private weaponService: WeaponService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  private initializeForm(): void {
    this.heroForm = this.fb.group({
      name: ['', Validators.required],
      attack: [1, [Validators.required, Validators.min(1)]],
      dodge: [1, [Validators.required, Validators.min(1)]],
      damage: [1, [Validators.required, Validators.min(1)]],
      hp: [1, [Validators.required, Validators.min(1)]],
      weapon: [null],
    });

    this.subscribeToStatsChanges();
    this.subscribeToWeaponChanges();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadWeapons();
    this.getHero();
    this.subscribeToWeaponChanges();
  }

  private getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe((hero) => {
      if (hero) {
        this.hero = hero;
        // Mettre à jour baseStats avant de patcher le form
        this.baseStats = {
          attack: hero.attack,
          dodge: hero.dodge,
          damage: hero.damage,
          hp: hero.hp,
        };

        this.heroForm.patchValue({
          name: hero.name,
          attack: hero.attack,
          dodge: hero.dodge,
          damage: hero.damage,
          hp: hero.hp,
          weapon: hero.weaponId,
        });

        // Initialiser les souscriptions après le chargement des données
        this.subscribeToStatsChanges();
        this.subscribeToWeaponChanges();

        if (hero.weaponId && this.weapons.length > 0) {
          this.selectedWeapon = this.weapons.find(
            (w) => w.id === hero.weaponId
          );
          if (this.selectedWeapon) {
            this.applyWeaponStats();
          }
        }
      }
    });
  }

  private subscribeToStatsChanges(): void {
    ['attack', 'dodge', 'damage', 'hp'].forEach((stat) => {
      this.heroForm.get(stat)?.valueChanges.subscribe((value) => {
        if (value !== null && value >= 1) {
          this.baseStats[stat as keyof typeof this.baseStats] = value;
          if (this.hero) {
            this.hero[
              stat as keyof Pick<
                HeroInterface,
                'attack' | 'dodge' | 'damage' | 'hp'
              >
            ] = value;
          }
        }
      });
    });
  }

  private subscribeToWeaponChanges(): void {
    console.log('subscribeToWeaponChanges');
    this.heroForm.get('weapon')?.valueChanges.subscribe((weaponId) => {
      this.handleWeaponChange(weaponId);
    });
  }

  private loadWeapons(): void {
    this.weaponService.getWeapons().subscribe((weapons) => {
      this.weapons = weapons;
    });
  }

  private handleWeaponChange(weaponId: number | null): void {
    this.resetToBaseStats();
    if (weaponId) {
      this.selectedWeapon = this.weapons.find((w) => w.id === weaponId);
      this.applyWeaponStats();
    }
  }

  private resetToBaseStats(): void {
    this.heroForm.patchValue(this.baseStats);
  }

  private applyWeaponStats(): void {
    console.log('applyWeaponStats');
    if (this.selectedWeapon && this.hero) {
      const newStats = this.calculateStatsWithWeapon(this.selectedWeapon);
      this.heroForm.patchValue(newStats);

      Object.assign(this.hero, newStats); // Met à jour le héros
    }
  }

  private calculateStatsWithWeapon(weapon: WeaponInterface) {
    return {
      attack: this.baseStats.attack + (weapon.attack || 0),
      dodge: this.baseStats.dodge + (weapon.dodge || 0),
      damage: this.baseStats.damage + (weapon.damage || 0),
      hp: this.baseStats.hp + (weapon.hp || 0),
    };
  }

  getRemainingPoints(): number {
    return this.hero?.remainingPoints ?? 0;
  }

  isValid(): boolean {
    return this.hero?.isValid() ?? false;
  }

  goBack(): void {
    window.history.back();
  }

  delete(): void {
    if (this.hero) {
      this.heroService.deleteHero(this.hero.id).then(() => {
        this.messageService.add('Hero deleted.');
        this.router.navigate(['/heroes']);
      });
    }
  }

  save(): void {
    if (this.isValid()) {
      const formValues = this.heroForm.value;
      const hero = new HeroInterface(
        this.hero?.id || 0,
        formValues.name,
        formValues.attack,
        formValues.dodge,
        formValues.damage,
        formValues.hp,
        formValues.weapon
      );

      const saveMethod = this.hero?.id
        ? this.heroService.updateHero(hero)
        : this.heroService.addHero(hero);

      saveMethod.then(() => {
        this.messageService.add(`Hero ${this.hero?.id ? 'updated' : 'added'}.`);
        this.goBack();
      });
    } else {
      this.messageService.add('Form is not valid or points are not valid.');
    }
  }
}
