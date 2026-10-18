(() => {
  'use strict';
  const C=window.ANNIVERSARY,G=window.QuestEngine,$=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key=C.saveKey||'setahun-kita-v1', dialog=$('#modal'),body=$('#modal-body');
  let state=G.fresh(),saveAvailable=true,route=[],routeTarget=null,toastTimer,view='',viewId=0;
  let quizIndex=0,quizAnswered=false,memoryDeck=[],memoryOpen=[],memoryMatched=[],memoryMoves=0,memoryBusy=false,puzzleTiles=[],selectedTile=-1,puzzleMoves=0,puzzleReference=false;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try{state=G.restore(JSON.parse(localStorage.getItem(key)));}catch{saveAvailable=false;}
  function save(){try{localStorage.setItem(key,JSON.stringify(state));saveAvailable=true;}catch{saveAvailable=false;}$('#save-status').textContent=saveAvailable?'Progres tersimpan di perangkat ini':'Progres hanya tersimpan selama halaman terbuka';}
  function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);}
  function open(content,kicker='PETUALANGAN KITA',name=''){route=[];routeTarget=null;view=name;viewId++;body.innerHTML=content;$('#modal-kicker').textContent=kicker;if(!dialog.open)dialog.showModal();dialog.scrollTop=0;}
  function close(){viewId++;view='';dialog.close();$('#world').focus({preventScroll:true});updateInteract();}
  function action(label,act,klass='primary'){return `<button class="${klass}" data-action="${act}">${esc(label)}</button>`;}
  function modalTitle(title){return `<h2 id="modal-title">${esc(title)}</h2>`;}
  function refresh(){
    $('#welcome-card').hidden=state.started;
    $('#start-button').textContent=state.done.length?'Lanjut petualangan →':'Mulai petualangan →';
    $('#quest-list').innerHTML=G.stops.slice(0,3).map((s,i)=>`<button class="quest ${state.done.includes(s.id)?'done':state.done.length===i?'active':''}" data-quest="${i}" ${G.unlocked(state,i)?'':'disabled'} aria-label="${esc(s.title)}${state.done.includes(s.id)?', selesai':G.unlocked(state,i)?', menuju lokasi':', terkunci'}"><span class="quest-icon">${state.done.includes(s.id)?'✓':s.icon}</span><span><small class="quest-number">LEVEL 0${i+1} ${state.done.includes(s.id)?'· SELESAI':''}</small><strong>${s.title}</strong><small>${s.sub}</small></span><span class="quest-arrow">${state.done.includes(s.id)?'✓':G.unlocked(state,i)?'↗':'⌑'}</span></button>`).join('');
    $('#heart-progress').querySelectorAll('span').forEach((e,i)=>{e.className=i<state.done.length?'filled':'';e.textContent=i<state.done.length?'♥':'♡';});
    $('#heart-progress').setAttribute('aria-label',`${state.done.length} dari 3 kepingan hati`);
    $('#progress-text').textContent=`${state.done.length} / 3 terkumpul`;
    $('#final-button').disabled=state.done.length!==3;
    $('#final-status').textContent=state.done.length===3?'Suratmu sudah menunggu ♡':'Terbuka setelah 3 kepingan';
    $('#world-caption').textContent=state.done.length===3?'Epilog · Selalu ada kamu':`Bab 0${state.done.length+1} · ${G.stops[state.done.length].title}`;
    const notes=['Tidak perlu cepat-cepat.\nHal-hal baik layak dinikmati.','Ternyata, jawaban yang indah\nsering ada di hal sederhana.','Kenangan tidak pernah jauh.\nKita hanya perlu mengingatnya.','Semua kepingan telah pulang.\nSekarang, giliran sebuah surat.'];
    $('#journal-text').textContent=notes[state.done.length];$('#journal-text').style.whiteSpace='pre-line';
    updateInteract();
  }
  function start(){state.started=true;save();refresh();$('#world').focus({preventScroll:true});toast('Selamat datang! Temui penjaga di Pondok Cerita.');}
  function nearest(){if(!state.started)return null;let best=null;G.stops.forEach((s,i)=>{const d=Math.abs(s.x-state.position.x)+Math.abs(s.y-state.position.y);if(d<=1&&(!best||d<best.d))best={...s,index:i,d};});return best;}
  function updateInteract(){const s=nearest(),b=$('#interact');b.hidden=!s||dialog.open;if(s)b.querySelector('span').textContent=`${s.id==='final'?'Buka surat':'Bicara'} · ${s.label}`;}
  function goTo(index){
    if(!G.unlocked(state,index)){toast('Selesaikan level sebelumnya dulu, ya.');return;}
    if(!state.started)start();const target=G.stops[index];
    route=G.path(state.position,target);routeTarget=index;
    if(!route.length){if(state.position.x===target.x&&state.position.y===target.y)visit(index);else toast('Belum ada jalan ke sana.');}
    else toast(`Menuju ${target.label}…`);
  }
  function visit(index){
    const s=G.stops[index];
    if(!G.unlocked(state,index)){toast('Kepingan sebelumnya akan membuka tempat ini.');return;}
    if(index===3){showLetter();return;}
    if(state.done.includes(s.id)){
      open(`<div class="center"><span class="modal-symbol">${s.icon}</span>${modalTitle(s.title)}<p class="body-copy">Kepingan hati dari tempat ini sudah kamu temukan. Mau berkunjung lagi?</p><div class="modal-actions">${action(index===1?'Buka album':'Main lagi',`replay-${s.id}`)}${action('Lanjut perjalanan','close','secondary')}</div></div>`,s.label,'visit');return;
    }
    open(`<div class="center"><span class="modal-symbol">${s.icon}</span><p class="step-label">LEVEL 0${index+1}</p>${modalTitle(s.title)}<p class="body-copy">${esc(s.intro)}</p><div class="modal-actions">${action('Ayo, mulai →',`begin-${s.id}`)}</div><p class="small-note">Tidak ada batas waktu. Nikmati setiap langkahnya.</p></div>`,s.label,'visit');
  }
  function reward(id){
    const fresh=G.complete(state,id);save();refresh();chime();
    const index=G.stops.findIndex(s=>s.id===id);
    open(`<div class="center"><span class="reward-heart">♥</span><div><span class="reward-tag">KEPINGAN HATI 0${index+1}</span></div>${modalTitle(fresh?'Satu kepingan, untuk kita.':'Masih sehangat pertama kali.')}<p class="body-copy">${['Teka-teki selesai. Ada banyak hal yang ingin terus kutemukan bersamamu.','Empat pasang kenangan, banyak alasan untuk tersenyum. Album kita sudah terbuka.','Semua kepingan akhirnya bertemu. Seperti kita, yang belajar saling melengkapi.'][index]}</p><div class="modal-actions">${action(index===1?'Lihat album kenangan':index===2?'Menuju surat kita →':'Lanjut ke taman →',index===1?'album':`next-${index+1}`)}</div></div>`,'SEBUAH HADIAH KECIL','reward');
  }
  // LEVEL 1: wrong answers stay retryable; no penalties or timers.
  function beginQuiz(){quizIndex=0;showQuiz();}
  function showQuiz(){
    quizAnswered=false;const q=C.quiz[quizIndex];
    open(`<p class="step-label">TEKA-TEKI ${quizIndex+1} / ${C.quiz.length}</p>${modalTitle('Kenal lebih dekat.')}<p class="quiz-question">${esc(q.question)}</p><div class="answers">${q.options.map((o,i)=>`<button class="answer" data-answer="${i}"><span>${String.fromCharCode(65+i)}</span>${esc(o)}</button>`).join('')}</div><p class="feedback" id="quiz-feedback" role="status" aria-live="polite"></p><p class="hint" id="quiz-hint" hidden>${esc(q.hint)}</p><div class="modal-actions">${action('Butuh petunjuk?','quiz-hint','secondary')}<button class="primary" data-action="quiz-next" id="quiz-next" hidden>${quizIndex===C.quiz.length-1?'Ambil kepingan hati ♡':'Pertanyaan berikutnya →'}</button></div>`,'LEVEL 01 · AWAL CERITA','quiz');
  }
  function answer(index){
    if(quizAnswered)return;const q=C.quiz[quizIndex],button=body.querySelector(`[data-answer="${index}"]`);
    if(index===q.answer){quizAnswered=true;button.classList.add('correct');body.querySelectorAll('[data-answer]').forEach(b=>b.disabled=true);$('#quiz-feedback').textContent='✓ '+q.note;$('#quiz-next').hidden=false;chime();}
    else{button.classList.add('wrong');button.disabled=true;$('#quiz-feedback').textContent='Belum tepat, tapi tidak apa-apa. Coba jawaban lainnya. ♡';}
  }
  // LEVEL 2: four pairs reveal a personal scrapbook.
  function beginMemory(){memoryDeck=G.shuffle(C.memories.flatMap((_,i)=>[i,i]));memoryOpen=[];memoryMatched=[];memoryMoves=0;memoryBusy=false;showMemory();}
  function showMemory(){
    open(`${modalTitle('Yang berkesan, selalu berpasangan.')}<p class="body-copy">Balik dua kartu. Temukan pasangannya untuk membuka album kenangan kita.</p><div class="memory-stats"><span id="pair-count">0 / ${C.memories.length} pasangan</span><span id="memory-moves">0 percobaan</span></div><div class="memory-grid">${memoryDeck.map((_,i)=>`<button class="memory-card" data-card="${i}" aria-label="Balik kartu ${i+1}"><span class="card-back">✳</span></button>`).join('')}</div><p class="small-note center">Pelan-pelan saja. Tidak ada waktu yang mengejar.</p>`,'LEVEL 02 · JEJAK KENANGAN','memory');
  }
  function renderCards(){
    body.querySelectorAll('[data-card]').forEach(b=>{const i=Number(b.dataset.card),id=memoryDeck[i],m=C.memories[id],matched=memoryMatched.includes(id),visible=matched||memoryOpen.includes(i);b.className=`memory-card ${matched?'is-matched':visible?'is-open':''}`;b.innerHTML=visible?`<span>${esc(m.icon)}</span><small>${esc(m.title)}</small>`:'<span class="card-back">✳</span>';b.disabled=matched;b.setAttribute('aria-label',visible?`${m.title}${matched?', berpasangan':''}`:`Balik kartu ${i+1}`);});
    $('#pair-count').textContent=`${memoryMatched.length} / ${C.memories.length} pasangan`;$('#memory-moves').textContent=`${memoryMoves} percobaan`;
  }
  function flipCard(i){
    if(memoryBusy||memoryOpen.includes(i)||memoryMatched.includes(memoryDeck[i]))return;
    memoryOpen.push(i);renderCards();if(memoryOpen.length!==2)return;
    memoryMoves++;memoryBusy=true;const currentView=viewId,match=memoryDeck[memoryOpen[0]]===memoryDeck[memoryOpen[1]];
    if(match){memoryMatched.push(memoryDeck[i]);chime();}
    setTimeout(()=>{if(!dialog.open||viewId!==currentView||view!=='memory')return;memoryOpen=[];memoryBusy=false;renderCards();if(memoryMatched.length===C.memories.length)reward('memory');},match?420:950);
  }
  function album(){
    open(`${modalTitle('Album kecil kita.')}<p class="body-copy">Beberapa momen, satu orang yang sama: kamu.</p><div class="album">${C.memories.map(m=>`<article class="memory-entry">${G.safeAsset(m.image)?`<img class="memory-photo" src="${esc(G.safeAsset(m.image))}" alt="${esc(m.title)}">`:`<span class="memory-photo" aria-hidden="true">${esc(m.icon)}</span>`}<div><small>${esc(m.date)}</small><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p></div></article>`).join('')}</div><div class="modal-actions">${action('Lanjut ke bukit →','next-2')}${action('Main kartu lagi','begin-memory','secondary')}</div>`,'ALBUM KENANGAN','album');
  }
  // LEVEL 3: a swap puzzle is always solvable; the optional assist places one tile.
  let puzzleImage=G.safeAsset(C.puzzleImage)||'assets/our-world.svg';
  const imageCheck=new Image();
  imageCheck.onerror=()=>{puzzleImage='assets/our-world.svg';if(view==='puzzle'){renderPuzzle();$('#puzzle-reference').src=puzzleImage;}toast('Gambar puzzle belum ditemukan. Ilustrasi bawaan digunakan.');};
  imageCheck.src=puzzleImage;
  function beginPuzzle(){puzzleTiles=G.puzzle();puzzleMoves=0;selectedTile=-1;puzzleReference=false;showPuzzle();}
  function showPuzzle(){
    open(`${modalTitle('Saling melengkapi.')}<p class="body-copy">Ketuk dua kepingan untuk menukar posisinya. Susun gambar hingga utuh, dari nomor 1 sampai 9.</p><div class="memory-stats"><span id="puzzle-count"></span><span id="puzzle-moves"></span></div><div class="puzzle-frame"><div class="puzzle" id="puzzle-grid"></div><img class="puzzle-reference" id="puzzle-reference" src="${esc(puzzleImage)}" alt="Gambar utuh sebagai panduan puzzle" hidden></div><p class="small-note center">Tanda ✓ berarti kepingan sudah di tempatnya.</p><div class="modal-actions">${action('Lihat gambar utuh','puzzle-reference','secondary')}${action('Bantu 1 keping ♡','puzzle-help','secondary')}</div>`,'LEVEL 03 · KEPINGAN KITA','puzzle');renderPuzzle();
  }
  function renderPuzzle(){
    const focused=document.activeElement?.dataset?.tile;
    $('#puzzle-grid').innerHTML=puzzleTiles.map((n,i)=>`<button class="puzzle-tile ${i===selectedTile?'selected':''} ${n===i?'correct-tile':''}" data-tile="${i}" aria-label="Kepingan ${n+1}, posisi ${i+1}${i===selectedTile?', terpilih':''}" aria-pressed="${i===selectedTile}" style="background-image:url('${esc(puzzleImage)}');background-position:${(n%3)*50}% ${Math.floor(n/3)*50}%"><span>${n+1}</span></button>`).join('');
    if(focused!==undefined)body.querySelector(`[data-tile="${focused}"]`)?.focus({preventScroll:true});
    $('#puzzle-count').textContent=`${puzzleTiles.filter((n,i)=>n===i).length} / 9 kepingan tepat`;$('#puzzle-moves').textContent=`${puzzleMoves} pertukaran`;
  }
  function checkPuzzle(){renderPuzzle();if(G.solved(puzzleTiles)){const current=viewId;setTimeout(()=>{if(dialog.open&&viewId===current)reward('puzzle');},400);}}
  function pickTile(i){if(G.solved(puzzleTiles))return;if(selectedTile===i){selectedTile=-1;renderPuzzle();return;}if(selectedTile<0){selectedTile=i;renderPuzzle();return;}puzzleTiles=G.swap(puzzleTiles,i,selectedTile);selectedTile=-1;puzzleMoves++;checkPuzzle();}
  function showLetter(){
    if(state.done.length!==3)return;state.finished=true;save();
    open(`<div class="center"><span class="modal-symbol">✉</span><p class="step-label">HAPPY FIRST ANNIVERSARY</p>${modalTitle('Dan ceritanya, belum selesai.')}<p class="body-copy">${esc(C.couple.from)} & ${esc(C.couple.to)} · satu tahun, banyak cerita.</p></div><article class="letter"><p class="greeting">${esc(C.letter.greeting)}</p>${C.letter.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<p>${esc(C.letter.closing)}</p><p class="signature">${esc(C.couple.from)} ♡</p></article><button class="coupon" data-action="coupon" id="coupon"><small>SATU KEJUTAN LAGI</small>Ketuk untuk membuka janji kecil kita ♡</button><div class="modal-actions">${action('Simpan surat ↓','download-letter','secondary')}${action('Kembali ke pulau','close')}</div>`,'EPILOG · SELALU ADA KAMU','letter');celebrate();
  }
  function downloadLetter(){
    const text=['SELAMAT SATU TAHUN ♡',`${C.couple.from} & ${C.couple.to}`,'',C.letter.greeting,'',...C.letter.paragraphs.flatMap(p=>[p,'']),C.letter.closing,C.couple.from,'','Janji kecil kita:',C.letter.promise].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='surat-anniversary.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function celebrate(){if(reduceMotion)return;for(let i=0;i<26;i++){const e=document.createElement('span');e.className='confetti';e.textContent=i%3===0?'♡':'✦';e.style.cssText=`left:${Math.random()*100}%;color:${['#bacb8c','#d9a6b4','#e2d2a4'][i%3]};font-size:${10+Math.random()*14}px;animation-delay:${Math.random()*.8}s`;document.body.append(e);setTimeout(()=>e.remove(),4300);}}
  function help(){open(`${modalTitle('Petualangan yang sederhana.')}<ol class="help-steps"><li>Tekan <strong>Mulai petualangan</strong>. Jelajahi pulau dengan tombol panah / WASD, kontrol sentuh, atau ketuk lokasi di peta.</li><li>Kamu juga bisa memilih level di panel <strong>Perjalanan kita</strong>. Karaktermu akan berjalan ke sana otomatis.</li><li>Dekati penjaga, lalu tekan <strong>E</strong> atau tombol interaksi. Selesaikan ketiga level secara berurutan.</li><li>Kumpulkan tiga kepingan hati untuk membuka surat di mercusuar.</li></ol><p class="body-copy">Tidak ada game over dan tidak ada batas waktu. Level yang selesai disimpan di browser ini. Jika keluar di tengah mini game, mini game tersebut dimulai ulang saat dibuka lagi.</p><div class="modal-actions">${action('Siap berpetualang','close')}</div>`,'PETUNJUK BERMAIN','help');}
  function handleAction(act){
    if(act==='close')return close();
    if(act==='begin-quiz'||act==='replay-quiz')return beginQuiz();
    if(act==='begin-memory')return beginMemory();
    if(act==='replay-memory'||act==='album')return album();
    if(act==='begin-puzzle'||act==='replay-puzzle')return beginPuzzle();
    if(act==='quiz-hint'){$('#quiz-hint').hidden=false;return;}
    if(act==='quiz-next'&&quizAnswered){quizIndex++;return quizIndex<C.quiz.length?showQuiz():reward('quiz');}
    if(act.startsWith('next-')){const i=Number(act.slice(5));close();goTo(i);return;}
    if(act==='puzzle-reference'){puzzleReference=!puzzleReference;$('#puzzle-reference').hidden=!puzzleReference;body.querySelector('[data-action="puzzle-reference"]').textContent=puzzleReference?'Tutup gambar utuh':'Lihat gambar utuh';return;}
    if(act==='puzzle-help'&&!G.solved(puzzleTiles)){puzzleTiles=G.assist(puzzleTiles);selectedTile=-1;puzzleMoves++;checkPuzzle();return;}
    if(act==='coupon'){$('#coupon').innerHTML=`<small>JANJI KECIL KITA</small>${esc(C.letter.promise)}`;return;}
    if(act==='download-letter')return downloadLetter();
    if(act==='confirm-reset'){state=G.fresh();route=[];routeTarget=null;save();close();refresh();toast('Cerita baru siap dimulai.');}
  }
  body.addEventListener('click',event=>{const b=event.target.closest('button');if(!b||b.disabled)return;if(b.dataset.action)handleAction(b.dataset.action);else if(b.dataset.answer!==undefined)answer(Number(b.dataset.answer));else if(b.dataset.card!==undefined)flipCard(Number(b.dataset.card));else if(b.dataset.tile!==undefined)pickTile(Number(b.dataset.tile));});
  body.addEventListener('error',event=>{const img=event.target;if(img.tagName==='IMG'&&img.classList.contains('memory-photo')){const fallback=document.createElement('span');fallback.className='memory-photo';fallback.textContent='♡';fallback.setAttribute('aria-label','Foto belum tersedia');img.replaceWith(fallback);}},true);
  $('#modal-close').addEventListener('click',close);
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
  $('#start-button').addEventListener('click',start);
  $('#help-button').addEventListener('click',help);
  $('#quest-list').addEventListener('click',e=>{const b=e.target.closest('[data-quest]');if(b&&!b.disabled)goTo(Number(b.dataset.quest));});
  $('#final-button').addEventListener('click',()=>goTo(3));
  $('#interact').addEventListener('click',()=>{const s=nearest();if(s)visit(s.index);});
  $('#reset-button').addEventListener('click',()=>open(`${modalTitle('Mulai dari halaman pertama?')}<p class="body-copy">Kepingan hati dan level yang sudah selesai pada browser ini akan dihapus. Nama, foto, dan isi cerita tetap sama.</p><div class="modal-actions">${action('Batal','close','secondary')}${action('Ya, ulang cerita','confirm-reset')}</div>`,'ULANG PERJALANAN','reset'));
  function move(dx,dy){if(!state.started||dialog.open)return;route=[];routeTarget=null;const x=state.position.x+dx,y=state.position.y+dy;if(G.walkable(x,y)){state.position={x,y};save();}updateInteract();}
  document.querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>move(...b.dataset.move.split(',').map(Number))));
  document.addEventListener('keydown',e=>{if(dialog.open||!state.started||['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(document.activeElement.tagName))return;const dir={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[e.key];if(dir){e.preventDefault();move(...dir);}else if(e.key.toLowerCase()==='e'){const s=nearest();if(s)visit(s.index);}});
  // Optional custom music; otherwise a quiet, original generative music-box loop.
  let audioContext=null,audioOn=false,musicInterval=null,customAudio=null,musicStep=0;
  function tone(freq,start,duration=.7,volume=.035){const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(volume,start+.02);g.gain.exponentialRampToValueAtTime(.0001,start+duration);o.connect(g);g.connect(audioContext.destination);o.start(start);o.stop(start+duration+.02);}
  function chime(){if(audioContext&&audioOn&&!customAudio){tone(523.25,audioContext.currentTime,.25,.025);tone(659.25,audioContext.currentTime+.12,.3,.025);}}
  function musicTick(){if(!audioOn||!audioContext||document.hidden)return;const notes=[261.63,329.63,392,523.25,440,392,329.63,293.66,261.63,349.23,440,523.25,493.88,392,329.63,293.66];tone(notes[musicStep%notes.length],audioContext.currentTime,1.15,.025);if(musicStep%4===0)tone(notes[musicStep%notes.length]/2,audioContext.currentTime,1.8,.018);musicStep++;}
  async function toggleMusic(){
    const button=$('#music-toggle');button.disabled=true;
    try{if(audioOn){audioOn=false;clearInterval(musicInterval);if(customAudio)customAudio.pause();if(audioContext)await audioContext.suspend();}
      else {const path=G.safeAsset(C.music);if(path){if(!customAudio){customAudio=new Audio(path);customAudio.loop=true;customAudio.volume=.32;}await customAudio.play();audioOn=true;}
      else {const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error('Audio unavailable');if(!audioContext)audioContext=new AC();await audioContext.resume();audioOn=true;musicTick();musicInterval=setInterval(musicTick,650);}}
    }catch{audioOn=false;toast('Musik belum bisa diputar. Periksa file musik atau izin audio browser.');}
    button.disabled=false;button.setAttribute('aria-pressed',String(audioOn));$('#sound-label').textContent=audioOn?'Musik menyala':'Musik mati';
  }
  $('#music-toggle').addEventListener('click',toggleMusic);
  document.addEventListener('visibilitychange',()=>{if(customAudio&&audioOn){if(document.hidden)customAudio.pause();else customAudio.play().catch(()=>{audioOn=false;$('#music-toggle').setAttribute('aria-pressed','false');$('#sound-label').textContent='Musik mati';});}});
  // The island is drawn locally: no image/font/CDN dependency.
  const canvas=$('#world'),ctx=canvas.getContext('2d'),base=document.createElement('canvas');base.width=960;base.height=600;const b=base.getContext('2d');
  const tile=40,px=(x,y)=>[x*tile+20,y*tile+20];
  function rect(x,y,w,h,c,context=b){context.fillStyle=c;context.fillRect(Math.round(x),Math.round(y),w,h);}
  function ellipse(x,y,rx,ry,c,context=b){context.fillStyle=c;context.beginPath();context.ellipse(x,y,rx,ry,0,0,Math.PI*2);context.fill();}
  function poly(points,c,context=b){context.fillStyle=c;context.beginPath();points.forEach((p,i)=>i?context.lineTo(...p):context.moveTo(...p));context.closePath();context.fill();}
  function random(n){const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}
  function tree(tx,ty,variant=0){const [x,y]=px(tx,ty);ellipse(x+3,y+9,21,9,'#2b4a3b45');rect(x-4,y-17,9,29,'#786851');rect(x+1,y-15,4,26,'#93805a');if(variant===2){rect(x-26,y-54,46,30,'#a895a5');rect(x-34,y-45,63,24,'#b5a1ad');rect(x-25,y-61,42,17,'#bfaeb7');rect(x-17,y-53,16,7,'#cebdc0');rect(x+17,y-36,10,7,'#9b899b');}else{const colors=variant===1?['#748963','#8e9c6f','#a0ac7a']:['#3d6851','#4c7b5c','#63916a'];poly([[x,y-78],[x-27,y-30],[x+27,y-30]],colors[0]);poly([[x,y-65],[x-33,y-14],[x+33,y-14]],colors[0]);poly([[x-2,y-77],[x-23,y-34],[x+6,y-34]],colors[1]);poly([[x-2,y-61],[x-27,y-20],[x+8,y-20]],colors[1]);rect(x-8,y-49,7,4,colors[2]);rect(x-17,y-29,8,4,colors[2]);}}
  function cottage(){const [x,y]=px(5,6);ellipse(x+6,y+23,62,18,'#34544555');rect(x-45,y-58,92,74,'#d7c699');rect(x+28,y-55,19,71,'#b9aa80');poly([[x-56,y-57],[x-5,y-105],[x+60,y-57]],'#8d727b');poly([[x-56,y-57],[x-5,y-105],[x+7,y-92],[x-32,y-57]],'#aa8791');rect(x+28,y-99,13,28,'#aa9b85');rect(x-13,y-25,24,42,'#665a50');rect(x-10,y-22,18,32,'#8a7460');rect(x-36,y-38,15,19,'#f0dfa0');rect(x+22,y-38,15,19,'#f0dfa0');rect(x-30,y-38,3,19,'#a58e65');rect(x+28,y-38,3,19,'#a58e65');rect(x-48,y+16,100,6,'#a6a276');rect(x-21,y+23,46,7,'#c1b895');}
  function lighthouse(){const [x,y]=px(20,3);ellipse(x+8,y+28,43,13,'#2d4c4050');poly([[x-20,y-67],[x+21,y-67],[x+30,y+24],[x-30,y+24]],'#e9dfbb');poly([[x+12,y-67],[x+21,y-67],[x+30,y+24],[x+15,y+24]],'#c2b79c');rect(x-21,y-41,44,14,'#a88992');rect(x-8,y-58,12,12,'#718981');rect(x-9,y+5,18,19,'#7e7466');rect(x-25,y-86,51,20,'#485f56');rect(x-18,y-86,37,16,'#eddaa3');rect(x-3,y-86,4,17,'#849079');poly([[x-34,y-88],[x,y-116],[x+34,y-88]],'#8d777e');rect(x-2,y-127,4,11,'#b8b29a');}
  function shrine(){const [x,y]=px(12,3);rect(x-34,y+3,68,10,'#8b9981');rect(x-27,y-2,55,7,'#abb49a');rect(x-23,y-29,47,28,'#c3c5a7');rect(x-27,y-35,55,8,'#d4d4b5');rect(x-5,y-25,10,18,'#949a89');ellipse(x,y-58,19,19,'#e3d7a3');ellipse(x+8,y-65,17,17,'#638363');}
  function drawBase(){
    rect(0,0,960,600,'#294951');
    for(let i=0;i<90;i++){const x=random(i)*960,y=random(i+300)*600;rect(x,y,12+Math.floor(random(i+40)*24),2,i%3?'#365760':'#42626a');}
    for(let y=0;y<15;y++)for(let x=0;x<24;x++)if(G.land(x,y)){rect(x*40-6,y*40+10,52,41,'#213f46');rect(x*40-5,y*40-2,50,47,'#798d77');}
    for(let y=0;y<15;y++)for(let x=0;x<24;x++)if(G.land(x,y)){rect(x*40,y*40,40,40,['#7e986e','#829c72','#79956b'][Math.floor(random(x+y*24)*3)]);for(let j=0;j<3;j++){const gx=x*40+random(x*15+y*33+j)*36,gy=y*40+random(x*21+y*19+j+1)*36;rect(gx,gy,3,3,'#a0af7c');}}
    // Broad sandy trails make the whole route readable.
    const routes=[[[12,12],[12,9],[6,9],[6,8]],[[12,9],[17,9],[17,7]],[[12,9],[12,4]],[[12,4],[19,4]]];
    b.lineJoin='round';b.lineCap='round';b.lineWidth=24;b.strokeStyle='#c3c197';for(const r of routes){b.beginPath();r.forEach((p,i)=>{const [x,y]=px(...p);i?b.lineTo(x,y):b.moveTo(x,y);});b.stroke();}
    for(let y=12;y<15;y++){rect(474,y*40+6,52,39,'#a29573');for(let i=0;i<4;i++)rect(474,y*40+8+i*9,52,2,'#756e5d');}rect(467,486,6,110,'#756e5d');rect(527,486,6,110,'#756e5d');
    // A quiet pond, a bench, flower beds, and stepping stones.
    ellipse(373,251,48,33,'#a3b093');ellipse(373,249,42,27,'#537b7b');ellipse(373,245,35,22,'#628e87');rect(360,241,21,3,'#96b2a1');rect(385,253,14,2,'#a0b5a3');ellipse(351,249,7,3,'#8dac6f');ellipse(389,237,7,3,'#8dac6f');
    rect(693,336,40,7,'#a99a75');rect(693,347,40,8,'#b5a780');rect(698,355,5,12,'#7d795d');rect(725,355,5,12,'#7d795d');
    for(const [x,y]of [[5,8],[7,7],[16,8],[18,8],[11,5],[13,5],[18,5]]){const p=px(x,y);for(let j=0;j<5;j++){const dx=random(x*22+j)*30-15,dy=random(y*23+j)*18-9;rect(p[0]+dx,p[1]+dy,2,7,'#547e55');rect(p[0]+dx-2,p[1]+dy-2,6,4,j%2?'#d8b5ba':'#e5d9a0');}}
    cottage();shrine();lighthouse();
    G.trees.slice().sort((a,b)=>a[1]-b[1]).forEach((p,i)=>tree(...p,i%5===0?2:i%3===0?1:0));
    // A little pink tree marks the garden.
    tree(17,6,2);tree(16,6,2);
    for(const [x,y]of [[9,10],[15,8],[18,10],[11,12]]){const p=px(x,y);ellipse(p[0],p[1],12,7,'#a0a48b');rect(p[0]-6,p[1]-5,12,4,'#b8baa0');}
  }
  function character(tx,ty,color='#dcb3be',npc=false,time=0){const [x,y]=px(tx,ty),bounce=(!reduceMotion&&route.length&&!npc)?Math.sin(time/75)*1.7:0;ellipse(x,y+9,12,5,'#243e4055',ctx);rect(x-7,y-5+bounce,14,14,color,ctx);rect(x-7,y+9,5,6,'#3b514b',ctx);rect(x+2,y+9,5,6,'#3b514b',ctx);rect(x-9,y-20+bounce,18,16,'#e8be9b',ctx);rect(x-10,y-23+bounce,20,7,npc?'#87705b':'#5d534b',ctx);rect(x-10,y-17+bounce,5,6,npc?'#87705b':'#5d534b',ctx);rect(x+4,y-13+bounce,2,2,'#4d534a',ctx);if(npc){rect(x-13,y-24,26,4,'#cfbc87',ctx);rect(x-8,y-30,17,7,'#d8c894',ctx);}else{rect(x-4,y-22+bounce,6,3,'#d8b1be',ctx);}}
  function label(text,x,y,active=false){ctx.font='10px "Segoe UI",sans-serif';const w=ctx.measureText(text).width+18;rect(x-w/2,y-12,w,21,active?'#f2eccb':'#304f4bd9',ctx);ctx.textAlign='center';ctx.fillStyle=active?'#53624a':'#e0dfbf';ctx.fillText(text,x,y+2);}
  let lastStep=0,lastDraw=0;
  function frame(t){
    if(!document.hidden&&t-lastDraw>33){lastDraw=t;
      if(route.length&&!dialog.open&&t-lastStep>125){lastStep=t;state.position=route.shift();updateInteract();if(!route.length){save();const target=routeTarget;routeTarget=null;if(target!==null)visit(target);}}
      ctx.clearRect(0,0,960,600);ctx.drawImage(base,0,0);
      if(!reduceMotion){for(let i=0;i<18;i++){const x=random(i+970)*800+80,y=random(i+850)*450+55;ctx.globalAlpha=.2+(Math.sin(t/1300+i)+1)*.25;rect(x+Math.sin(t/3000+i)*7,y+Math.cos(t/2000+i)*6,3,3,'#f1e7b1',ctx);}ctx.globalAlpha=1;}
      G.stops.forEach((s,i)=>{const active=state.done.length===i,done=state.done.includes(s.id);if(i<3)character(s.x,s.y,i===1?'#af9db6':i===2?'#a6b9cc':'#d7c18c',true);const [x,y]=px(s.x,s.y);label(s.label,x,y+35,active);if(active||done){ctx.font='18px Georgia';ctx.fillStyle=active?'#f1dea0':'#dae5b4';ctx.textAlign='center';ctx.fillText(active?'✦':'✓',x,y-42+(reduceMotion?0:Math.sin(t/450)*3));}});
      character(state.position.x,state.position.y,'#dbadbd',false,t);
      if(!state.started){rect(0,0,960,600,'#193a392a',ctx);}
    }requestAnimationFrame(frame);
  }
  canvas.addEventListener('click',e=>{if(!state.started||dialog.open)return;canvas.focus({preventScroll:true});const r=canvas.getBoundingClientRect();const x=Math.floor((e.clientX-r.left)*960/r.width/40),y=Math.floor((e.clientY-r.top)*600/r.height/40);const stop=G.stops.findIndex(s=>Math.abs(s.x-x)<=1&&Math.abs(s.y-y)<=1);if(stop>=0){goTo(stop);return;}if(G.walkable(x,y)){route=G.path(state.position,{x,y});routeTarget=null;}else toast('Pilih jalan atau rerumputan di pulau, ya.');});
  // Personalization uses text nodes, so names and letters can contain punctuation safely.
  const title=C.title||'Setahun, dan masih kamu.';const titleParts=title.split(',');$('#page-title').textContent=titleParts.shift()+(titleParts.length?',':'');if(titleParts.length){const em=document.createElement('em');em.textContent=' '+titleParts.join(',').trim();$('#page-title').append(em);}
  $('#intro-text').textContent=C.subtitle;$('#welcome-name').textContent=C.couple.to.toUpperCase();
  const year=/^\d{4}-\d{2}-\d{2}$/.test(C.couple.startDate)?C.couple.startDate.slice(0,4):'BERSAMA';
  $('#couple-footer').textContent=`${C.couple.from.toUpperCase()} & ${C.couple.to.toUpperCase()}  ✦  SINCE ${year}`;
  if(!saveAvailable)$('#save-status').textContent='Progres hanya tersimpan selama halaman terbuka';
  drawBase();refresh();requestAnimationFrame(frame);
})();
