(function (root) {
  'use strict';
  const rows = [null, null, [12,20], [9,22], [5,22], [3,22], [3,21], [2,21], [3,21], [3,20], [5,19], [7,18], [10,16], [11,14], null];
  const trees = [[4,7],[3,8],[5,9],[7,10],[8,4],[9,4],[10,3],[14,2],[15,3],[18,3],[21,5],[20,7],[19,9],[16,10],[10,11],[13,11],[15,12],[7,5],[8,8],[10,8],[16,5],[18,6]];
  const solids = new Set(trees.map(p=>p.join(',')));
  [[4,5],[5,5],[6,5],[4,6],[5,6],[6,6],[12,2],[13,2],[20,2],[20,3],[21,2],[21,3]].forEach(p=>solids.add(p.join(',')));
  const stops = [
    { id: 'quiz', x:6, y:8, title:'Awal cerita', sub:'Tebak-tebakan', icon:'☕', label:'Pondok Cerita', intro:'Penjaga pondok menyimpan kepingan hati pertama. Jawab semua teka-teki kecil untuk mendapatkannya.' },
    { id:'memory', x:17, y:7, title:'Jejak kenangan', sub:'Kartu & kenangan', icon:'✿', label:'Taman Kenangan', intro:'Kenangan baik selalu punya pasangannya. Cocokkan semua kartu, lalu buka album kecil kita.' },
    { id:'puzzle', x:12, y:4, title:'Kepingan kita', sub:'Puzzle gambar', icon:'▧', label:'Bukit Harapan', intro:'Kadang, kita hanya perlu merapikan kepingan kecil untuk melihat gambaran yang utuh.' },
    { id:'timeline', x:9, y:7, title:'Urutan cerita', sub:'Timeline kenangan', icon:'◷', label:'Telaga Waktu', intro:'Angin mengacak halaman album kita. Susun kenangan dari yang paling awal sampai yang terbaru.' },
    { id:'hunt', x:18, y:10, title:'Berburu hadiah', sub:'Petunjuk & eksplorasi', icon:'⌖', label:'Pos Penjelajah', intro:'Tiga benda tersembunyi di pulau. Baca petunjuk penjaga, temukan bendanya, lalu kembali ke sini.' },
    { id:'date', x:14, y:10, title:'Kencan untuk kita', sub:'Bunga, bekal & hadiah', icon:'❀', label:'Kebun Senja', intro:'Kencan kecil kita hampir siap. Kunjungi tiga penjaga untuk merangkai buket, menyiapkan bekal, dan membuka kotak hadiah.' },
    { id:'final', x:19, y:4, title:'Surat di ujung pulau', label:'Mercusuar Kita' }
  ];
  const LEVELS=stops.length-1;
  const treasures=[{id:'shell',x:3,y:9},{id:'ribbon',x:13,y:4},{id:'ticket',x:17,y:8}];
  const dateStations=[{id:'flowers',x:16,y:8,label:'Perangkai Bunga',icon:'✿'},{id:'food',x:7,y:7,label:'Dapur Bekal',icon:'♨'},{id:'gift',x:13,y:6,label:'Kotak Hadiah',icon:'◇'}];
  const rules=mode=>mode==='challenge'?{size:4,pairs:6,hints:2,timelineHints:1}:{size:3,pairs:4,hints:Infinity,timelineHints:Infinity};
  function land(x,y){return !!rows[y] && x>=rows[y][0] && x<=rows[y][1];}
  function walkable(x,y){return Number.isInteger(x)&&Number.isInteger(y)&&land(x,y)&&!solids.has(x+','+y);}
  function path(start,end){
    if(!walkable(start.x,start.y)||!walkable(end.x,end.y))return [];
    const queue=[start], seen=new Map([[start.x+','+start.y,null]]);let i=0;
    while(i<queue.length){const p=queue[i++];if(p.x===end.x&&p.y===end.y){const out=[];let key=p.x+','+p.y;while(seen.get(key)!==null){const [x,y]=key.split(',').map(Number);out.unshift({x,y});key=seen.get(key);}return out;}
      for(const [dx,dy]of [[0,1],[1,0],[0,-1],[-1,0]]){const x=p.x+dx,y=p.y+dy,key=x+','+y;if(walkable(x,y)&&!seen.has(key)){seen.set(key,p.x+','+p.y);queue.push({x,y});}}
    }return [];
  }
  function shuffle(list,rng=Math.random){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function puzzle(size=3,rng=Math.random){if(typeof size==='function'){rng=size;size=3;}const a=shuffle(Array.from({length:size*size},(_,i)=>i),rng);if(solved(a))[a[0],a[1]]=[a[1],a[0]];return a;}
  function solved(a){return a.length>0&&a.every((n,i)=>n===i);}
  function swap(a,i,j){const out=[...a];[out[i],out[j]]=[out[j],out[i]];return out;}
  function assist(a){const i=a.findIndex((n,i)=>n!==i);return i<0?[...a]:swap(a,i,a.indexOf(i));}
  function fresh(){return {version:2,started:false,done:[],position:{x:12,y:12},finished:false,mode:'relaxed',useTimer:false,hunt:{active:false,found:[],hinted:[]},dateItems:[]};}
  function restore(raw){
    const s=fresh();if(!raw||![1,2].includes(raw.version))return s;
    s.started=raw.started===true;
    for(const {id} of stops.slice(0,LEVELS)){if(Array.isArray(raw.done)&&raw.done.includes(id))s.done.push(id);else break;}
    if(raw.position&&walkable(raw.position.x,raw.position.y))s.position={x:raw.position.x,y:raw.position.y};
    s.finished=raw.finished===true&&s.done.length===LEVELS;
    s.mode=raw.mode==='challenge'?'challenge':'relaxed';s.useTimer=raw.useTimer===true;
    if(s.done.length>=4){s.hunt.active=raw.hunt?.active===true;for(const t of treasures){if(Array.isArray(raw.hunt?.found)&&raw.hunt.found.includes(t.id))s.hunt.found.push(t.id);else break;}s.hunt.hinted=treasures.filter(t=>raw.hunt?.hinted?.includes?.(t.id)).map(t=>t.id);}
    if(s.done.includes('hunt'))s.hunt={active:false,found:treasures.map(t=>t.id),hinted:[]};
    if(s.done.length>=5)s.dateItems=dateStations.filter(t=>Array.isArray(raw.dateItems)&&raw.dateItems.includes(t.id)).map(t=>t.id);
    if(s.done.includes('date'))s.dateItems=dateStations.map(t=>t.id);
    if(s.done.length)s.started=true;return s;
  }
  function unlocked(state,index){return Number.isInteger(index)&&index>=0&&index<=LEVELS&&index<=state.done.length;}
  function near(state,p){return Math.abs(state.position.x-p.x)+Math.abs(state.position.y-p.y)<=1;}
  function currentTreasure(state){return state.hunt.active&&!state.done.includes('hunt')?treasures.find(t=>!state.hunt.found.includes(t.id)):null;}
  function collectTreasure(state,id){const t=currentTreasure(state);if(state.done.length<4||!t||t.id!==id||!near(state,t))return false;state.hunt.found.push(id);return true;}
  function collectDateItem(state,id){const p=dateStations.find(t=>t.id===id);if(state.done.length<5||!p||state.dateItems.includes(id)||!near(state,p))return false;state.dateItems.push(id);return true;}
  function complete(state,id){const index=stops.findIndex(x=>x.id===id);if(index<0||index>=LEVELS||!unlocked(state,index)||state.done.includes(id))return false;if(id==='hunt'&&(state.hunt.found.length!==treasures.length||!near(state,stops[index])))return false;if(id==='date'&&(state.dateItems.length!==dateStations.length||!near(state,stops[index])))return false;state.done.push(id);if(id==='hunt')state.hunt.active=false;return true;}
  function sameSet(selected,expected){return selected.length===expected.length&&new Set(selected).size===selected.length&&expected.every(x=>selected.includes(x));}
  function safeAsset(value){return typeof value==='string'&&/^(?:assets\/)[a-zA-Z0-9_./ -]+$/.test(value)&&!value.includes('..')?value:'';}
  const api={rows,trees,solids,stops,LEVELS,treasures,dateStations,rules,near,currentTreasure,collectTreasure,collectDateItem,sameSet,land,walkable,path,shuffle,puzzle,solved,swap,assist,fresh,restore,unlocked,complete,safeAsset};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.QuestEngine=api;
})(typeof window!=='undefined'?window:globalThis);
