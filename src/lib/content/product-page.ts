import { essencePath, ginPath } from './catalog.js';
import { essences, gins } from './products.js';
import { flavorFamilies } from '../features/flavor-wheel.js';
import type { Essence, Gin } from './types.js';

export interface ProductPage {
	kind: 'essence' | 'gin';
	name: string;
	/** Aroma family for essences, with its colour. */
	family?: { name: string; color: string };
	/** "50 ml · 55 % Vol." */
	meta: string[];
	lead: string;
	aroma?: string;
	pairings: { group: string; items: string[] }[];
	bottle: string;
	drawing: { src: string; outline: string; latin: string } | null;
	prev: string;
	next: string;
}

const neighbours = <T>(list: T[], item: T, path: (entry: T) => string) => {
	const index = list.indexOf(item);
	return {
		prev: path(list[(index - 1 + list.length) % list.length] as T),
		next: path(list[(index + 1) % list.length] as T)
	};
};

export function essencePage(essence: Essence): ProductPage {
	const family = flavorFamilies.find((entry) => entry.name === essence.family);
	return {
		kind: 'essence',
		name: essence.name,
		...(family ? { family: { name: family.name, color: family.color } } : {}),
		meta: [`50 ml · ${essence.abv} % Vol.`],
		lead: essence.lead,
		aroma: essence.aroma,
		pairings: essence.pairings,
		bottle: essence.bottle,
		drawing: { src: essence.drawing, outline: essence.outline, latin: essence.latin },
		...neighbours(essences, essence, essencePath)
	};
}

export function ginPage(gin: Gin): ProductPage {
	return {
		kind: 'gin',
		name: gin.name,
		meta: [`Organic unfiltered Dry Gin · ${gin.abv} % Vol.`, '500 ml · 200 ml'],
		lead: gin.lead,
		pairings: [],
		bottle: gin.bottles['500ml'],
		drawing: null,
		...neighbours(gins, gin, ginPath)
	};
}
