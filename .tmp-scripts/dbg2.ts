import sharp from 'sharp';
const { data, info } = await sharp('/tmp/claude-1001/-home-bot--t3-projects-organic-distillery/d0f1fa05-e237-420f-bdd4-4d9e050984f8/scratchpad/pdf/OD-Essenzen-Zitrus_Mandarine_2019-2.png').flatten({background:'#fff'}).raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels: c } = info;
const lum = (x:number,y:number)=>{const o=(y*w+x)*c;return 0.299*data[o]!+0.587*data[o+1]!+0.114*data[o+2]!};
const sat = (x:number,y:number)=>{const o=(y*w+x)*c;return Math.max(data[o]!,data[o+1]!,data[o+2]!)-Math.min(data[o]!,data[o+1]!,data[o+2]!)};
let out='';
for (let y=380;y<855;y+=10){let l=-1,r=-1,d=0;for(let x=0;x<w;x++){const L=lum(x,y),S=sat(x,y);if((L<160&&S<95)||(S>=22&&L<238)){if(l<0)l=x;r=x}} if(l>=0)for(let x=l;x<=r;x++)if(lum(x,y)<120)d++; out+=y+':'+l+'-'+r+' d'+(l>=0?(d/(r-l)).toFixed(2):'-')+' e'+(l>=0?Math.round(lum(l+1,y)):'')+'  ';}
console.log(out);
