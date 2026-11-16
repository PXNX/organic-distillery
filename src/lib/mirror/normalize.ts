export const SITE_ORIGIN = 'https://www.organic-distillery.com';

const internalHost = /(^|\.)organic-distillery\.com$/;

/** Returns a local root-relative path for an internal URL, or null for external links. */
export function localPath(href: string, origin: string = SITE_ORIGIN): string | null {
	try {
		const url = new URL(href, origin);
		if (!internalHost.test(url.hostname)) return null;
		let path = decodeURIComponent(url.pathname);
		if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
		return path || '/';
	} catch {
		return null;
	}
}

/** Rewrites absolute site URLs to local paths and trims padded attribute values. */
export function rewriteHtml(html: string): string {
	return html
		.replace(/https?:\/\/(?:www\.)?organic-distillery\.com\/media\//g, '/media/')
		.replace(/https?:\/\/(?:www\.)?organic-distillery\.com/g, '')
		.replace(/(href|src|action|content)="([^"]*?)\s+"/g, '$1="$2"');
}

/** Keeps the first image eager for a fast paint and lazy-loads the rest. */
export function addImageHints(html: string): string {
	let first = true;
	return html.replace(/<img\b[^>]*>/g, (tag) => {
		const cleaned = tag.replace(/\s+(?:loading|decoding|fetchpriority)="[^"]*"/g, '');
		const hints = first
			? ' decoding="async" fetchpriority="high"'
			: ' loading="lazy" decoding="async"';
		first = false;
		return cleaned.replace(/^<img/, `<img${hints}`);
	});
}

/** Filesystem directory of the SvelteKit route for a mirrored path. */
export function routeDir(path: string): string {
	return `src/routes${path === '/' ? '' : path}`;
}

/** Generated route component source for a mirrored path. */
export function routeSource(path: string): string {
	return `<script lang="ts">\n\timport MirroredPage from '#lib/components/MirroredPage.svelte';\n</script>\n\n<MirroredPage path="${path}" />\n`;
}
