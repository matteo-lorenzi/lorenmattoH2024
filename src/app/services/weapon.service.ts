import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { WeaponInterface } from '../data/weaponInterface'; // Assurez-vous d'importer votre classe WeaponInterface

@Injectable({
  providedIn: 'root'
})
export class WeaponService {
  private static collectionName = 'weapons';

  constructor(private firestore: Firestore) {}

  getWeapons(): Observable<WeaponInterface[]> {
    const weaponsCollection = collection(this.firestore, WeaponService.collectionName);
    return from(getDocs(weaponsCollection)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return new WeaponInterface(
            Number(doc.id), // Convertissez doc.id en number
            data['name'],
            data['attack'],
            data['dodge'],
            data['damage'],
            data['hp']
          );
        });
      })
    );
  }

  getWeapon(id: number): Observable<WeaponInterface | undefined> {
    const weaponDocRef = doc(this.firestore, WeaponService.collectionName, id.toString()); // Convertissez id en string
    return from(getDoc(weaponDocRef)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          return new WeaponInterface(
            Number(docSnapshot.id), // Convertissez docSnapshot.id en number
            data['name'],
            data['attack'],
            data['dodge'],
            data['damage'],
            data['hp']
          );
        } else {
          return undefined;
        }
      })
    );
  }

  addWeapon(weapon: WeaponInterface): Promise<void> {
    const weaponDocRef = doc(this.firestore, WeaponService.collectionName, weapon.id.toString());
    return setDoc(weaponDocRef, {
      name: weapon.name,
      attack: weapon.attack,
      dodge: weapon.dodge,
      damage: weapon.damage,
      hp: weapon.hp
    });
  }

  updateWeapon(weapon: WeaponInterface): Promise<void> {
    const weaponDocRef = doc(this.firestore, WeaponService.collectionName, weapon.id.toString());
    return setDoc(weaponDocRef, {
      name: weapon.name,
      attack: weapon.attack,
      dodge: weapon.dodge,
      damage: weapon.damage,
      hp: weapon.hp
    });
  }

  // Supprime un le document du héros de la base de données
  async deleteWeapon(id: number): Promise<void> {
    const heroDocRef = doc(this.firestore, WeaponService.collectionName, id.toString());
    await deleteDoc(heroDocRef);
  }

  // Retourne le dernier ID de la liste des héros
  async getLastId(): Promise<number> {
    const heroesCollection = collection(
      this.firestore,
      WeaponService.collectionName
    );
    const querySnapshot = await getDocs(heroesCollection);
    const lastHero = querySnapshot.docs[querySnapshot.docs.length - 1];
    return Number(lastHero.id);
  }
}
