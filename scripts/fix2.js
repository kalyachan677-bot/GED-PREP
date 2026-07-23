const fs=require('fs');
let b=fs.readFileSync(process.argv[2],'utf8');
let lines=b.split('\n');
let c=0;
for(let i=0;i<lines.length;i++){
  if(lines[i].includes('],    ]')){
    lines[i]=lines[i].replace('],    ]','],');
    c++;
  }
}
fs.writeFileSync(process.argv[2],lines.join('\n'));
console.log('Fixed',c);