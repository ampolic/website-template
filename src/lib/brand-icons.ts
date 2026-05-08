import type { SimpleIcon } from "simple-icons";
import {
  siFacebook,
  siGoogle,
  siHouzz,
  siInstagram,
  siNextdoor,
  siPinterest,
  siTiktok,
  siThumbtack,
  siWhatsapp,
  siX,
  siYelp,
  siYoutube,
} from "simple-icons";

export const brandIcons = {
  facebook: siFacebook,
  google: siGoogle,
  houzz: siHouzz,
  instagram: siInstagram,
  nextdoor: siNextdoor,
  pinterest: siPinterest,
  tiktok: siTiktok,
  thumbtack: siThumbtack,
  whatsapp: siWhatsapp,
  x: siX,
  yelp: siYelp,
  youtube: siYoutube,
} satisfies Record<string, SimpleIcon>;

export type BrandIconName = keyof typeof brandIcons;

export function isBrandIconName(name: string): name is BrandIconName {
  return name in brandIcons;
}
