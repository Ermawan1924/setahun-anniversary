const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const G=require('../dist/engine.js');
const configSandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/config.js'),'utf8'),configSandbox);const C=configSandbox.window.ANNIVERSARY;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/config-extra.js'),'utf8'),configSandbox);const X=configSandbox.window.ANNIVERSARY_EXTRA;

test('all seven destinations are reachable from every reachable spawn and quest stop',()=>{
  for(const start of [G.fresh().position,...G.stops])for(const target of G.stops){
    const route=G.path(start,target);let p=start;
    if(start.x!==target.x||start.y!==target.y)assert.ok(route.length,`No route from ${JSON.stringify(start)} to ${target.id}`);
    for(const step of route){assert.ok(G.walkable(step.x,step.y));assert.equal(Math.abs(step.x-p.x)+Math.abs(step.y-p.y),1);p=step;}
    assert.deepEqual({x:p.x,y:p.y},{x:target.x,y:target.y});
  }
});
test('the player cannot walk into water, trees or buildings',()=>{assert.equal(G.walkable(0,0),false);assert.equal(G.walkable(4,5),false);for(const p of G.trees)assert.equal(G.walkable(...p),false);assert.deepEqual(G.path(G.fresh().position,{x:0,y:0}),[]);});
test('original hearts unlock sequentially and three hearts no longer unlock the finale',()=>{
  const s=G.fresh();assert.equal(G.unlocked(s,3),false);assert.equal(G.complete(s,'memory'),false);assert.equal(G.complete(s,'final'),false);
  assert.equal(G.complete(s,'quiz'),true);assert.equal(G.complete(s,'quiz'),false);assert.equal(G.unlocked(s,1),true);assert.equal(G.unlocked(s,2),false);
  assert.equal(G.complete(s,'memory'),true);assert.equal(G.complete(s,'puzzle'),true);assert.equal(G.unlocked(s,3),true);assert.equal(G.unlocked(s,6),false);assert.deepEqual(s.done,['quiz','memory','puzzle']);
});
test('saved progress round trips; malformed and out-of-order saves are repaired',()=>{
  const s=G.fresh();s.started=true;s.done=['quiz','memory','puzzle'];s.position={x:19,y:4};assert.deepEqual(G.restore(JSON.parse(JSON.stringify(s))),s);
  assert.deepEqual(G.restore({version:99}),G.fresh());
  const repaired=G.restore({version:1,done:['memory','puzzle'],position:{x:0,y:0},finished:true});assert.deepEqual(repaired,G.fresh());
  const partial=G.restore({version:1,done:['quiz','quiz','bogus','puzzle'],position:{x:'12',y:12}});assert.deepEqual(partial.done,['quiz']);assert.deepEqual(partial.position,G.fresh().position);
});
test('random puzzles always contain nine unique pieces and assistance solves them',()=>{
  for(let run=0;run<300;run++){let a=G.puzzle();assert.equal(G.solved(a),false);assert.deepEqual([...a].sort(),[0,1,2,3,4,5,6,7,8]);for(let i=0;i<8&&!G.solved(a);i++){const before=a.filter((n,i)=>n===i).length;a=G.assist(a);assert.ok(a.filter((n,i)=>n===i).length>before);}assert.equal(G.solved(a),true);}
});
test('swapping any two pieces is reversible without mutating the original',()=>{const a=G.puzzle(),old=[...a];const b=G.swap(a,0,8);assert.deepEqual(a,old);assert.deepEqual(G.swap(b,0,8),a);});
test('memory deck has exactly two of each card after shuffling',()=>{const deck=G.shuffle(C.memories.flatMap((_,i)=>[i,i]));assert.equal(deck.length,8);for(let i=0;i<C.memories.length;i++)assert.equal(deck.filter(x=>x===i).length,2);});
test('default configuration has playable questions, letters and bundled assets',()=>{
  assert.ok(C.quiz.length>0);assert.equal(C.memories.length,4);
  for(const q of C.quiz){assert.ok(q.question&&q.hint&&q.note);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);assert.equal(new Set(q.options).size,q.options.length);}
  assert.ok(C.letter.paragraphs.length);assert.ok(fs.existsSync(path.join(__dirname,'../dist',C.puzzleImage)));
});
test('asset paths stay local and cannot inject markup or escape the asset folder',()=>{
  assert.equal(G.safeAsset('assets/foto-kita.jpg'),'assets/foto-kita.jpg');assert.equal(G.safeAsset('assets/music.mp3'),'assets/music.mp3');
  for(const bad of ['https://example.com/p.png','javascript:alert(1)','assets/../config.js',"assets/a');alert(1);//",null])assert.equal(G.safeAsset(bad),'');
});

test('legacy finished saves migrate to chapter four while preserving name-independent progress',()=>{
 const s=G.restore({version:1,started:true,done:['quiz','memory','puzzle'],position:{x:19,y:4},finished:true});
 assert.equal(s.version,2);assert.equal(s.finished,false);assert.equal(s.done.length,3);assert.equal(G.unlocked(s,3),true);assert.equal(G.unlocked(s,6),false);assert.deepEqual(s.position,{x:19,y:4});
});
test('a complete six-level journey requires collecting and delivering all items',()=>{
 const s=G.fresh();s.started=true;
 for(const id of ['quiz','memory','puzzle','timeline'])assert.equal(G.complete(s,id),true);
 assert.equal(G.complete(s,'hunt'),false);s.hunt.active=true;
 assert.equal(G.collectTreasure(s,'shell'),false,'cannot collect from afar');
 assert.equal(G.collectTreasure(s,'ticket'),false,'cannot skip clues');
 for(const t of G.treasures){s.position={x:t.x,y:t.y};assert.equal(G.collectTreasure(s,t.id),true);assert.equal(G.collectTreasure(s,t.id),false);}
 assert.equal(G.complete(s,'hunt'),false,'must return to expedition NPC');s.position={x:G.stops[4].x,y:G.stops[4].y};assert.equal(G.complete(s,'hunt'),true);
 assert.equal(G.complete(s,'date'),false);
 for(const t of G.dateStations){s.position={x:t.x,y:t.y};assert.equal(G.collectDateItem(s,t.id),true);assert.equal(G.collectDateItem(s,t.id),false);}
 assert.equal(G.complete(s,'date'),false,'must return to picnic');s.position={x:G.stops[5].x,y:G.stops[5].y};assert.equal(G.complete(s,'date'),true);assert.equal(G.unlocked(s,6),true);assert.equal(G.unlocked(s,7),false);s.finished=true;assert.equal(G.restore(s).finished,true);
});
test('every collectible and errand has a reachable walking route',()=>{
 for(const point of [...G.treasures,...G.dateStations]){assert.ok(G.walkable(point.x,point.y),point.id);assert.ok(G.path(G.fresh().position,point).length,point.id);}
});
test('inventory survives reload and invalid or future inventories are discarded',()=>{
 const s=G.fresh();s.done=['quiz','memory','puzzle','timeline'];s.hunt={active:true,found:['shell'],hinted:['ribbon']};s.mode='challenge';s.useTimer=true;
 const r=G.restore(s);assert.deepEqual(r.hunt,s.hunt);assert.equal(r.mode,'challenge');assert.equal(r.useTimer,true);
 const bad=G.restore({version:2,done:[],dateItems:['flowers'],hunt:{active:true,found:['shell']}});assert.deepEqual(bad.dateItems,[]);assert.equal(bad.hunt.active,false);
 const done=G.restore({version:2,done:G.stops.slice(0,6).map(s=>s.id)});assert.equal(done.dateItems.length,3);assert.equal(done.hunt.found.length,3);
});
test('both 3 by 3 and 4 by 4 puzzles are solvable and never begin completed',()=>{
 for(const size of [3,4])for(let n=0;n<100;n++){let a=G.puzzle(size);assert.equal(a.length,size*size);assert.equal(new Set(a).size,size*size);assert.equal(G.solved(a),false);for(let i=0;i<size*size&&!G.solved(a);i++)a=G.assist(a);assert.equal(G.solved(a),true);}
});
test('timeline swaps can restore the original order without losing entries',()=>{
 let order=G.shuffle(C.memories.map((_,i)=>i));for(let i=0;i<order.length;i++)order=G.assist(order);assert.equal(G.solved(order),true);assert.equal(new Set(order).size,C.memories.length);
});
test('challenge and relaxed modes have different puzzle, deck and hint budgets',()=>{
 assert.equal(G.rules('relaxed').size,3);assert.equal(G.rules('challenge').size,4);assert.equal(G.rules('challenge').pairs,6);assert.equal(G.rules('relaxed').pairs,4);assert.equal(G.rules('challenge').hints,2);assert.equal(G.rules('challenge').timelineHints,1);
 assert.ok(C.memories.length+X.bonusMemoryCards.length>=6);
});
test('recipe accepts the exact ingredients in any order and rejects extras or duplicates',()=>{
 const expected=['roti','keju','tomat'];assert.equal(G.sameSet(['tomat','roti','keju'],expected),true);assert.equal(G.sameSet(['roti','roti','tomat'],expected),false);assert.equal(G.sameSet([...expected,'kopi'],expected),false);
});
test('extra content has valid IDs, solvable flower recipes and a numeric gift code',()=>{
 for(const t of G.treasures)assert.ok(X.treasures[t.id].clue&&X.treasures[t.id].hint);
 const f=X.date.flowers,ids=f.options.map(o=>o.id);for(const id of [...f.sequence,f.challengeExtra])assert.ok(ids.includes(id));
 const food=X.date.food;for(const id of food.ingredients)assert.ok(food.options.some(o=>o.id===id));assert.equal(new Set(food.ingredients).size,food.ingredients.length);
 assert.match(X.date.gift.code,/^\d+$/);assert.equal(X.date.gift.code.length,X.date.gift.clues.length);
});
