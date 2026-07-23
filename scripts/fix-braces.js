const fs=require('fs');
let b=fs.readFileSync('scripts/add-questions-rla-ss.ts','utf8');
let lines=b.split('\n');
let c=0;
for(let i=lines.length-1;i>=0;i--){
  if(lines[i].trim()===']},'){
    lines[i]=lines[i].replace(/}/,'    ]');
    c++;
  }
}
fs.writeFileSync('scripts/add-questions-rla-ss.ts',lines.join('\n'));
console.log('Fixed',c,'extra closing braces');