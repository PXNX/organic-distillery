import { site } from '../src/lib/content/index.ts';
import { productPage } from '../src/lib/content/product-page.ts';
for (const p of site.pages) { const r = productPage(p); if (r && ['/essenzen/mandarine-geist','/gins/ginnie-2','/essenzen/137-2'].includes(p.path)) console.log(JSON.stringify(r, null, 1)); }
