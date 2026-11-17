import { titleCase, type StructuredRecipe } from './recipe-text.js';

export interface RecipeUse {
	title: string;
	text: string;
	/** Dosage pulled from the text, e.g. "15 Tropfen" or "10–20 Tropfen". */
	drops?: string;
}

export interface Cocktail {
	name: string;
	credit?: string;
	ingredients: { amount: string; name: string }[];
}

export interface RecipeView {
	/** The essence portrait from the PDF, without the sign-off. */
	letter: string;
	feature?: { dish?: string; text: string };
	cocktail?: Cocktail;
	uses: RecipeUse[];
}

const SIGN_OFF =
	/\s*Ich wünsche viel Spass beim Ausprobieren und Geniessen!\s*(?:Ihre\s*\/\s*Eure\s*)?(?:Organic Distillery(?: GmbH)?)?\s*\.?/g;
const TRAILING_BRAND = /\s*Organic Distillery\s*\.\s*$/;
const DROPS = /(\d+\s*[-–]\s*\d+|\d+)\s*(?:Tropfen|Tr\.)/;
const INGREDIENT =
	/(\d+(?:[.,]\d+)?)\s*(cl|ml|Tr|Tropfen)?\.?\s+(.+?)(?=\s+\d+(?:[.,]\d+)?\s*(?:cl|ml|Tr|Tropfen)?\.?\s|\s+Filler:|$)/g;

const tidy = (text: string) =>
	text
		.replace(SIGN_OFF, ' ')
		.replace(TRAILING_BRAND, '')
		.replace(/\s{2,}/g, ' ')
		.trim();

function parseIngredients(text: string): Cocktail['ingredients'] {
	const [main = '', filler] = text.split(/\s*Filler:\s*/);
	const ingredients = [...main.matchAll(INGREDIENT)].map((match) => ({
		amount: [match[1], match[2] === 'Tr' ? 'Tropfen' : match[2]].filter(Boolean).join(' '),
		name: (match[3] ?? '').trim()
	}));
	if (filler) ingredients.push({ amount: 'Auffüllen', name: filler.trim() });
	return ingredients;
}

const isCocktailBody = (text: string) => /^\(by [^)]+\)|^\d+(?:[.,]\d+)?\s*cl\b/.test(text);

/** Shapes a structured recipe into what the recipe section shows. */
export function recipeView(recipe: StructuredRecipe): RecipeView {
	let letter = tidy(recipe.intro);
	const sections = recipe.sections.map((section) => ({ ...section, body: tidy(section.body) }));
	let cocktail: Cocktail | undefined;

	// A cocktail whose title and first ingredient slipped into the intro ("Deep & Bitter (by …) 4 cl"),
	// with the next ingredient word read as a section heading ("GINNIE").
	const spill = letter.match(/^(.*[.!?])\s+([^!?()]{2,40}?)\s*\(by ([^)]+)\)\s*(.*)$/);
	if (spill) {
		// Only when the spilled text stops on a bare amount does the next section carry on with it.
		const dangling = /\d+(?:[.,]\d+)?\s*(?:cl|ml|Tr|Tropfen)?\.?$/.test(spill[4] ?? '');
		const next = dangling
			? sections.findIndex((section) => !/INSPIRATION/.test(section.heading))
			: -1;
		const rest = next >= 0 ? sections.splice(next, 1)[0] : undefined;
		letter = (spill[1] ?? '').trim();
		cocktail = {
			name: (spill[2] ?? '').trim(),
			...(spill[3] ? { credit: spill[3] } : {}),
			ingredients: parseIngredients(
				[spill[4], rest ? `${titleCase(rest.heading)} ${rest.body}` : ''].join(' ').trim()
			)
		};
	}

	const inspiration = sections.find((section) => /INSPIRATION/.test(section.heading));
	const uses: RecipeUse[] = [];
	for (const section of sections) {
		if (section === inspiration || !section.body) continue;
		if (!cocktail && isCocktailBody(section.body)) {
			const credit = section.body.match(/^\(by ([^)]+)\)\s*/);
			cocktail = {
				name: section.heading.length <= 4 ? section.heading : titleCase(section.heading),
				...(credit?.[1] ? { credit: credit[1] } : {}),
				ingredients: parseIngredients(section.body.slice(credit?.[0].length ?? 0))
			};
			continue;
		}
		const drops = section.body.match(DROPS)?.[1]?.replace(/\s*[-–]\s*/, '–');
		uses.push({
			title: titleCase(section.heading),
			text: section.body,
			...(drops ? { drops: `${drops} Tropfen` } : {})
		});
	}

	return {
		letter,
		...(inspiration
			? {
					feature: {
						...(inspiration.dish ? { dish: titleCase(inspiration.dish) } : {}),
						text: inspiration.body
					}
				}
			: {}),
		...(cocktail ? { cocktail } : {}),
		uses
	};
}
