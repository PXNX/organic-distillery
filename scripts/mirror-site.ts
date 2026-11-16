/**
 * Mirrors organic-distillery.com into this repo: crawls every HTML page,
 * downloads its images, PDFs, fonts and the theme's CSS/JS, then generates
 * one SvelteKit route per page.
 *
 * Run with `bun run mirror` (needs network access).
 */
import * as cheerio from 'cheerio';

const ROOT = 'https://www.organic-distillery.com';
const OUT = 'src/lib/content/site.json';
const ROUTES = 'src/routes';

type Page = { path: string; title: string; description: string; html: string };
type Site = {
	pages: Page[];
	header: string;
	footer: string;
	ageCheck: string;
	order: string;
};

function localPath(href: string): string | null {
	try {
		const url = new URL(href, ROOT);
		if (!/(^|\.)organic-distillery\.com$/.test(url.hostname)) return null;
		let path = decodeURIComponent(url.pathname);
		if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
		return path || '/';
	} catch {
		return null;
	}
}

function rewrite(html: string): string {
	return html
		.replace(/https?:\/\/(?:www\.)?organic-distillery\.com\/media\//g, '/media/')
		.replace(/https?:\/\/(?:www\.)?organic-distillery\.com/g, '')
		.replace(/(href|src|action|content)="([^"]*?)\s+"/g, '$1="$2"');
}

const downloadFile = async (url: string, file: string) => {
	const target = `static/${file}`;
	if (await Bun.file(target).exists()) return;
	const res = await fetch(url.startsWith('http') ? url : ROOT + url);
	if (!res.ok) throw new Error(`${res.status} ${url}`);
	await Bun.write(target, await res.arrayBuffer());
};

const seen = new Set<string>();
const queue: string[] = ['/'];
const pages: Page[] = [];
const assetPaths = new Set<string>();
let header = '';
let footer = '';
let ageCheck = '';
let order = '';

while (queue.length) {
	const path = queue.shift()!;
	if (seen.has(path)) continue;
	seen.add(path);

	// Media files are downloaded separately, not rendered as pages.
	if (path.startsWith('/media/') || path.endsWith('.pdf')) {
		assetPaths.add(path);
		continue;
	}

	const res = await fetch(ROOT + path);
	if (!res.ok) {
		console.error('SKIP', res.status, path);
		continue;
	}
	const $ = cheerio.load(await res.text());
	const title = $('title').text().trim().replace(/\s+/g, ' ');
	const description = $('meta[name="description"]').attr('content')?.trim() || '';

	if (path === '/') {
		header = rewrite($('.site-head').first().html() || '');
		footer = rewrite($('.site-footer').first().html() || '');
		ageCheck = rewrite($('.o-age-check').first().html() || '');
		order = rewrite($('.o-order').first().html() || '');
	}

	const content = $('.js-site').first().clone();
	content.find('.site-head, .site-footer').remove();
	const html = rewrite(content.html() || '');

	pages.push({ path, title, description, html });

	$('a[href]').each((_, el) => {
		const next = localPath($(el).attr('href')!);
		if (next && !seen.has(next) && !queue.includes(next)) queue.push(next);
	});

	for (const url of [
		...$('img')
			.map((_, el) => $(el).attr('src') || $(el).attr('data-src') || '')
			.get(),
		...$('img')
			.map((_, el) => $(el).attr('srcset')?.split(',')[0]?.trim().split(' ')[0] || '')
			.get()
	]) {
		const asset = localPath(url);
		if (asset && asset.startsWith('/media/')) assetPaths.add(asset);
	}
	for (const m of html.matchAll(/url\((['"]?)(\/media\/[^'")]+)\1\)/g)) assetPaths.add(m[2]);

	console.log(`crawled ${path} (${title})`);
}

// Vendor files whose relative font URLs are served from /fonts.
const vendor: Array<[string, string]> = [
	['/content/themes/ginnie/static/styles/styles.min.css', 'vendor/styles.min.css'],
	['/wp/wp-includes/css/dist/block-library/style.min.css', 'vendor/block-library.min.css'],
	['/content/plugins/contact-form-7/includes/css/styles.css', 'vendor/cf7.min.css'],
	['/content/themes/ginnie/static/js/app.min.js', 'vendor/app.min.js']
];
for (const [url, file] of vendor) await downloadFile(url, file);

const fontCss = await Bun.file('static/vendor/styles.min.css').text();
for (const m of fontCss.matchAll(/url\(\.\.\/fonts\/([^?'")]+)[^)]*\)/g)) {
	await downloadFile(`/content/themes/ginnie/static/fonts/${m[1]}`, `fonts/${m[1]}`);
}

for (const path of assetPaths) {
	await downloadFile(path, path.replace(/^\//, ''));
}

pages.sort((a, b) => a.path.localeCompare(b.path));
await Bun.write(
	OUT,
	JSON.stringify({ pages, header, footer, ageCheck, order } satisfies Site, null, 2)
);

for (const page of pages) {
	const dir = `${ROUTES}${page.path === '/' ? '' : page.path}`;
	await Bun.write(
		`${dir}/+page.svelte`,
		`<script lang="ts">\n\timport MirroredPage from '#lib/components/MirroredPage.svelte';\n</script>\n\n<MirroredPage path="${page.path}" />\n`
	);
}

console.log(`\nMirrored ${pages.length} pages and ${assetPaths.size} media files.`);
