import { cutoutBottle } from '../scripts/bottle-cutout.ts';
const S = '/tmp/claude-1001/-home-bot--t3-projects-organic-distillery/d0f1fa05-e237-420f-bdd4-4d9e050984f8/scratchpad';
await cutoutBottle('static/media/2017/11/Ginn_500ml.jpg', S + '/t-ginn.webp', { scale: 4 });
await cutoutBottle('static/media/2017/11/Ginnie_200ml.jpg', S + '/t-ginnie.webp', { scale: 4 });
await cutoutBottle(S + '/pdf/OD-Essenzen-Zitrus_Mandarine_2019-2.png', S + '/t-mand.webp', { scale: 3 });
await cutoutBottle(S + '/pdf/OD-Essenzen-Herbal_Cistrose_2019-2.png', S + '/t-cist.webp', { scale: 3 });

