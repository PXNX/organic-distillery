/** A run of text inside a paragraph; "\n" inside a string is a line break. */
export type Inline = string | { text: string; href?: string; strong?: boolean; em?: boolean };

/** A paragraph of inline runs. */
export type Rich = Inline[];

export interface Link {
	href: string;
	label: string;
}

export type FamilyName = 'ZITRUS' | 'FRUCHTIG' | 'FLORAL' | 'GRÜN' | 'HERBAL';

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

export interface Recipe {
	pdf: string;
	photo?: string;
	portrait?: boolean;
	signature?: string;
	/** Christine's portrait of the essence, without the sign-off. */
	letter: string;
	feature?: { dish?: string; text: string };
	cocktail?: Cocktail;
	uses: RecipeUse[];
}

export interface Essence {
	slug: string;
	/** "Mandarine Geist" */
	name: string;
	/** "Mandarine" */
	short: string;
	family: FamilyName;
	latin: string;
	abv: number;
	lead: string;
	aroma: string;
	pairings: { group: string; items: string[] }[];
	/** Short dish suggestions for the aroma wheel. */
	tags: string[];
	bottle: string;
	drawing: string;
	recipe: Recipe;
}

export interface Gin {
	slug: 'ginn' | 'ginnie';
	name: string;
	abv: number;
	lead: string;
	bottles: { '500ml': string; '200ml': string };
}

/** Building blocks of the content pages. */
export type Block =
	| {
			kind: 'teaser';
			title?: string;
			/** Page title (h1) or section title (h2). */
			level?: 1 | 2;
			subtitle?: string;
			body: Rich[];
			actions?: Link[];
	  }
	| {
			kind: 'text';
			title: string;
			/** Photo above a centred column. */
			image?: string;
			/** Full-bleed background behind two columns. */
			background?: string;
			columns: Rich[][];
	  }
	| { kind: 'feature'; title?: string; text?: string; image: string; link?: Link }
	| { kind: 'gallery'; images: string[] };

export interface Page {
	path: string;
	title: string;
	description: string;
	blocks: Block[];
}

export interface Retailer {
	city: string;
	name: string;
	street: string;
	zip: string;
}

export interface PressItem {
	date: string;
	title: string;
	source: string;
	href: string;
	kind: 'pdf' | 'film' | 'link';
}
