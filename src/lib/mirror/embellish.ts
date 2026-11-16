export interface BotanicalPlate {
	path: string;
	src: string;
	latin: string;
	name: string;
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
