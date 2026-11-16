import sharp from 'sharp';
const { data, info } = await sharp('/tmp/claude-1001/-home-bot--t3-projects-organic-distillery/d0f1fa05-e237-420f-bdd4-4d9e050984f8/scratchpad/pdf/OD-Essenzen-Zitrus_Mandarine_2019-2.png').flatten({background:'#fff'}).raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels: c } = info;
const lum = (x:number,y:number)=>{const o=(y*w+x)*c;return Math.round(0.299*data[o]!+0.587*data[o+1]!+0.114*data[o+2]!)};
for (const y of [100,250,300,350,400,420,450,500,600,700,780,800,820,840,850]) {
  const row=[0,1,2,3,5,8,12,20,40,120].map(x=>lum(x,y)); console.log(y,row.join(' '), '| right', [w-1,w-2,w-3,w-5,w-8].map(x=>lum(x,y)).join(' '));
}
