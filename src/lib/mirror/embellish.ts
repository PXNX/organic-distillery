export interface BotanicalPlate {
	path: string;
	src: string;
	latin: string;
	name: string;
}

export const DOCUMENTARY_URL =
	'https://www.ardmediathek.de/video/handwerkskunst/wie-man-einen-gin-herstellt/swr/Y3JpZDovL3N3ci5kZS9hZXgvbzE1MTYxNDY';

const pressList = /(<div class="o-module o-press o-wrapper">[\s\S]*?<ul>)/;

/** Adds the SWR documentary to the mirrored press list. */
export function addDocumentaryPress(html: string): string {
	if (html.includes(DOCUMENTARY_URL)) return html;
	const item = `<li class="o-press__item press-item--film"><div class="l-col l-2/12@tablet"><span>20.08.2021</span></div><!--
--><div class="l-col l-5/12@tablet"><span>Wie man einen Gin herstellt – Christine Brugger in „Handwerkskunst“</span></div><!--
--><div class="l-col l-3/12@tablet"><span>SWR / ARD Mediathek</span></div><!--
--><div class="l-col l-2/12@tablet"><a class="o-button o-button--small" href="${DOCUMENTARY_URL}" target="_blank" rel="noopener noreferrer">Film</a></div></li>`;
	return html.replace(pressList, `$1${item}`);
}

/** Turns vague WordPress order links into clearly labelled shop buttons. */
export function clarifyOrderLinks(html: string): string {
	return html
		.replace(
			/<a class="js-show-order" href="#">Online Bestellung<\/a>/g,
			'<a class="js-show-order o-button o-button--shop" href="#">Zum Online-Shop</a>'
		)
		.replace(
			/<a class="js-show-order" href="">Bestellen<\/a>/g,
			'<a class="js-show-order o-button o-button--shop" href="">Jetzt bestellen</a>'
		)
		.replace(
			/<a class="js-show-order" href="">www\.organic-distillery\.com<\/a>/g,
			'<a class="js-show-order o-button o-button--shop" href="">Online bestellen</a>'
		)
		.replace(
			/<a class="js-show-order" href="mailto:contact@organic-distillery\.com">contact@organic-distillery\.com<\/a>/g,
			'<a class="js-show-order o-button o-button--shop" href="mailto:contact@organic-distillery.com">Per E-Mail bestellen</a>'
		);
}

export interface RecipeLink {
	href: string;
	label: string;
	text?: string;
	images?: string[];
}

const drawingBlock =
	/<div class="l-col l-6\/12@tablet single-column">\s*(<img[^>]*class="single-column__img"[^>]*>)\s*<\/div>/g;
const drawingImg = /<img[^>]*class="single-column__img"[^>]*>/;

/** "Eucalyptus_Globulus_Eucalyptus.jpg" -> "Eucalyptus Globulus Eucalyptus". */
export function latinNameFromSrc(src: string): string {
	const file = decodeURIComponent(src.split('/').pop() ?? '');
	return file
		.replace(/\.[a-z]+$/i, '')
		.replace(/_/g, ' ')
		.trim();
}

export function essenceName(title: string): string {
	return title.replace(/\s*[–—-]\s*Von der Natur.*$/i, '').trim();
}

/** Turns a bare drawing into a captioned, framed botanical plate. */
export function wrapBotanicalPlates(html: string, title: string): string {
	if (html.includes('botanical-plate')) return html;
	return html.replace(drawingBlock, (_full, img: string) => {
		const src = img.match(/src="([^"]+)"/)?.[1] ?? '';
		const caption = `<figcaption class="botanical-plate__caption"><span class="botanical-plate__latin">${latinNameFromSrc(src)}</span><span class="botanical-plate__name">${essenceName(title)}</span></figcaption>`;
		return `<figure class="l-col l-6/12@tablet single-column botanical-plate">${img}${caption}</figure>`;
	});
}

const contactFormBlock = /<div class="wpcf7 no-js"[\s\S]*?<\/form>\s*<\/div>/;

/** Removes the WordPress-only form so a working local form can replace it. */
export function extractContactForm(html: string): { html: string; found: boolean } {
	if (!contactFormBlock.test(html)) return { html, found: false };
	return { html: html.replace(contactFormBlock, ''), found: true };
}

const recipeParagraph = /<p>\s*<a[^>]*href="([^"]+\.pdf)"[^>]*>([^<]*)<\/a>\s*<\/p>/i;

/** Removes the bare WordPress PDF link so a real download card can replace it. */
export function extractRecipeLink(html: string): { html: string; recipe: RecipeLink | null } {
	const match = html.match(recipeParagraph);
	const href = match?.[1];
	const label = match?.[2]?.trim();
	if (!href || !label) return { html, recipe: null };
	return {
		html: html.replace(recipeParagraph, ''),
		recipe: { href, label }
	};
}

/** Finds the botanical plate on an essence detail page. */
export function botanicalPlate(page: {
	path: string;
	title: string;
	html: string;
}): BotanicalPlate | null {
	if (!page.path.startsWith('/essenzen/')) return null;
	const img = page.html.match(drawingImg)?.[0];
	const src = img?.match(/src="([^"]+)"/)?.[1];
	if (!src) return null;
	return {
		path: page.path,
		src,
		latin: latinNameFromSrc(src),
		name: essenceName(page.title)
	};
}
