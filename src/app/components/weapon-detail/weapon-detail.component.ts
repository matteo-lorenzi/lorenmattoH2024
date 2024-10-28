import { Component, Input, OnInit } from '@angular/core';
import { WeaponInterface } from '../../data/weaponInterface';
import { WeaponService } from '../../services/weapon.service';
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

@Component({
  selector: 'app-weapon-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    UpperCasePipe,
    MessageComponent,
  ],
  templateUrl: './weapon-detail.component.html',
  styleUrls: ['./weapon-detail.component.css'],
})
export class WeaponDetailComponent implements OnInit {
  @Input() weapon?: WeaponInterface;
  weaponForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private weaponService: WeaponService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getWeapon();
    this.weaponForm = this.fb.group({
      name: [this.weapon?.name || '', Validators.required],
      attack: [
        this.weapon?.attack || 1,
        [Validators.required, Validators.min(1)],
      ],
      dodge: [
        this.weapon?.dodge || 1,
        [Validators.required, Validators.min(1)],
      ],
      damage: [
        this.weapon?.damage || 1,
        [Validators.required, Validators.min(1)],
      ],
      hp: [this.weapon?.hp || 1, [Validators.required, Validators.min(1)]],
    });
    this.weaponForm.valueChanges.subscribe((values) => {
      if (this.weapon) {
        this.weapon.name = values.name;
        this.weapon.attack = values.attack;
        this.weapon.dodge = values.dodge;
        this.weapon.damage = values.damage;
        this.weapon.hp = values.hp;
      }
    });
  }

  getWeapon(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.weaponService.getWeapon(id).subscribe((weapon) => {
      if (weapon) {
        this.weapon = weapon;
        this.weaponForm.patchValue({
          name: weapon.name,
          attack: weapon.attack,
          dodge: weapon.dodge,
          damage: weapon.damage,
          hp: weapon.hp,
        });
      }
    });
  }

  getRemainingPoints(): number {
    return this.weapon?.remainingPoints ?? 0;
  }

  isValid(): boolean {
    const isValid = this.weapon?.isValid() ?? false;
    console.log('Is valid:', isValid);
    return isValid;
  }

  goBack(): void {
    window.history.back();
  }

  delete(): void {
    if (this.weapon) {
      this.weaponService.deleteWeapon(this.weapon.id).then(() => {
        this.messageService.add('Weapon deleted.');
        this.router.navigate(['/weapons']);
      });
    }
  }

  save(): void {
    if (this.isValid()) {
      const weapon = new WeaponInterface(
        this.weapon?.id || 0,
        this.weaponForm.value.name,
        this.weaponForm.value.attack,
        this.weaponForm.value.dodge,
        this.weaponForm.value.damage,
        this.weaponForm.value.hp
      );
      if (this.weapon?.id) {
        this.weaponService.updateWeapon(weapon).then(() => {
          this.messageService.add('Weapon updated.');
          this.goBack();
        });
      } else {
        this.weaponService.addWeapon(weapon).then(() => {
          this.messageService.add('Weapon added.');
          this.goBack();
        });
      }
    } else {
      this.messageService.add('Form is not valid or points are not valid.');
      console.log('Form is not valid or points are not valid.');
    }
  }
}
