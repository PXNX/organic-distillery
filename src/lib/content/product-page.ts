import { botanicalPlate, essenceName } from '../mirror/embellish.js';
import type { MirroredPage } from '../mirror/types.js';

export interface ProductSection {
	title: string;
	lines: string[];
}

export interface ProductPage {
	kind: 'essence' | 'gin';
	name: string;
	/** Aroma family for essences ("ZITRUS"), with the label colour from the original site. */
	family?: { name: string; color: string };
	/** "50 ml · 55 % Vol." */
	meta: string[];
	lead: string;
	sections: ProductSection[];
	bottle: string | null;
	drawing: { src: string; outline: string; latin: string } | null;
	photo: string | null;
	prev: string | null;
	next: string | null;
}

const text = (html: string) =>
	html
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();

const localPath = (href: string | undefined) => (href ? href.replace(/\/$/, '') || '/' : null);

/** Reads the structured content out of a mirrored essence or gin detail page. */
export function productPage(page: MirroredPage): ProductPage | null {
	const kind = page.path.startsWith('/essenzen/')
		? 'essence'
		: page.path.startsWith('/gins/')
			? 'gin'
			: null;
	if (!kind) return null;
	const html = page.html;

	const card = html.slice(html.indexOf('<div class="o-product">'));
	const label = card.match(
		/<strong class="o-essence__label" style="color:(#[0-9a-f]{3,6});?">([^<]+)<\/strong>/i
	);
	const teaser = card.match(/<div class="single-teaser">([\s\S]*?)<\/div>/)?.[1] ?? '';
	const meta = teaser
		.replace(/<strong[\s\S]*?<\/strong>/, '')
		.split(/<br>|<\/p>|<\/span>/)
		.map(text)
		.filter(Boolean)
		.map((part) => part.replace(/(\d)\s*%\s*Vol\./, '$1 % Vol.').replace(/\s*\/\s*/g, ' · '));

	const afterTeaser = card.slice(card.indexOf('</div>', card.indexOf('single-teaser')) + 6);
	const paragraphs = [...afterTeaser.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) =>
		(m[1] ?? '')
			.split(/<br\s*\/?>/)
			.map(text)
			.filter(Boolean)
	);
	let lead = '';
	const sections: ProductSection[] = [];
	for (const lines of paragraphs) {
		const [first = '', ...rest] = lines;
		const titled = rest.length > 0 && first.length < 40;
		if (titled) sections.push({ title: first.replace(/:$/, ''), lines: rest });
		else if (!lead) lead = lines.join(' ');
		else sections.push({ title: '', lines });
	}

	const prev = localPath(card.match(/arrow--left[\s\S]*?href="([^"]+)"/)?.[1]);
	const nextMatch =
		card.match(/<a href="([^"]+)"><span class="arrow arrow--right"/)?.[1] ??
		card.match(/arrow--right"><a href="([^"]+)"/)?.[1];
	const plate = botanicalPlate(page);

	return {
		kind,
		name: essenceName(page.title),
		...(label ? { family: { name: label[2]?.trim() ?? '', color: label[1] ?? '#b08d57' } } : {}),
		meta,
		lead,
		sections,
		bottle: card.match(/<img[^>]*src="([^"]+)"[^>]*wp-post-image/)?.[1] ?? null,
		drawing: plate
			? {
					src: plate.src,
					outline: plate.src.replace(/\.webp$/i, '-outline.webp'),
					latin: plate.latin.replace(/\s+\S+$/, '')
				}
			: null,
		photo:
			kind === 'gin'
				? (html.match(/class="single-column__img"[^>]*src="([^"]+)"/)?.[1] ??
					html.match(/src="([^"]+)"[^>]*class="single-column__img"/)?.[1] ??
					null)
				: null,
		prev,
		next: localPath(nextMatch)
	};
}
