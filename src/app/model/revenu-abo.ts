import { Total } from './total';
import { BootAboRevenu } from './boot-abo-revenu';
import { RevenuIsland } from './revenu-island';
import { RevenuTotal } from './revenu-total';
import { RevenuBoot } from './revenu-boot';

export class RevenuAbo {
  totalAbo: Total;
  aboPerBoat: BootAboRevenu[];
  revenuPerIsland: RevenuIsland[];
  revenuTotal: RevenuTotal;
  revenuPerBoat: RevenuBoot[];

}
