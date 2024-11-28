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
  private updatingForm = false;

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

    // Souscrire aux changements une seule fois lors de l'initialisation
    this.subscribeToFormChanges();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadWeapons();
    this.getHero();
  }

  private getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe((hero) => {
      if (hero) {
        this.hero = hero;

        // Sauvegarder les stats de base initiales
        this.baseStats = {
          attack: hero.attack,
          dodge: hero.dodge,
          damage: hero.damage,
          hp: hero.hp,
        };

        // Mettre à jour le formulaire sans déclencher les souscriptions
        this.updatingForm = true;
        this.heroForm.patchValue({
          name: hero.name,
          attack: hero.attack,
          dodge: hero.dodge,
          damage: hero.damage,
          hp: hero.hp,
          weapon: hero.weaponId,
        });
        this.updatingForm = false;

        // Charger l'arme si elle existe
        if (hero.weaponId && this.weapons.length > 0) {
          this.selectedWeapon = this.weapons.find(
            (w) => w.id === hero.weaponId
          );
          if (this.selectedWeapon) {
            // Soustraire les bonus d'arme des stats de base
            this.updateBaseStatsWithoutWeapon();
          }
        }
      }
    });
  }

  private updateBaseStatsWithoutWeapon(): void {
    if (this.selectedWeapon) {
      this.baseStats = {
        attack: this.baseStats.attack - (this.selectedWeapon.attack || 0),
        dodge: this.baseStats.dodge - (this.selectedWeapon.dodge || 0),
        damage: this.baseStats.damage - (this.selectedWeapon.damage || 0),
        hp: this.baseStats.hp - (this.selectedWeapon.hp || 0),
      };
    }
  }

  private subscribeToFormChanges(): void {
    // Souscrire aux changements de stats basiques
    ['attack', 'dodge', 'damage', 'hp'].forEach((stat) => {
      this.heroForm.get(stat)?.valueChanges.subscribe((value) => {
        if (!this.updatingForm && value !== null && value >= 1) {
          // Mettre à jour les stats de base
          const weaponBonus = this.selectedWeapon
            ? (this.selectedWeapon[stat as keyof WeaponInterface] as number) || 0
            : 0;
          this.baseStats[stat as keyof typeof this.baseStats] =
            value - weaponBonus;

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

    // Souscrire aux changements d'arme
    this.heroForm.get('weapon')?.valueChanges.subscribe((weaponId) => {
      if (!this.updatingForm) {
        this.handleWeaponChange(weaponId);
      }
    });
  }

  private handleWeaponChange(weaponId: number | null): void {
    const previousWeapon = this.selectedWeapon;
    this.selectedWeapon = this.weapons.find((w) => w.id === weaponId);

    this.updatingForm = true;
    const totalStats = this.calculateTotalStats();

    // Mettre à jour le formulaire avec les nouvelles stats totales
    this.heroForm.patchValue({
      attack: totalStats.attack,
      dodge: totalStats.dodge,
      damage: totalStats.damage,
      hp: totalStats.hp,
    });

    if (this.hero) {
      Object.assign(this.hero, totalStats);
    }

    this.updatingForm = false;
  }

  private calculateTotalStats() {
    return {
      attack: this.baseStats.attack + (this.selectedWeapon?.attack || 0),
      dodge: this.baseStats.dodge + (this.selectedWeapon?.dodge || 0),
      damage: this.baseStats.damage + (this.selectedWeapon?.damage || 0),
      hp: this.baseStats.hp + (this.selectedWeapon?.hp || 0),
    };
  }

  private loadWeapons(): void {
    this.weaponService.getWeapons().subscribe((weapons) => {
      this.weapons = weapons;
    });
  }

  getRemainingPoints(): number {
    return this.hero?.remainingPoints ?? 0;
  }

  isValid(): boolean {
    return this.heroForm.valid && (this.hero?.isValid() ?? false);
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
