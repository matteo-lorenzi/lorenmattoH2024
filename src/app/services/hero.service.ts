import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeroInterface } from '../data/heroInterface'; // Assurez-vous d'importer votre classe HeroInterface

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private static collectionName = 'heroes';

  constructor(private firestore: Firestore) {}

  getHeroes(): Observable<HeroInterface[]> {
    const heroesCollection = collection(
      this.firestore,
      HeroService.collectionName
    );
    return from(getDocs(heroesCollection)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return new HeroInterface(
            Number(doc.id),
            data['name'],
            data['attack'],
            data['dodge'],
            data['damage'],
            data['hp'],
            data['weaponId'] || null  // Récupération de l'ID de l'arme
          );
        });
      })
    );
  }

  getHero(id: number): Observable<HeroInterface | undefined> {
    const heroDocRef = doc(
      this.firestore,
      HeroService.collectionName,
      id.toString()
    );
    return from(getDoc(heroDocRef)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          return new HeroInterface(
            Number(docSnapshot.id),
            data['name'],
            data['attack'],
            data['dodge'],
            data['damage'],
            data['hp'],
            data['weaponId'] || null  // Récupération de l'ID de l'arme
          );
        } else {
          return undefined;
        }
      })
    );
  }

  addHero(hero: HeroInterface): Promise<void> {
    const heroDocRef = doc(
      this.firestore,
      HeroService.collectionName,
      hero.id.toString()
    );
    return setDoc(heroDocRef, {
      name: hero.name,
      attack: hero.attack,
      dodge: hero.dodge,
      damage: hero.damage,
      hp: hero.hp,
      weaponId: hero.weaponId  // Sauvegarde de l'ID de l'arme
    });
  }

  async updateHero(hero: HeroInterface): Promise<void> {
    try {
      const heroDocRef = doc(
        this.firestore,
        `${HeroService.collectionName}/${hero.id}`
      );
      await setDoc(heroDocRef, {
        name: hero.name,
        attack: hero.attack,
        dodge: hero.dodge,
        damage: hero.damage,
        hp: hero.hp,
        weaponId: hero.weaponId  // Sauvegarde de l'ID de l'arme
      });
    } catch (error) {
      console.error('Error updating hero: ', error);
      throw new Error('Failed to update hero');
    }
  }


  // Supprime un le document du héros de la base de données
  async deleteHero(id: number): Promise<void> {
    const heroDocRef = doc(this.firestore, HeroService.collectionName, id.toString());
    await deleteDoc(heroDocRef);
  }

  // Retourne le dernier ID de la liste des héros
  async getLastId(): Promise<number> {
    const heroesCollection = collection(
      this.firestore,
      HeroService.collectionName
    );
    const querySnapshot = await getDocs(heroesCollection);
    const lastHero = querySnapshot.docs[querySnapshot.docs.length - 1];
    return Number(lastHero.id);
  }
}
