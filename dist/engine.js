(function (root) {
  'use strict';
  const rows = [null, null, [12,20], [9,22], [5,22], [3,22], [3,21], [2,21], [3,21], [3,20], [5,19], [7,18], [10,16], [11,14], null];
  const trees = [[4,7],[3,8],[5,9],[7,10],[8,4],[9,4],[10,3],[14,2],[15,3],[18,3],[21,5],[20,7],[19,9],[16,10],[10,11],[13,11],[15,12],[7,5],[8,8],[10,8],[16,5],[18,6]];
  const solids = new Set(trees.map(p=>p.join(',')));
  [[4,5],[5,5],[6,5],[4,6],[5,6],[6,6],[12,2],[13,2],[20,2],[20,3],[21,2],[21,3]].forEach(p=>solids.add(p.join(',')));
  const stops = [
    { id: 'quiz', x:6, y:8, title:'Awal cerita', sub:'Tebak-tebakan', icon:'☕', label:'Pondok Cerita', intro:'Penjaga pondok menyimpan kepingan hati pertama. Jawab tiga teka-teki kecil untuk mendapatkannya.' },
    { id:'memory', x:17, y:7, title:'Jejak kenangan', sub:'Kartu & kenangan', icon:'✿', label:'Taman Kenangan', intro:'Kenangan baik selalu punya pasangannya. Temukan empat pasang kartu, lalu buka album kecil kita.' },
    { id:'puzzle', x:12, y:4, title:'Kepingan kita', sub:'Puzzle gambar', icon:'▧', label:'Bukit Harapan', intro:'Kadang, kita hanya perlu merapikan kepingan kecil untuk melihat gambaran yang utuh.' },
    { id:'final', x:19, y:4, title:'Surat di ujung pulau', label:'Mercusuar Kita' }
  ];
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
  function puzzle(rng=Math.random){const a=shuffle([0,1,2,3,4,5,6,7,8],rng);if(solved(a))[a[0],a[1]]=[a[1],a[0]];return a;}
  function solved(a){return a.length===9&&a.every((n,i)=>n===i);}
  function swap(a,i,j){const out=[...a];[out[i],out[j]]=[out[j],out[i]];return out;}
  function assist(a){const i=a.findIndex((n,i)=>n!==i);return i<0?[...a]:swap(a,i,a.indexOf(i));}
  function fresh(){return {version:1,started:false,done:[],position:{x:12,y:12},finished:false};}
  function restore(raw){
    const s=fresh();if(!raw||raw.version!==1)return s;
    s.started=raw.started===true;
    for(const id of ['quiz','memory','puzzle']){if(Array.isArray(raw.done)&&raw.done.includes(id))s.done.push(id);else break;}
    if(raw.position&&walkable(raw.position.x,raw.position.y))s.position={x:raw.position.x,y:raw.position.y};
    s.finished=raw.finished===true&&s.done.length===3;
    if(s.done.length)s.started=true;return s;
  }
  function unlocked(state,index){return index>=0&&index<=state.done.length;}
  function complete(state,id){const index=stops.findIndex(x=>x.id===id);if(index<0||index>2||!unlocked(state,index)||state.done.includes(id))return false;state.done.push(id);return true;}
  function safeAsset(value){return typeof value==='string'&&/^(?:assets\/)[a-zA-Z0-9_./ -]+$/.test(value)&&!value.includes('..')?value:'';}
  const api={rows,trees,solids,stops,land,walkable,path,shuffle,puzzle,solved,swap,assist,fresh,restore,unlocked,complete,safeAsset};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.QuestEngine=api;
})(typeof window!=='undefined'?window:globalThis);
