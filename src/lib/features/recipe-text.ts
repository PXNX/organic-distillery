export interface RecipeSection {
	heading: string;
	body: string;
	/** Name of the featured dish or drink, when the PDF prints one above "INSPIRATIONEN". */
	dish?: string;
}

export interface StructuredRecipe {
	intro: string;
	sections: RecipeSection[];
}

/** Matches a word whose letters may be letter-spaced in the PDF ("E U C A LY P T U S"). */
function spaced(word: string): string {
	return [...word.toUpperCase().replace(/\s+/g, '')]
		.map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		.join('\\s?');
}

const CAPS_TOKEN = /^[A-ZÄÖÜ0-9][A-ZÄÖÜß0-9\-/&,.:()]*$/;

function isCapsToken(token: string): boolean {
	return CAPS_TOKEN.test(token) && /[A-ZÄÖÜ]{2}/.test(token);
}

/**
 * Turns the flat text extracted from a recipe PDF into an intro and titled sections.
 * Drops letter-spaced title blocks and the repeated "Organic Distillery . AROMAFAMILIE …" footers.
 */
export function structureRecipe(text: string, essence: string, family = ''): StructuredRecipe {
	let clean = ` ${text} `;
	const name = spaced(essence);
	clean = clean.replace(
		new RegExp(`Organic Distillery \\. AROMAFAMILIE \\S+ \\. ${name}`, 'g'),
		' '
	);
	clean = clean.replace(
		new RegExp(
			`E\\s?S\\s?S\\s?E\\s?N\\s?Z\\s${name}(?:\\s${family ? spaced(family) : '\\S+'})?`,
			'g'
		),
		' '
	);
	// Any remaining runs of single letter-spaced capitals.
	clean = clean.replace(/(?:\b[A-ZÄÖÜ]{1,2}\s){3,}[A-ZÄÖÜ]{1,2}\b/g, ' ');
	clean = clean
		.replace(/([a-zäöüß])- (?!(?:oder|und|bis|bzw|sowie)\b)([a-zäöüß])/g, '$1$2')
		.replace(/\s+/g, ' ')
		.trim();

	const tokens = clean.split(' ');
	const blocks: { caps: boolean; words: string[] }[] = [];
	for (const token of tokens) {
		const caps = isCapsToken(token);
		const last = blocks.at(-1);
		if (last && last.caps === caps) last.words.push(token);
		else blocks.push({ caps, words: [token] });
	}

	let intro = '';
	const sections: RecipeSection[] = [];
	let heading = '';
	for (const block of blocks) {
		const value = block.words.join(' ');
		// "GEMÜSE & SAUCEN", "FISCH, ZUCCHINI - SILBER WERMUT SAUCE": joiners belong to the heading.
		if (!block.caps && heading && !/[a-zäöüß]/i.test(value)) {
			heading = `${heading} ${value}`;
			continue;
		}
		if (block.caps) {
			heading = heading ? `${heading} ${value}` : value;
			continue;
		}
		if (!heading && sections.length === 0) {
			intro = intro ? `${intro} ${value}` : value;
		} else if (heading) {
			const inspiration = heading.match(/^(.+?)\s+INSPIRATIONEN$/);
			sections.push(
				inspiration
					? { heading: 'INSPIRATIONEN', dish: inspiration[1] ?? '', body: value }
					: { heading, body: value }
			);
		} else {
			const last = sections.at(-1);
			if (last) last.body = `${last.body} ${value}`;
		}
		heading = '';
	}
	return { intro, sections };
}

/** "ORIENTALISCHE AUBERGINEN-TAJINE" -> "Orientalische Auberginen-Tajine". */
export function titleCase(value: string): string {
	return value
		.toLowerCase()
		.replace(
			/(^|[\s\-/(])([a-zäöüß])/g,
			(_match, lead: string, char: string) => lead + char.toUpperCase()
		);
}
