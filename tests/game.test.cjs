const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const G=require('../dist/engine.js');
const configSandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/config.js'),'utf8'),configSandbox);const C=configSandbox.window.ANNIVERSARY;

test('all four destinations are reachable from every reachable spawn and quest stop',()=>{
  for(const start of [G.fresh().position,...G.stops])for(const target of G.stops){
    const route=G.path(start,target);let p=start;
    if(start.x!==target.x||start.y!==target.y)assert.ok(route.length,`No route from ${JSON.stringify(start)} to ${target.id}`);
    for(const step of route){assert.ok(G.walkable(step.x,step.y));assert.equal(Math.abs(step.x-p.x)+Math.abs(step.y-p.y),1);p=step;}
    assert.deepEqual({x:p.x,y:p.y},{x:target.x,y:target.y});
  }
});
test('the player cannot walk into water, trees or buildings',()=>{assert.equal(G.walkable(0,0),false);assert.equal(G.walkable(4,5),false);for(const p of G.trees)assert.equal(G.walkable(...p),false);assert.deepEqual(G.path(G.fresh().position,{x:0,y:0}),[]);});
test('three hearts unlock sequentially and replays cannot duplicate rewards',()=>{
  const s=G.fresh();assert.equal(G.unlocked(s,3),false);assert.equal(G.complete(s,'memory'),false);assert.equal(G.complete(s,'final'),false);
  assert.equal(G.complete(s,'quiz'),true);assert.equal(G.complete(s,'quiz'),false);assert.equal(G.unlocked(s,1),true);assert.equal(G.unlocked(s,2),false);
  assert.equal(G.complete(s,'memory'),true);assert.equal(G.complete(s,'puzzle'),true);assert.equal(G.unlocked(s,3),true);assert.deepEqual(s.done,['quiz','memory','puzzle']);
});
test('saved progress round trips; malformed and out-of-order saves are repaired',()=>{
  const s=G.fresh();s.started=true;s.done=['quiz','memory','puzzle'];s.position={x:19,y:4};s.finished=true;assert.deepEqual(G.restore(JSON.parse(JSON.stringify(s))),s);
  assert.deepEqual(G.restore({version:2}),G.fresh());
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
