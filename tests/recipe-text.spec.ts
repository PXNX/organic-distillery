import { describe, expect, it } from 'vitest';
import { structureRecipe, titleCase } from '../src/lib/features/recipe-text.js';

const sample =
	'Eine aromatische Varietät. E S S E N Z M A N D A R I N E Z I T R U S Organic Distillery . AROMAFAMILIE ZITRUS . MANDARINE BLATTSALATE INSPIRATIONEN Die Essenz schenkt jedem Salat Frische. GEMÜSE & SAUCEN Passt zu Spargel. FISCH 25 Tropfen in die Safran- oder Sahnesauce. Für Süß- speisen ideal. Organic Distillery . AROMAFAMILIE ZITRUS . MANDARINE';

describe('structureRecipe', () => {
	const recipe = structureRecipe(sample, 'Mandarine', 'ZITRUS');

	it('separates the intro from titled sections and drops PDF footers', () => {
		expect(recipe.intro).toBe('Eine aromatische Varietät.');
		expect(recipe.sections.map((section) => section.heading)).toEqual([
			'INSPIRATIONEN',
			'GEMÜSE & SAUCEN',
			'FISCH'
		]);
		expect(JSON.stringify(recipe)).not.toContain('AROMAFAMILIE');
	});

	it('keeps the featured dish and repairs hyphenated line breaks', () => {
		expect(recipe.sections[0]?.dish).toBe('BLATTSALATE');
		expect(recipe.sections[2]?.body).toContain('Safran- oder Sahnesauce');
		expect(recipe.sections[2]?.body).toContain('Süßspeisen');
	});
});

describe('titleCase', () => {
	it('capitalises each word part', () => {
		expect(titleCase('ORIENTALISCHE AUBERGINEN-TAJINE')).toBe('Orientalische Auberginen-Tajine');
	});
});
