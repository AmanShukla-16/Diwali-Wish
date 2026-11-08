import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const canvas=document.querySelector('#world');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x10091d);
scene.fog=new THREE.FogExp2(0x160d22,0.012);
const camera=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.1,240);
camera.position.set(0,2.1,13);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.25;

scene.add(new THREE.HemisphereLight(0x9b9bc9,0x321b20,1.5));
const moon=new THREE.DirectionalLight(0xffdca3,2.2);moon.position.set(-12,22,8);moon.castShadow=true;scene.add(moon);
const warm=new THREE.PointLight(0xff9b45,65,65);warm.position.set(0,8,-12);scene.add(warm);

const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const stone=mat(0x8b6755),sand=mat(0x49312d),dark=mat(0x241b2c),gold=mat(0xd5a34f,.42,.55),roof=mat(0x713d37),wall=mat(0xc39b70),blue=mat(0x27334a);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(220,220),mat(0x30212a));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
const road=new THREE.Mesh(new THREE.PlaneGeometry(13,190),mat(0x59413a));road.rotation.x=-Math.PI/2;road.position.set(0,.005,-65);scene.add(road);
const grid=new THREE.GridHelper(190,95,0x71513b,0x49362f);grid.position.set(0,.015,-65);grid.material.transparent=true;grid.material.opacity=.14;scene.add(grid);

function box(w,h,d,material,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function roofShape(x,z,w=5,d=5){const g=new THREE.ConeGeometry(w*.78,1.6,4);const m=new THREE.Mesh(g,roof);m.rotation.y=Math.PI/4;m.position.set(x,4.5,z);m.scale.set(1,1,d/w);m.castShadow=true;scene.add(m);box(w,3.4,d,wall,x,1.7,z);box(w+.2,.22,d+.2,gold,x,3.4,z)}
// Street-front buildings, balconies, columns and rooflines
for(let side of [-1,1])for(let i=0;i<12;i++){
 const z=-i*11-3, x=side*(9.3+(i%3)*.35),w=5.2+(i%2)*1.2;
 roofShape(x,z,w,7);
 for(let c=-1;c<=1;c++)box(.22,2.1,.22,gold,x+c*1.45,2.1,z-3.62);
 box(w+.8,.18,.5,gold,x,2.9,z-3.7);
 for(let f=0;f<2;f++)for(let c=0;c<2;c++){
  const wx=x+(c-.5)*2.1, wy=1.25+f*1.3;
  box(.95,.9,.08,dark,wx,wy,z-3.56);
  box(.75,.7,.06,mat(0xffb35b,.35),wx,wy,z-3.6);
 }
 // Decorative balcony rail
 box(w,.12,.28,gold,x,2.2,z-4.05);
 for(let c=0;c<7;c++)box(.07,.55,.07,gold,x-w/2+c*w/6,2.48,z-4.05);
 // doorway
 box(1.15,2.1,.12,dark,x,1.05,z-3.58);
 const fin=new THREE.Mesh(new THREE.ConeGeometry(.7,.85,4),gold);fin.position.set(x,5.5,z);fin.rotation.y=Math.PI/4;scene.add(fin);
}
// Palace at the end of the long ceremonial avenue
const palace=new THREE.Group();scene.add(palace);palace.position.set(0,0,-72);
box(20,8,8,wall,0,4,0,palace);box(22,.35,9,gold,0,8,0,palace);
for(let i=-2;i<=2;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.35,.48,6,12),gold);c.position.set(i*3.7,3,4.2);palace.add(c)}
for(let i=-2;i<=2;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(2.5,4,4),roof);t.position.set(i*4,10,0);t.rotation.y=Math.PI/4;palace.add(t)}
const dome=new THREE.Mesh(new THREE.SphereGeometry(2.1,24,16,0,Math.PI*2,0,Math.PI/2),gold);dome.position.set(0,8.2,0);palace.add(dome);
box(2.8,4,.2,dark,0,2,4.12,palace);

// Repeating lamps on both sides of the avenue
const lamps=[];
function addLamp(x,z){
 const group=new THREE.Group();group.position.set(x,.08,z);scene.add(group);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(.38,.48,.18,16),gold);base.position.y=.09;group.add(base);
 const bowl=new THREE.Mesh(new THREE.CylinderGeometry(.2,.38,.22,16),mat(0x9e633b,.45,.3));bowl.position.y=.27;group.add(bowl);
 const flame=new THREE.Mesh(new THREE.SphereGeometry(.12,12,10),new THREE.MeshBasicMaterial({color:0xffc35c}));flame.scale.set(.65,1.8,.65);flame.position.y=.49;group.add(flame);
 const light=new THREE.PointLight(0xffa33e,3.4,5.5,2);light.position.y=.65;group.add(light);
 lamps.push({flame,light,phase:Math.random()*6.28,baseY:.49});
}
for(let z=8;z>-125;z-=2.6){addLamp(-6.25,z);addLamp(6.25,z)}
// Hanging festive lanterns and strings of tiny lights
for(let side of [-1,1])for(let z=4;z>-90;z-=12){
 const x=side*8.2;const cord=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,4,6),gold);cord.position.set(x,5.4,z);scene.add(cord);
 const lantern=new THREE.Mesh(new THREE.OctahedronGeometry(.48,0),gold);lantern.position.set(x,3.2,z);scene.add(lantern);
 const glow=new THREE.PointLight(0xffa34f,5,9);glow.position.set(x,3.2,z);scene.add(glow);
}
// Flower petals drifting through the street
const petalGeo=new THREE.BufferGeometry();const petalCount=240;const petalPositions=new Float32Array(petalCount*3);const petalSpeeds=[];
for(let i=0;i<petalCount;i++){petalPositions[i*3]=(Math.random()-.5)*17;petalPositions[i*3+1]=Math.random()*10;petalPositions[i*3+2]=-Math.random()*120+12;petalSpeeds.push(.4+Math.random()*.8)}
petalGeo.setAttribute('position',new THREE.BufferAttribute(petalPositions,3));
const petals=new THREE.Points(petalGeo,new THREE.PointsMaterial({color:0xffad69,size:.12,transparent:true,opacity:.85}));scene.add(petals);
// Starry sky
const starsGeo=new THREE.BufferGeometry(),starPos=[];
for(let i=0;i<850;i++)starPos.push((Math.random()-.5)*180,12+Math.random()*55,-Math.random()*160+30);
starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));
scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xffe6b5,size:.22,transparent:true,opacity:.8})));

// A distant ceremonial chariot silhouette on the avenue, kept symbolic and non-photoreal
const chariot=new THREE.Group();scene.add(chariot);chariot.position.set(0,0,-47);
// Open ceremonial platform: remove the tall cabin hiding the figures.
box(3.8,.42,2.1,gold,0,.58,0,chariot);
box(3.25,.22,.18,roof,0,1.02,1.0,chariot);
for(const x of [-1.55,1.55])for(const z of [-.72,.72])box(.12,.65,.12,gold,x,1.28,z,chariot);
for(let x of [-1.35,1.35]){const wheel=new THREE.Mesh(new THREE.TorusGeometry(.55,.12,10,24),gold);wheel.position.set(x,.65,.85);chariot.add(wheel)}
const canopy=new THREE.Mesh(new THREE.ConeGeometry(1.65,1.8,4),roof);canopy.position.set(0,5.65,-.1);canopy.rotation.y=Math.PI/4;chariot.add(canopy);
const halo=new THREE.PointLight(0xffbd65,16,16);halo.position.set(0,4,0);chariot.add(halo);
// Three symbolic, respectfully stylized figures representing the homecoming
const travelers=[];
function addTraveler(x,robeColor,crownColor,scale=1){
 const figure=new THREE.Group();figure.position.set(x,1.18,0);figure.scale.setScalar(scale);chariot.add(figure);
 const robeMat=mat(robeColor,.72),skin=mat(0x9b694c),crownMat=mat(crownColor,.35,.45);
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.28,.42,1.35,12),robeMat);body.position.y=.65;figure.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.27,16,12),skin);head.position.y=1.55;figure.add(head);
 const crown=new THREE.Mesh(new THREE.ConeGeometry(.28,.55,5),crownMat);crown.position.y=1.98;figure.add(crown);
 const eyeMat=mat(0x211714,.5);
 const eyeL=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),eyeMat);
 const eyeR=eyeL.clone();eyeL.position.set(-.095,1.59,.235);eyeR.position.set(.095,1.59,.235);figure.add(eyeL,eyeR);
 const tilak=new THREE.Mesh(new THREE.BoxGeometry(.045,.17,.025),mat(0xffe2a0));tilak.position.set(0,1.77,.255);figure.add(tilak);
 const haloRing=new THREE.Mesh(new THREE.TorusGeometry(.43,.045,8,32),gold);haloRing.position.set(0,1.62,-.18);figure.add(haloRing);
 travelers.push({figure,phase:Math.random()*6});
}
addTraveler(-.82,0x315a79,0xe8bd62,1.02); // Lakshman
addTraveler(0,0x9b3e38,0xf2d28a,1.08); // Shri Ram
addTraveler(.82,0xb34f75,0xf2d28a,1.02); // Sita

/* Vanara sena and Hanuman accompany the homecoming procession.
   These are stylized, respectful low-poly characters built from Three.js primitives. */
const vanaraSena=new THREE.Group();
scene.add(vanaraSena);
vanaraSena.position.set(0,0,-47);
const vanaraWalkers=[];
const furMat=mat(0x9a6541),furLight=mat(0xc18450),muzzleMat=mat(0xd5a477),vanaraCloth=[mat(0xb64f35),mat(0x315d72),mat(0x9a7434)];
function makeVanara(x,z,index){
 const g=new THREE.Group();g.position.set(x,0,z);vanaraSena.add(g);
 const fur=index%2?furMat:furLight,robe=vanaraCloth[index%vanaraCloth.length];
 const torso=new THREE.Mesh(new THREE.CylinderGeometry(.22,.34,.95,9),robe);torso.position.y=.78;g.add(torso);
 const head=new THREE.Group();head.position.set(0,1.48,0);g.add(head);
 const skull=new THREE.Mesh(new THREE.SphereGeometry(.29,12,10),fur);head.add(skull);
 const muzzle=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),muzzleMat);muzzle.position.set(0,-.1,.22);muzzle.scale.set(1,.72,.8);head.add(muzzle);
 for(const side of [-1,1]){const ear=new THREE.Mesh(new THREE.SphereGeometry(.12,8,8),fur);ear.position.set(side*.27,.08,0);head.add(ear)}
 const arms=[];
 for(const side of [-1,1]){
  const arm=new THREE.Group();arm.position.set(side*.27,1.12,0);g.add(arm);
  const limb=new THREE.Mesh(new THREE.CylinderGeometry(.075,.095,.68,8),fur);limb.position.y=-.29;limb.rotation.z=side*.16;arm.add(limb);
  const hand=new THREE.Mesh(new THREE.SphereGeometry(.11,8,8),muzzleMat);hand.position.set(side*.08,-.62,.04);arm.add(hand);arms.push(arm);
 }
 const tailCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.35,-.12),new THREE.Vector3(-.2,.05,-.45),new THREE.Vector3(-.38,.42,-.7),new THREE.Vector3(-.18,.72,-.82)]);
 const tail=new THREE.Mesh(new THREE.TubeGeometry(tailCurve,12,.055,6,false),fur);g.add(tail);
 vanaraWalkers.push({g,arms,phase:index*.8,tail});
 return g;
}
for(let row=0;row<4;row++)for(const side of [-1,1])makeVanara(side*(3.65+(row%2)*.35),1.8+row*2.05,row+(side===1?4:0));

// Hanuman is shown respectfully beside the chariot, holding his gada.
const hanuman=new THREE.Group();hanuman.position.set(-3.25,0,1.1);vanaraSena.add(hanuman);
const hanumanFur=mat(0x9a5937),hanumanCloth=mat(0xd56c2e),hanumanGold=mat(0xe6bd65,.35,.5);
const hBody=new THREE.Mesh(new THREE.CylinderGeometry(.34,.48,1.45,12),hanumanCloth);hBody.position.y=1.05;hanuman.add(hBody);
const hChest=new THREE.Mesh(new THREE.SphereGeometry(.38,12,10),hanumanFur);hChest.position.set(0,1.82,0);hChest.scale.set(.9,1.05,.75);hanuman.add(hChest);
const hHead=new THREE.Group();hHead.position.set(0,2.15,.02);hanuman.add(hHead);
const hFace=new THREE.Mesh(new THREE.SphereGeometry(.34,16,12),hanumanFur);hHead.add(hFace);
const hMuzzle=new THREE.Mesh(new THREE.SphereGeometry(.19,12,10),muzzleMat);hMuzzle.position.set(0,-.13,.25);hMuzzle.scale.set(1,.72,.75);hHead.add(hMuzzle);
for(const side of [-1,1]){const ear=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),hanumanFur);ear.position.set(side*.31,.08,0);hHead.add(ear)}
const hCrown=new THREE.Mesh(new THREE.ConeGeometry(.31,.62,6),hanumanGold);hCrown.position.y=.53;hHead.add(hCrown);
const hHalo=new THREE.Mesh(new THREE.TorusGeometry(.52,.055,8,32),hanumanGold);hHalo.position.set(0,.05,-.13);hHead.add(hHalo);
const hArms=[];
for(const side of [-1,1]){
 const arm=new THREE.Group();arm.position.set(side*.37,1.62,.02);hanuman.add(arm);
 const limb=new THREE.Mesh(new THREE.CylinderGeometry(.11,.14,.9,10),hanumanFur);limb.position.y=-.38;limb.rotation.z=side*.18;arm.add(limb);hArms.push(arm);
}
const gada=new THREE.Group();gada.position.set(.65,1.25,.22);gada.rotation.z=-.12;hanuman.add(gada);
const gadaHandle=new THREE.Mesh(new THREE.CylinderGeometry(.055,.07,1.55,10),hanumanGold);gadaHandle.position.y=.25;gada.add(gadaHandle);
const gadaHead=new THREE.Mesh(new THREE.SphereGeometry(.34,14,12),hanumanGold);gadaHead.position.y=1.12;gada.add(gadaHead);
const gadaBand=new THREE.Mesh(new THREE.TorusGeometry(.25,.045,8,20),gold);gadaBand.position.y=1.12;gada.add(gadaBand);
const hTailCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.18,.55,-.2),new THREE.Vector3(-.58,.2,-.55),new THREE.Vector3(-.72,.72,-.85),new THREE.Vector3(-.42,1.02,-.95)]);
hanuman.add(new THREE.Mesh(new THREE.TubeGeometry(hTailCurve,18,.075,8,false),hanumanFur));
const vanaraGlow=new THREE.PointLight(0xffb45c,12,18);vanaraGlow.position.set(-2,4,2);vanaraSena.add(vanaraGlow);

const processionGlow=new THREE.PointLight(0xffd18a,24,24);processionGlow.position.set(0,4.2,1.5);chariot.add(processionGlow);
let processionStarted=false,processionProgress=0;

// Red ceremonial carpet, golden rangoli borders and lush gardens.
const carpet=new THREE.Mesh(new THREE.PlaneGeometry(5.2,150),mat(0x92243a,.8));carpet.rotation.x=-Math.PI/2;carpet.position.set(0,.035,-61);scene.add(carpet);
for(const x of [-2.68,2.68]){const edge=new THREE.Mesh(new THREE.BoxGeometry(.12,.035,150),gold);edge.position.set(x,.055,-61);scene.add(edge)}
for(let z=8;z>-125;z-=3.4)for(const x of [-2.35,2.35]){const rangoli=new THREE.Mesh(new THREE.CircleGeometry(.2,12),gold);rangoli.rotation.x=-Math.PI/2;rangoli.position.set(x,.065,z);scene.add(rangoli)}
const greens=[mat(0x315b37),mat(0x477b43),mat(0x668d4b)],bark=mat(0x60412d),blossoms=[mat(0xffc4a6),mat(0xffd77b),mat(0xf2a9c4)];
for(let side of [-1,1])for(let i=0;i<19;i++){
 const z=5-i*6.4,x=side*(8+(i%3)*.9),g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.25,2.2,8),bark);trunk.position.y=1.1;g.add(trunk);
 for(let j=0;j<5;j++){const crown=new THREE.Mesh(new THREE.SphereGeometry(.85+(j%2)*.18,10,8),greens[(i+j)%3]);crown.position.set((j%2-.5)*.62,2.45+(j%3)*.35,(j-2)*.18);g.add(crown)}
 for(let j=0;j<5;j++){const flower=new THREE.Mesh(new THREE.SphereGeometry(.13,8,8),blossoms[(i+j)%3]);flower.position.set(Math.sin(j*2)*.65,2.3+(j%3)*.35,Math.cos(j*2)*.62);g.add(flower)}
}

// Simple silhouettes of welcoming townspeople along the route
const people=[];
const crowdColors=[0x9b4939,0x354d5a,0x98703d,0x6b477d,0x3f725d,0xb07838,0x8b354f,0x486b8c];
for(let i=0;i<96;i++){
 const side=i%2?1:-1,row=Math.floor(i/2),z=3-row*1.65,x=side*(5.15+(row%4)*.38+Math.random()*.25),g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 const robeMat=mat(crowdColors[i%crowdColors.length]),robe=new THREE.Mesh(new THREE.CylinderGeometry(.2,.34,1.12,10),robeMat);robe.position.y=.68;g.add(robe);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),mat(i%3===0?0x754a37:0x9c694c));head.position.y=1.48;g.add(head);
 const arms=[];for(const sideArm of [-1,1]){const arm=new THREE.Group();arm.position.set(sideArm*.27,1.02,0);g.add(arm);const limb=new THREE.Mesh(new THREE.CylinderGeometry(.065,.085,.64,8),robeMat);limb.position.y=-.28;arm.add(limb);arms.push(arm)}
 people.push({g,arms,phase:Math.random()*6,cheer:i%3!==0});
}

let started=false,locked=false,move={w:false,a:false,s:false,d:false,arrowup:false,arrowdown:false,arrowleft:false,arrowright:false},yaw=0,pitch=0,velocity=new THREE.Vector3(),soundOn=false,audioCtx=null,osc=null;
const intro=document.querySelector('#intro'),hud=document.querySelector('#hud'),welcome=document.querySelector('#welcome'),cross=document.querySelector('#crosshair'),wish=document.querySelector('#wish');
const enter=document.querySelector('#enter');
enter.addEventListener('click',()=>{started=true;intro.classList.add('hidden');hud.classList.remove('hidden');welcome.classList.remove('hidden');document.querySelector('#movePad').classList.remove('hidden');if(matchMedia('(pointer: coarse)').matches)document.querySelector('#mobileTip').classList.remove('hidden');canvas.requestPointerLock?.()});
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===canvas;cross.classList.toggle('hidden',!locked)});
document.addEventListener('mousemove',e=>{if(!locked)return;yaw-=e.movementX*.0022;pitch-=e.movementY*.0018;pitch=THREE.MathUtils.clamp(pitch,-1.15,1.15)});
function movementKey(key){const k=key.toLowerCase();return ({w:'w',arrowup:'w',s:'s',arrowdown:'s',a:'a',arrowleft:'a',d:'d',arrowright:'d'})[k]||null}
window.addEventListener('keydown',e=>{const k=movementKey(e.key);if(k){move[k]=true;e.preventDefault()}});
window.addEventListener('keyup',e=>{const k=movementKey(e.key);if(k)move[k]=false});
window.addEventListener('blur',()=>{Object.keys(move).forEach(k=>move[k]=false)});
document.querySelectorAll('[data-move]').forEach(button=>{
 const key=button.dataset.move;
 const down=e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);move[key]=true;button.classList.add('pressed')};
 const up=e=>{e.preventDefault();move[key]=false;button.classList.remove('pressed')};
 button.addEventListener('pointerdown',down);
 ['pointerup','pointerleave','pointercancel'].forEach(type=>button.addEventListener(type,up));
});
document.querySelector('#explore').addEventListener('click',()=>{welcome.classList.add('hidden');canvas.requestPointerLock?.()});
document.querySelector('#again').addEventListener('click',()=>location.reload());
document.querySelector('#sound').addEventListener('click',async()=>{soundOn=!soundOn;document.querySelector('#sound').textContent='♫ Sound: '+(soundOn?'On':'Off');if(soundOn){audioCtx??=new (window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();if(!osc){osc=audioCtx.createOscillator();const gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=110;gain.gain.value=.018;osc.connect(gain).connect(audioCtx.destination);osc.start()}}else if(audioCtx)await audioCtx.suspend()});

// On-screen joystick-like touch controls for phones
let touchStart=null;
canvas.addEventListener('touchstart',e=>{if(!started||e.touches.length!==1)return;touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
canvas.addEventListener('touchmove',e=>{if(!touchStart)return;const t=e.touches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;yaw-=dx*.003;pitch=THREE.MathUtils.clamp(pitch+dy*.002,-1.1,1.1);touchStart={x:t.clientX,y:t.clientY}},{passive:true});
canvas.addEventListener('touchend',()=>touchStart=null);canvas.addEventListener('touchcancel',()=>touchStart=null);


const celebrationParticles=[];
function celebrate(){
 const colors=[0xffd36b,0xff8c69,0xffe9b0,0xe88bd1,0x9dd9b5];
 const origin=camera.position.clone().add(new THREE.Vector3(-Math.sin(yaw)*5,1.2,-Math.cos(yaw)*5));
 for(let i=0;i<90;i++){
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(.045+Math.random()*.045,6,6),new THREE.MeshBasicMaterial({color:colors[i%colors.length]}));
  mesh.position.copy(origin);scene.add(mesh);
  const velocity=new THREE.Vector3((Math.random()-.5)*5,Math.random()*5+1,(Math.random()-.5)*5);
  celebrationParticles.push({mesh,velocity,life:2.8});
 }
 // A short, gentle bell-like chime generated locally in the browser.
 try{
  audioCtx??=new (window.AudioContext||window.webkitAudioContext)();
  audioCtx.resume();
  [523.25,659.25,783.99].forEach((hz,index)=>{
   const oscBell=audioCtx.createOscillator(),gainBell=audioCtx.createGain();
   oscBell.type='sine';oscBell.frequency.value=hz;
   const now=audioCtx.currentTime+index*.12;
   gainBell.gain.setValueAtTime(.0001,now);
   gainBell.gain.exponentialRampToValueAtTime(.075,now+.025);
   gainBell.gain.exponentialRampToValueAtTime(.0001,now+1.1);
   oscBell.connect(gainBell).connect(audioCtx.destination);
   oscBell.start(now);oscBell.stop(now+1.15);
  });
 }catch(error){console.info('Audio is unavailable; visual celebration still works.',error)}
 const button=document.querySelector('#celebrate');
 button.classList.add('celebrating');
 setTimeout(()=>button.classList.remove('celebrating'),700);
}
document.querySelector('#celebrate').addEventListener('click',celebrate);
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;
 // Render the scene before optional animation updates, so one bad animation cannot leave a blank canvas.
 renderer.render(scene,camera);
 lamps.forEach(l=>{const flicker=.85+Math.sin(t*8+l.phase)*.12+Math.sin(t*17+l.phase)*.05;l.flame.scale.y=1.8*flicker;l.light.intensity=3.4*flicker});
 for(let i=celebrationParticles.length-1;i>=0;i--){
  const p=celebrationParticles[i];p.life-=dt;p.velocity.y-=4.8*dt;p.mesh.position.addScaledVector(p.velocity,dt);
  p.mesh.material.opacity=Math.max(0,p.life/2.8);p.mesh.material.transparent=true;
  if(p.life<=0){scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();celebrationParticles.splice(i,1)}
 }
 const p=petals.geometry.attributes.position;for(let i=0;i<petalCount;i++){let y=p.getY(i)-petalSpeeds[i]*dt;if(y<0)y=9+Math.random()*3;p.setY(i,y);p.setX(i,p.getX(i)+Math.sin(t+i)*dt*.16)}p.needsUpdate=true;
 people.forEach(o=>{if(!o.g||!o.arms||o.arms.length<2)return;o.g.rotation.z=Math.sin(t*1.4+o.phase)*.025;o.arms[0].rotation.z=o.cheer?-.65+Math.sin(t*3+o.phase)*.28:-.18;o.arms[1].rotation.z=o.cheer ? .65+Math.sin(t*3+o.phase+1)*.28 : .18;o.g.position.y=Math.max(0,Math.sin(t*3.2+o.phase))*.045});
 travelers.forEach(o=>{o.figure.rotation.z=Math.sin(t*1.35+o.phase)*.018;o.figure.position.y=1.18+Math.sin(t*2+o.phase)*.025});
 vanaraWalkers.forEach(o=>{if(!o.g||!o.arms||o.arms.length<2)return;o.g.position.y=Math.abs(Math.sin(t*3+o.phase))*.045;o.arms[0].rotation.x=Math.sin(t*3+o.phase)*.18;o.arms[1].rotation.x=-.35+Math.sin(t*3+o.phase+1)*.18;o.g.rotation.y=Math.sin(t*1.7+o.phase)*.035});
 hArms[0].rotation.z=-.25+Math.sin(t*2.4)*.12;hArms[1].rotation.z=.18+Math.sin(t*2.4+1)*.1;hanuman.rotation.y=Math.sin(t*1.1)*.035;vanaraGlow.intensity=12+Math.sin(t*4)*2;
 if(processionStarted&&processionProgress<1){
  processionProgress=Math.min(1,processionProgress+dt*.075);
  const ease=processionProgress*processionProgress*(3-2*processionProgress);
  chariot.position.z=-47+29*ease; // The homecoming procession advances toward the viewer along +Z
  vanaraSena.position.z=chariot.position.z;
  chariot.position.y=Math.sin(t*2)*.035;
  processionGlow.intensity=24+Math.sin(t*5)*4;
  lamps.forEach(l=>{if(Math.abs(l.light.position.z-camera.position.z)<18)l.light.intensity=5.2});
 }
 if(started){
  if(!processionStarted&&camera.position.z < -22){
   processionStarted=true;
   document.querySelector('#returnMoment').classList.remove('hidden');
   setTimeout(()=>document.querySelector('#returnMoment')?.classList.add('hidden'),6500);
  }
  camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;
  const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
  const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
  const input=new THREE.Vector3();
  if(move.w)input.add(forward);if(move.s)input.sub(forward);
  if(move.d)input.add(right);if(move.a)input.sub(right);
  if(input.lengthSq())input.normalize();
  if(!processionStarted||processionProgress>=1){camera.position.addScaledVector(input,dt*5.2)}camera.position.x=THREE.MathUtils.clamp(camera.position.x,-5.1,5.1);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-120,12);camera.position.y=2.1;
  if(camera.position.z < -104){wish.classList.remove('hidden');document.exitPointerLock?.()}
 }
 renderer.render(scene,camera)}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
