import { Total } from './total';
import { BootAboRevenu } from './boot-abo-revenu';
import { RevenuIsland } from './revenu-island';
import { RevenuTotal } from './revenu-total';
import { RevenuBoot } from './revenu-boot';
import { RevenuBootDatum } from './revenu-boot-datum';

export class RevenuAbo {
  totalAbo: Total;
  aboPerBoat: BootAboRevenu[];
  revenuPerIsland: RevenuIsland[];
  revenuTotal: RevenuTotal;
  revenuPerBoat: RevenuBoot[];
  revenuPerBoatPerDate: RevenuBootDatum[];
}
