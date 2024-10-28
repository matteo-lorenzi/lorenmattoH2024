import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeroInterface } from '../../data/heroInterface';
import { MessageService } from '../../services/message.service';
import { MessageComponent } from '../message/message.component';
import { WeaponService } from '../../services/weapon.service';

@Component({
  selector: 'app-add-weapon',
  standalone: true,
  imports: [ReactiveFormsModule, MessageComponent],
  templateUrl: './add-weapon.component.html',
  styleUrl: './add-weapon.component.css'
})
export class AddWeaponComponent {
  addWeaponForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private weaponService: WeaponService,
    private router: Router,
    private messageComponent: MessageService
  ) {}

  ngOnInit(): void {
    this.addWeaponForm = this.fb.group({
      name: ['', Validators.required],
      attack: [1, [Validators.required, Validators.min(1)]],
      dodge: [1, [Validators.required, Validators.min(1)]],
      damage: [1, [Validators.required, Validators.min(1)]],
      hp: [1, [Validators.required, Validators.min(1)]],
    });
  }

  getRemainingPoints(): number {
    const totalPoints =
      this.addWeaponForm.value.attack +
      this.addWeaponForm.value.dodge +
      this.addWeaponForm.value.damage +
      this.addWeaponForm.value.hp;
    return totalPoints;
  }
  goBack() {
    window.history.back();
  }

  async getLastId(): Promise<number> {
    return await this.weaponService.getLastId();
  }

  isValid(): boolean {
    return this.getRemainingPoints() === 0;
  }

  async save(): Promise<void> {
    if (this.isValid()) {
      const lastId = await this.getLastId();
      const hero = new HeroInterface(
        lastId + 1,
        this.addWeaponForm.value.name,
        this.addWeaponForm.value.attack,
        this.addWeaponForm.value.dodge,
        this.addWeaponForm.value.damage,
        this.addWeaponForm.value.hp
      );
      this.weaponService.addWeapon(hero).then(() => {
        this.messageComponent.add('Weapon added successfully');
        this.router.navigate(['/weapons']);
      });
    } else {
      console.log('Form is not valid or points are not valid.');
    }
  }
}
