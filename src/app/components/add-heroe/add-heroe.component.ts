import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HeroService } from '../../services/hero.service';
import { HeroInterface } from '../../data/heroInterface';
import { Router } from '@angular/router';
import { MessageComponent } from '../message/message.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-add-heroe',
  standalone: true,
  imports: [ReactiveFormsModule, MessageComponent],
  templateUrl: './add-heroe.component.html',
  styleUrls: ['./add-heroe.component.css'],
})
export class AddHeroeComponent implements OnInit {
  addheroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private heroService: HeroService,
    private router: Router,
    private messageComponent: MessageService
  ) {}

  ngOnInit(): void {
    this.addheroForm = this.fb.group({
      name: ['', Validators.required],
      attack: [1, [Validators.required, Validators.min(1)]],
      dodge: [1, [Validators.required, Validators.min(1)]],
      damage: [1, [Validators.required, Validators.min(1)]],
      hp: [1, [Validators.required, Validators.min(1)]],
    });
  }

  getRemainingPoints(): number {
    const totalPoints =
      this.addheroForm.value.attack +
      this.addheroForm.value.dodge +
      this.addheroForm.value.damage +
      this.addheroForm.value.hp;
    return 40 - totalPoints;
  }
  goBack() {
    this.router.navigate(['/heroes']);
  }

  async getLastId(): Promise<number> {
    return await this.heroService.getLastId();
  }

  isValid(): boolean {
    return this.getRemainingPoints() === 0;
  }

  async save(): Promise<void> {
    if (this.isValid()) {
      const lastId = await this.getLastId();
      const hero = new HeroInterface(
        lastId + 1,
        this.addheroForm.value.name,
        this.addheroForm.value.attack,
        this.addheroForm.value.dodge,
        this.addheroForm.value.damage,
        this.addheroForm.value.hp
      );
      this.heroService.addHero(hero).then(() => {
        this.messageComponent.add('Hero added successfully');
        this.router.navigate(['/heroes']);
      });
    } else {
      console.log('Form is not valid or points are not valid.');
    }
  }
}
