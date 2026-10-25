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
let state, clock, spawnClock;
function stopClocks(){clearInterval(clock);clearInterval(spawnClock);}
function message(text){$('feedback').textContent=text;}
function update(){
 $('walk').textContent=state.walk===0?'0 hrs':state.walk/60+' hrs';
 $('day').textContent=state.day+' / 10';
 $('score').textContent=state.score+' items';
 $('timer').textContent=state.seconds+'s';
 $('returned').textContent=(180-state.walk)+' minutes';
 $('progress').value=180-state.walk;
 $('shop').replaceChildren();
 upgrades.forEach((u,i)=>{
  const box=document.createElement('div');box.className='upgrade';
  const name=document.createElement('strong');name.textContent=u.icon+' '+u.name;
  const detail=document.createElement('small');detail.textContent='Walk becomes '+u.walk/60+' hrs / day';
  const buy=document.createElement('button');
  buy.textContent=i<state.level?'Built ✓':'Build · '+u.cost+' items';
  buy.disabled=i!==state.level||state.over;
  buy.addEventListener('click',()=>buyUpgrade(i));
  box.append(name,detail,buy);$('shop').append(box);
 });
}
function begin(){
 stopClocks();$('confetti').replaceChildren();
 state={day:1,score:0,walk:180,level:0,seconds:20,active:false,over:false};
 $('home').hidden=true;$('ending').hidden=true;$('game').hidden=false;
 startDay();
}
function startDay(){
 stopClocks();state.active=true;state.seconds=20;
 $('items').replaceChildren();$('next').disabled=true;$('phase').textContent='Day in progress';
 message('Collect supplies. Avoid the brown puddles!');update();
 $('obi').style.bottom='5px';
 // Six supplies per batch; shuffled positions prevent overlap.
 spawnBatch();
 const deadline=Date.now()+20000;
 clock=setInterval(()=>{
  state.seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));
  $('timer').textContent=state.seconds+'s';
  $('obi').style.bottom=(5+(20-state.seconds)*14)+'px';
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
  button.textContent=type[0];button.setAttribute('aria-label',type[1]+(bad?' minus 2 items':' plus 1 item'));
  const slot=spots[i];button.style.left=(10+(slot%3)*31)+'%';button.style.top=(210+Math.floor(slot/3)*70)+'px';
  button.addEventListener('click',()=>{
   if(!state.active||state.over||!button.isConnected)return;
   button.remove();
   const old=state.score;state.score=Math.max(0,state.score+(bad?-2:1));
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
 if(state.day===10){finish(false);return;}
 message('Day complete! Visit the shop, then start the next day.');
 $('next').disabled=false;
}
function buyUpgrade(i){
 if(state.over||i!==state.level)return;
 const u=upgrades[i];
 if(state.score<u.cost){message('Not enough items! Collect '+(u.cost-state.score)+' more for '+u.name+'.');return;}
 state.score-=u.cost;state.walk=u.walk;state.level++;update();
 message(u.name+' built! '+(180-state.walk)+' minutes returned each day.');
 if(state.level===upgrades.length)finish(true);
}
function finish(won){
 stopClocks();state.active=false;state.over=true;$('items').replaceChildren();
 $('game').hidden=true;$('ending').hidden=false;$('perk').hidden=!won;
 $('endLabel').textContent=won?'TIME RETURNED. FUTURE OPEN.':'THE JOURNEY IS NOT OVER';
 $('endArt').textContent=won?'🚶🏾 → 🏫':'🪣';
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
$('next').addEventListener('click',()=>{if(state.active||state.over)return;state.day++;startDay();});
$('help').addEventListener('click',()=>{const p=$('instructions');p.hidden=!p.hidden;$('help').setAttribute('aria-expanded',String(!p.hidden));});

