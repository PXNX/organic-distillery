import { botanicalPlate, type BotanicalPlate } from '../mirror/embellish.js';
import { site } from './index.js';

/** All botanical drawings, one per essence detail page. */
export const botanicalPlates: BotanicalPlate[] = site.pages
	.map(botanicalPlate)
	.filter((plate): plate is BotanicalPlate => plate !== null);
