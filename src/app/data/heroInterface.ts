export class HeroInterface {
  constructor(
    public id: number,
    public name: string,
    public attack: number,
    public dodge: number,
    public damage: number,
    public hp: number,
    public weaponId: number | null = null,
    public selectedWeapon: {
      attack?: number;
      dodge?: number;
      damage?: number;
      hp?: number;
    } | null = null
  ) {}

  // Calcul du total des points attribués aux caractéristiques
  get totalPoints(): number {
    const weaponBonus = this.selectedWeapon
      ? {
          attack: this.selectedWeapon.attack || 0,
          dodge: this.selectedWeapon.dodge || 0,
          damage: this.selectedWeapon.damage || 0,
          hp: this.selectedWeapon.hp || 0,
        }
      : { attack: 0, dodge: 0, damage: 0, hp: 0 };

    return (
      this.attack +
      weaponBonus.attack +
      this.dodge +
      weaponBonus.dodge +
      this.damage +
      weaponBonus.damage +
      this.hp +
      weaponBonus.hp
    );
  }

  // Calcul des points restants à attribuer (maximum de 40)
  get remainingPoints(): number {
    return 40 - this.totalPoints;
  }

  // Vérification de la validité des points
  isValid(): boolean {
    console.log(`Total points heroe (without weapon): ${this.totalPoints}`);
    console.log(
      `Hero validity: ${this.remainingPoints >= 0}` + ' ' + this.remainingPoints
    );
    return this.remainingPoints >= 0;
  }
}
