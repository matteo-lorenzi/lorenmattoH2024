export class WeaponInterface {
  constructor(
    public id: number,
    public name: string,
    public attack: number,
    public dodge: number,
    public damage: number,
    public hp: number
  ) {}

  // Calcul du total des points attribués aux caractéristiques
  get totalPoints(): number {
    return (
      Number(this.attack) +
      Number(this.dodge) +
      Number(this.damage) +
      Number(this.hp)
    );
  }

  // Calcul des points restants à attribuer (maximum de 40)
  get remainingPoints(): number {
    console.log('total point : ' + this.totalPoints);
    return this.totalPoints;
  }

  // Vérification de la validité des points
  isValid(): boolean {
    console.log(`Weapon validity: ${this.remainingPoints === 0}`);
    return this.remainingPoints === 0;
  }
}
