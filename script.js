'use strict';
// A single state object is reset on every new game.
const $ = id => document.getElementById(id);
const upgrades = [
 {name:'Rain barrel',cost:8,walk:120,icon:'🌧️'},
 {name:'Water filter',cost:12,walk:60,icon:'💧'},
 {name:'Community well',cost:20,walk:0,icon:'🪣'}
];
const facts = [
 'Clean water closer to home means more time for school, work, and family.',
 'charity: water is a nonprofit working to bring clean and safe water to people around the world.',
 'Local water access can reduce the time spent collecting water.',
 'This game uses symbolic supplies. Real water projects depend on local needs and community partnerships.'
];
// Coordinates use the same 800 x 760 space as landscape.svg.
const walkRoute = [[281.0,730,0],[279.79,725,5.15],[278.95,720,10.22],[278.5,715,15.24],[278.43,710,20.24],[278.75,705,25.25],[279.47,700,30.3],[280.59,695,35.42],[282.1,690,40.65],[284.02,685,46.0],[286.34,680,51.51],[289.05,675,57.2],[292.17,670,63.09],[295.67,665,69.2],[299.56,660,75.53],[303.83,655,82.11],[308.48,650,88.94],[313.48,645,96.01],[318.83,640,103.33],[324.51,635,110.89],[330.51,630,118.7],[336.81,625,126.74],[343.38,620,135.0],[350.22,615,143.48],[357.29,610,152.13],[364.57,605,160.96],[372.02,600,169.94],[379.63,595,179.05],[387.36,590,188.25],[395.17,585,197.52],[403.01,580,206.82],[410.85,575,216.12],[418.63,570,225.37],[426.11,565,234.36],[433.12,560,242.97],[439.55,555,251.12],[445.26,550,258.71],[450.08,545,265.65],[453.76,540,271.86],[455.94,535,277.31],[456.5,530,282.35],[455.44,525,287.46],[452.76,520,293.13],[448.51,515,299.69],[442.77,510,307.3],[435.7,505,315.96],[427.47,500,325.6],[418.32,495,336.02],[408.54,490,347.01],[398.41,485,358.3],[388.24,480,369.63],[378.29,475,380.77],[368.78,470,391.51],[359.89,465,401.71],[351.73,460,411.28],[344.4,455,420.16],[337.92,450,428.34],[332.32,445,435.85],[327.6,440,442.72],[323.93,435,448.92],[321.47,430,454.5],[320.17,425,459.66],[319.98,420,464.67],[320.86,415,469.74],[322.73,410,475.08],[325.53,405,480.81],[329.05,400,486.93],[333.24,395,493.45],[338.06,390,500.39],[343.47,385,507.76],[349.45,380,515.56],[355.97,375,523.78],[362.99,370,532.4],[370.47,365,541.4],[378.37,360,550.75],[386.62,355,560.4],[395.14,350,570.28]];
function moveObi(progress){
 const p=Math.max(0,Math.min(1,progress));
 const target=p*walkRoute[walkRoute.length-1][2];
 let i=1;
 while(i<walkRoute.length-1 && walkRoute[i][2]<target)i++;
 const a=walkRoute[i-1], b=walkRoute[i];
 const ratio=(target-a[2])/(b[2]-a[2] || 1);
 const x=a[0]+(b[0]-a[0])*ratio, y=a[1]+(b[1]-a[1])*ratio;
 $('obi').style.left=(x/800*100)+'%';
 $('obi').style.top=(y/760*100)+'%';
 $('obi').style.transform='translate(-50%,-100%) scale('+(1-p*.22)+')';
 $('obi').setAttribute('data-walk-progress',p.toFixed(3));
}
let state, clock, spawnClock;
function stopClocks(){clearInterval(clock);clearInterval(spawnClock);}
function message(text){$('feedback').textContent=text;}
function update(){
 $('walk').textContent=state.walk===0?'0 hrs':state.walk/60+(state.walk===60?' hr':' hrs');
 $('day').textContent=state.day+' / 10';
 $('score').textContent=state.score+' items';
 $('timer').textContent=state.seconds+'s';
 $('returned').textContent=(180-state.walk)+' minutes';
 $('progress').value=180-state.walk; $('progress').setAttribute('aria-valuenow',String(180-state.walk)); $('progress').setAttribute('aria-valuetext',(180-state.walk)+' minutes returned');
 $('shop').replaceChildren();
 upgrades.forEach((u,i)=>{
  const box=document.createElement('div');box.className='upgrade';
  box.className='upgrade'+(i<state.level?' built':i===state.level&&state.score>=u.cost?' available':''); const icon=document.createElement('span');icon.className='upgrade-icon';icon.innerHTML='<img src="img/'+(['barrel','drop','well'][i])+'.svg" alt="">'; const name=document.createElement('strong');name.textContent=u.name;
  const detail=document.createElement('small');detail.textContent=u.walk===0?'No more water walk':u.walk/60+' hour'+(u.walk===60?'':'s')+' water walk';
  const buy=document.createElement('button');
  buy.textContent=i<state.level?'Built ✓':'Build · '+u.cost+' items';
  buy.disabled=i!==state.level||state.over;
  buy.addEventListener('click',()=>buyUpgrade(i));
  box.append(icon,name,detail,buy);$('shop').append(box);
 });
}
function begin(){
 stopClocks(); if($('daySummary').open)$('daySummary').close(); $('confetti').replaceChildren();
 state={day:1,score:0,walk:180,level:0,seconds:20,active:false,over:false};
 $('home').hidden=true;$('ending').hidden=true;$('game').hidden=false;
 startDay();
}
function startDay(){
 stopClocks();state.active=true;state.seconds=20; state.found={rope:0,coin:0,drop:0}; state.mudLost=0; state.spent=0;
 $('items').replaceChildren();$('next').disabled=true;$('phase').textContent='Day in progress';
 message('Collect supplies. Avoid the brown puddles!');update();
 $('obi').classList.remove('walking'); moveObi(0); $('obi').getBoundingClientRect(); $('obi').classList.add('walking');
 // Six supplies per batch; shuffled positions prevent overlap.
 spawnBatch();
 const deadline=Date.now()+20000;
 clock=setInterval(()=>{
  state.seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));
  $('timer').textContent=state.seconds+'s';
  moveObi(1-Math.max(0,deadline-Date.now())/20000);
  if(state.seconds===0)endDay();
 },200);
 spawnClock=setInterval(spawnBatch,3500);
}
function spawnBatch(){
 if(!state.active||state.over)return;
 $('items').replaceChildren();
 const spots=[0,1,2,3,4,5,6,7,8].sort(()=>Math.random()-.5);
 for(let i=0;i<7;i++){
  const bad=i===6, types=[['🪢','Rope'],['🪙','Coin'],['💧','Clean water']];
  const type=bad?['🟤','Mud puddle']:types[Math.floor(Math.random()*types.length)];
  const button=document.createElement('button');
  button.className='item'+(bad?' mud':'');
  const asset=bad?'mud':type[1]==='Rope'?'rope':type[1]==='Coin'?'coin':'drop'; button.innerHTML='<img src="img/'+asset+'.svg" alt="">';button.setAttribute('aria-label',type[1]+(bad?' minus 2 items':' plus 1 item'));
  const slot=spots[i];button.style.left=(24+(slot%3)*25)+'%';button.style.top=(40+Math.floor(slot/3)*17)+'%';
  button.addEventListener('click',()=>{
   if(!state.active||state.over||!button.isConnected)return;
   button.remove();
   const old=state.score;state.score=Math.max(0,state.score+(bad?-2:1));
   if(bad)state.mudLost+=old-state.score; else state.found[asset]++;
   message(bad?'Muddy puddle! −'+(old-state.score)+' items. Keep going.':'+1 '+type[1]+'!');
   update();
  });
  $('items').append(button);
 }
}
function endDay(){
 if(!state.active)return;
 stopClocks();state.active=false;$('items').replaceChildren();
 $('phase').textContent='Day complete';$('fact').textContent=facts[(state.day-1)%facts.length];
 state.seconds=0; $('timer').textContent='0s'; moveObi(1); $('obi').classList.remove('walking');
 message('Obi reached the well! Review your day, then visit the shop.');
 $('next').disabled=true;
 showDaySummary();
}
function buyUpgrade(i){
 if(state.over||i!==state.level)return;
 const u=upgrades[i];
 if(state.score<u.cost){message('Not enough items! Collect '+(u.cost-state.score)+' more for '+u.name+'.');return;}
 state.score-=u.cost;state.spent+=u.cost;state.walk=u.walk;state.level++;update();
 message(u.name+' built! '+(180-state.walk)+' minutes returned each day.');
 if(state.level===upgrades.length)finish(true);
}
function finish(won){
 stopClocks();state.active=false;state.over=true; $('obi').classList.remove('walking'); if($('daySummary').open)$('daySummary').close(); $('items').replaceChildren();
 $('game').hidden=true;$('ending').hidden=false;$('perk').hidden=!won;
 $('endLabel').textContent=won?'TIME RETURNED. FUTURE OPEN.':'THE JOURNEY IS NOT OVER';
 $('endArt').innerHTML=won?'<img src="img/obi.svg" alt=""><span>→</span><span>🏫</span>':'<img src="img/well.svg" alt="">';
 $('endTitle').textContent=won?'Obi is off to school!':"Time's up! Try again.";
 $('endText').textContent=won?'You built the well on day '+state.day+' and returned 3 hours of Obi’s day. Clean water opens up time for learning and possibility.':'Day 10 has ended without a well. Collect more supplies, avoid muddy puddles, and build upgrades in order on your next journey.';
 $('endTitle').focus();
 if(won)celebrate();
}
function celebrate(){
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced)return;
 for(let i=0;i<70;i++){
  const piece=document.createElement('span');piece.className='confetto';
  piece.style.left=Math.random()*100+'%';
  piece.style.background=['#ffc907','#2e9aab','#173c42','#f89a67'][i%4];
  piece.style.animationDelay=Math.random()*.8+'s';
  piece.addEventListener('animationend',()=>piece.remove());$('confetti').append(piece);
 }
}
$('start').addEventListener('click',begin);
$('reset').addEventListener('click',begin);
$('again').addEventListener('click',begin);
$('next').addEventListener('click',()=>{if(state.active||state.over||$('daySummary').open)return;state.day++;startDay();});
$('help').addEventListener('click',()=>{const p=$('instructions');p.hidden=!p.hidden;$('help').setAttribute('aria-expanded',String(!p.hidden));});


function showDaySummary(){
 const count=state.found.rope+state.found.coin+state.found.drop;
 $('summaryDay').textContent='DAY '+state.day+' / 10 COMPLETE';
 $('summaryCopy').textContent=count===0
  ? 'You reached the well, even without finding supplies. Every new day is another chance.'
  : 'Another walk complete. Here is what happened on today’s journey.';
 $('foundRope').textContent=state.found.rope;
 $('foundCoin').textContent=state.found.coin;
 $('foundWater').textContent=state.found.drop;
 $('summaryFound').textContent='+'+count;
 $('summaryLost').textContent='−'+state.mudLost;
 $('summarySpent').textContent='−'+state.spent;
 $('summaryBalance').textContent=state.score;
 $('summaryReturned').textContent=(180-state.walk)+' minutes returned each day';
 $('summaryContinue').textContent=state.day===10?'See results →':'Visit upgrade shop →';
 $('daySummary').showModal();
 $('summaryTitle').focus({preventScroll:true}); $('daySummary').scrollTop=0;
}
$('summaryContinue').addEventListener('click',()=> $('daySummary').close());
$('daySummary').addEventListener('close',()=>{
 if(!state || state.active || state.over)return;
 if(state.day===10){finish(false);return;}
 $('next').disabled=false;
 message('Day complete! Spend supplies in the shop, then start the next day.');
 $('next').focus();
});

