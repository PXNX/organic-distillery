/** Reads the mirrored recipe PDFs into site.json so their content can be shown inline. */
import { PDFParse } from 'pdf-parse';

const SITE_JSON = 'src/lib/content/site.json';

const clean = (text: string): string =>
	text
		.replace(/(\w)-\n(\w)/g, '$1$2')
		.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '')
		.replace(/www\.organic-distillery\.com[^\n]*/g, '')
		.replace(/Weitere Inspirationen, Informationen und Bestellungen:/g, '')
		.replace(/[ \t]+/g, ' ')
		.replace(/\n+/g, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();

const site = await Bun.file(SITE_JSON).json();
let count = 0;

for (const page of site.pages) {
	const recipe = page.recipe;
	if (!recipe?.href) continue;
	const path = `static${decodeURIComponent(recipe.href)}`;
	if (!(await Bun.file(path).exists())) {
		console.error('missing', path);
		continue;
	}
	const parser = new PDFParse(new Uint8Array(await Bun.file(path).arrayBuffer()));
	const { text } = await parser.getText();
	await parser.destroy();
	recipe.text = clean(text);
	count++;
	console.log(`extracted ${page.path} (${recipe.text.length} chars)`);
}

await Bun.write(SITE_JSON, JSON.stringify(site, null, 2) + '\n');
console.log(`\nExtracted ${count} recipes.`);
