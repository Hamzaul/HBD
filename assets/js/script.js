// === PAGE NAVIGATION ===
const links = document.querySelectorAll('.nav-link');
function activate(hash){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.querySelector(hash) || document.querySelector('#home');
  page.classList.add('active');
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === hash));
}
window.addEventListener('hashchange',()=>activate(location.hash || '#home'));
activate(location.hash || '#home');

// === CANDLE LOGIC ===
const flame = document.getElementById('flame');
const blowBtn = document.getElementById('blowBtn');
const relightBtn = document.getElementById('relightBtn');
const blowStopBtn = document.getElementById('blowStopBtn');
let isLit = true;
const blowTrack = document.getElementById('blowTrack');

function stopAllExcept(exceptTrack){
  [blowTrack, musicTrack, revealTrack].forEach(track => {
    if(track !== exceptTrack){
      track.pause();
      track.currentTime = 0;
    }
  });
}

function blowOut(){
  if(!isLit) return;
  flame.classList.add('extinguished');
  isLit = false;
  blowBtn.style.display='none';
  relightBtn.style.display='inline-block';
  stopAllExcept(blowTrack);
  blowTrack.play();
  // puff animation
  const cake = document.querySelector('.cake');
  for(let i=0;i<8;i++){
    const puff = document.createElement('div');
    puff.style.position='absolute';
    puff.style.left='50%';
    puff.style.transform='translateX(-50%)';
    puff.style.bottom='40px';
    puff.style.width='16px';
    puff.style.height='16px';
    puff.style.borderRadius='50%';
    puff.style.background = `rgba(255,255,255,${0.6 + Math.random()*0.3})`;
    puff.style.pointerEvents='none';
    cake.appendChild(puff);
    const angle = Math.random()*Math.PI*2;
    const distance = 80 + Math.random()*40;
    puff.animate([
      { transform: `translateX(-50%) translateY(0px)`, opacity:1 },
      { transform: `translateX(${Math.cos(angle)*distance}px) translateY(-${distance}px)`, opacity:0 }
    ], { duration: 1200 + Math.random()*300, easing: 'ease-out', fill: 'forwards' });
    setTimeout(()=>puff.remove(),1500);
  }
}

function relight(){
  if(isLit) return;
  flame.classList.remove('extinguished');
  isLit = true;
  blowBtn.style.display='inline-block';
  relightBtn.style.display='none';
}

blowBtn.addEventListener('click',blowOut);
relightBtn.addEventListener('click',relight);
blowStopBtn.addEventListener('click', () => { blowTrack.pause(); blowTrack.currentTime = 0; });

// === MESSAGE BUTTON ===
document.getElementById('open-message').addEventListener('click',()=>{location.hash='#message'})

// === BALLOONS ===
document.querySelectorAll('.balloon').forEach(b=>{
  b.addEventListener('click',()=>{
    b.style.transition='all .3s';
    b.style.transform='scale(0.1) rotate(20deg)';
    b.style.opacity=0;
    setTimeout(()=>b.remove(),350);
  });
});

// === GALLERY LIGHTBOX ===
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
document.querySelectorAll('.gallery-grid img').forEach(img=>{
  img.addEventListener('click',()=>{
    modal.classList.add('open');
    modalImg.src = img.src;
  });
});
modal.addEventListener('click',()=>modal.classList.remove('open'));

// === MUSIC CONTROLS ===
const musicTrack = document.getElementById('musicTrack');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const musicStopBtn = document.getElementById('musicStopBtn');
const songTitle = document.getElementById('song-title');

playBtn.addEventListener('click', async ()=>{
  stopAllExcept(musicTrack);
  try{
    await musicTrack.play();
    playBtn.style.display='none';
    pauseBtn.style.display='inline-block';
    songTitle.textContent = musicTrack.src.split('/').pop();
  }catch(e){
    alert('Unable to play automatically. Try clicking again.');
  }
});

pauseBtn.addEventListener('click', ()=>{
  musicTrack.pause();
  pauseBtn.style.display='none';
  playBtn.style.display='inline-block';
});

musicStopBtn.addEventListener('click', ()=>{
  musicTrack.pause();
  musicTrack.currentTime=0;
  playBtn.style.display='inline-block';
  pauseBtn.style.display='none';
});

// === SURPRISE REVEAL ===
const revealBtn = document.getElementById('revealBtn');
const revealStopBtn = document.getElementById('revealStopBtn');
const hiddenMsg = document.getElementById('hiddenMsg');
const confettiCanvas = document.getElementById('confetti');
const revealTrack = document.getElementById('revealTrack');
let confettiCtx, confettiPieces = [];

revealBtn.addEventListener('click',()=>{
  hiddenMsg.classList.add('show');
  stopAllExcept(revealTrack);
  revealTrack.play();
  startConfetti();
});

revealStopBtn.addEventListener('click',()=>{
  revealTrack.pause();
  revealTrack.currentTime = 0;
});

// === CONFETTI ===
function startConfetti(){
  confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight;
  confettiCtx = confettiCanvas.getContext('2d');
  confettiPieces = [];
  const colors = ['#ff6b9a','#ffd1e0','#ff9cbc','#7a0b18','#fff3f6'];
  for(let i=0;i<110;i++){
    confettiPieces.push({
      x:Math.random()*confettiCanvas.width,
      y:Math.random()*-confettiCanvas.height*0.5,
      vy:2+Math.random()*4,
      angle:Math.random()*360,
      size:6+Math.random()*10,
      color:colors[Math.floor(Math.random()*colors.length)],
      vx:(Math.random()-0.5)*2
    });
  }
  runConfetti();
  setTimeout(()=>{cancelAnimationFrame(confettiAnim);},7000);
}

let confettiAnim;
function runConfetti(){
  confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  confettiPieces.forEach(p=>{
    p.x += p.vx; p.y += p.vy; p.angle += 6;
    confettiCtx.save();
    confettiCtx.translate(p.x,p.y);
    confettiCtx.rotate(p.angle*Math.PI/180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
    confettiCtx.restore();
  });
  confettiPieces = confettiPieces.filter(p=>p.y < confettiCanvas.height + 50);
  confettiAnim = requestAnimationFrame(runConfetti);
}

// === HELPER TO SET NAMES ===
function setNames(yourName="[Your Name]", herName="[Her Name]"){
  document.getElementById('hero-name').textContent = herName;
  document.getElementById('msg-name').textContent = herName;
  document.getElementById('from-name').textContent = yourName;
  document.getElementById('from-name-2').textContent = yourName;
}

// Resize confetti on window resize
window.addEventListener('resize',()=>{
  confettiCanvas.width = window.innerWidth; 
  confettiCanvas.height = window.innerHeight;
});
