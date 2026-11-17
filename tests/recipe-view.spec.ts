import { describe, expect, it } from 'vitest';
import { recipeView } from '../src/lib/features/recipe-view.js';

describe('recipeView', () => {
	it('pulls dosage badges and drops the sign-off', () => {
		const view = recipeView({
			intro:
				'Frisch und blumig. Ich wünsche viel Spass beim Ausprobieren und Geniessen! Ihre / Eure Organic Distillery GmbH',
			sections: [
				{ heading: 'INSPIRATIONEN', dish: 'BLATTSALATE', body: 'Schenkt jedem Salat Frische.' },
				{ heading: 'SAUCEN', body: 'Mit 10-20 Tropfen der Essenz verfeinern.' }
			]
		});
		expect(view.letter).toBe('Frisch und blumig.');
		expect(view.feature).toEqual({ dish: 'Blattsalate', text: 'Schenkt jedem Salat Frische.' });
		expect(view.uses).toEqual([
			{ title: 'Saucen', text: 'Mit 10-20 Tropfen der Essenz verfeinern.', drops: '10–20 Tropfen' }
		]);
	});

	it('rebuilds a cocktail that spilled into the intro and the next heading', () => {
		const view = recipeView({
			intro: 'Zitrisch und frisch. Deep & Bitter (by Kai Junker) 4 cl',
			sections: [
				{ heading: 'GINNIE', body: '2 cl Roter Kräuterlikör 10 Tr. Zitronen Verbena' },
				{ heading: 'INSPIRATIONEN', dish: 'DEEP & BITTER', body: 'Erfrischend.' }
			]
		});
		expect(view.letter).toBe('Zitrisch und frisch.');
		expect(view.cocktail).toEqual({
			name: 'Deep & Bitter',
			credit: 'Kai Junker',
			ingredients: [
				{ amount: '4 cl', name: 'Ginnie' },
				{ amount: '2 cl', name: 'Roter Kräuterlikör' },
				{ amount: '10 Tropfen', name: 'Zitronen Verbena' }
			]
		});
		expect(view.uses).toEqual([]);
	});

	it('reads a cocktail section with a filler', () => {
		const view = recipeView({
			intro: 'Krautig.',
			sections: [
				{ heading: 'TCR', body: '(by Kai Junker) 4 cl Tequila 20 Tr. Cistrose Filler: Ginger Ale' }
			]
		});
		expect(view.cocktail?.ingredients.at(-1)).toEqual({ amount: 'Auffüllen', name: 'Ginger Ale' });
	});
});
