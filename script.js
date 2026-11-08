import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const canvas=document.querySelector('#world');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x10091d);
scene.fog=new THREE.FogExp2(0x160d22,0.012);
const camera=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.1,240);
camera.position.set(0,2.1,13);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=false;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.25;

scene.add(new THREE.HemisphereLight(0x9b9bc9,0x321b20,1.8));
const moon=new THREE.DirectionalLight(0xffdca3,2.2);moon.position.set(-12,22,8);scene.add(moon);
const warm=new THREE.PointLight(0xff9b45,45,65);warm.position.set(0,8,-12);scene.add(warm);

const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const stone=mat(0x8b6755),sand=mat(0x49312d),dark=mat(0x241b2c),gold=mat(0xd5a34f,.42,.55),roof=mat(0x713d37),wall=mat(0xc39b70),blue=mat(0x27334a);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(220,220),mat(0x30212a));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
const road=new THREE.Mesh(new THREE.PlaneGeometry(13,190),mat(0x59413a));road.rotation.x=-Math.PI/2;road.position.set(0,.005,-65);scene.add(road);
const grid=new THREE.GridHelper(190,95,0x71513b,0x49362f);grid.position.set(0,.015,-65);grid.material.transparent=true;grid.material.opacity=.14;scene.add(grid);

function box(w,h,d,material,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function roofShape(x,z,w=5,d=5){const g=new THREE.Mesh(new THREE.ConeGeometry(w*.78,1.6,4),roof);g.rotation.y=Math.PI/4;g.position.set(x,4.5,z);g.scale.set(1,1,d/w);scene.add(g);box(w,3.4,d,wall,x,1.7,z);box(w+.2,.22,d+.2,gold,x,3.4,z)}
for(let side of [-1,1])for(let i=0;i<12;i++){
 const z=-i*11-3,x=side*(9.3+(i%3)*.35),w=5.2+(i%2)*1.2;
 roofShape(x,z,w,7);
 for(let c=-1;c<=1;c++)box(.22,2.1,.22,gold,x+c*1.45,2.1,z-3.62);
 box(w+.8,.18,.5,gold,x,2.9,z-3.7);
 for(let f=0;f<2;f++)for(let c=0;c<2;c++){const wx=x+(c-.5)*2.1,wy=1.25+f*1.3;box(.95,.9,.08,dark,wx,wy,z-3.56);box(.75,.7,.06,mat(0xffb35b,.35),wx,wy,z-3.6)}
 box(w,.12,.28,gold,x,2.2,z-4.05);
 for(let c=0;c<7;c++)box(.07,.55,.07,gold,x-w/2+c*w/6,2.48,z-4.05);
 box(1.15,2.1,.12,dark,x,1.05,z-3.58);
 const fin=new THREE.Mesh(new THREE.ConeGeometry(.7,.85,4),gold);fin.position.set(x,5.5,z);fin.rotation.y=Math.PI/4;scene.add(fin);
}
// Grand fortified Ayodhya palace: open central gateway, long walls and domed towers.
const castle=new THREE.Group();scene.add(castle);castle.position.set(0,0,-88);
const castleStone=mat(0xb58a61),castleLight=mat(0xd6b27d),castleRoof=mat(0x743d36),castleShadow=mat(0x261a27),castleGold=mat(0xe7bd68,.38,.5);
// Long fortified wings leave a wide central entrance completely open.
box(18,8,2.2,castleStone,-14,4,0,castle);
box(18,8,2.2,castleStone,14,4,0,castle);
for(const side of [-1,1]){
 const x=side*14;
 box(18.4,.28,2.5,castleGold,x,8.12,0,castle);
 for(let j=0;j<9;j++)box(1.15,1.05,2.35,castleLight,x-side*8.2+j*2.05,8.65,0,castle);
 // Tall corner towers with layered balconies and red roofs.
 for(const tx of [side*6.2,side*21.8]){
  const tower=new THREE.Group();tower.position.set(tx,0,0);castle.add(tower);
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(2.05,2.45,15,12),castleLight);shaft.position.y=7.5;tower.add(shaft);
  const band=new THREE.Mesh(new THREE.CylinderGeometry(2.35,2.35,.45,12),castleGold);band.position.y=13.1;tower.add(band);
  const roofCap=new THREE.Mesh(new THREE.ConeGeometry(2.65,4.5,8),castleRoof);roofCap.position.y=16.9;tower.add(roofCap);
  const finial=new THREE.Mesh(new THREE.SphereGeometry(.32,10,8),castleGold);finial.position.y=19.2;tower.add(finial);
  for(let k=0;k<4;k++){const slit=box(.28,1.8,.08,castleShadow,tx+(k-1.5)*.72,8.3,1.98,tower);slit.position.x=(k-1.5)*.72;}
 }
}
// Monumental gateway pillars and a golden semicircular arch framing the procession.
for(const x of [-5.1,5.1]){
 box(1.45,8.6,2.8,castleLight,x,4.3,0,castle);
 box(2.1,.35,3.3,castleGold,x,8.65,0,castle);
 for(let k=0;k<3;k++)box(.18,6.8,.12,castleGold,x+(k-1)*.42,4.2,1.43,castle);
}
const arch=new THREE.Mesh(new THREE.TorusGeometry(4.45,.42,12,48,Math.PI),castleGold);
arch.position.set(0,4.35,1.48);castle.add(arch);
const innerArch=new THREE.Mesh(new THREE.TorusGeometry(3.85,.12,8,48,Math.PI),castleLight);
innerArch.position.set(0,4.35,1.52);castle.add(innerArch);
// Open ceremonial doors angled outward so the route remains visible.
for(const side of [-1,1]){
 const door=new THREE.Group();door.position.set(side*4.35,0,1.65);castle.add(door);
 const panel=box(1.1,5.4,.28,castleRoof,side*.55,2.7,0,door);
 for(let y=1;y<5;y+=1.2)box(1.08,.09,.34,castleGold,side*.55,y,0,door);
 for(let x=.2;x<1;x+=.35)box(.08,5.25,.34,castleGold,side*x,2.7,0,door);
 door.rotation.y=side*.72;
}
// Palace rising behind the gate, with a central dome, smaller domes and balconies.
const palace=new THREE.Group();castle.add(palace);palace.position.set(0,0,-13);
box(26,10,9,castleStone,0,5,-1,palace);
box(28,.45,10,castleGold,0,10,-1,palace);
for(let i=-3;i<=3;i++){
 const column=new THREE.Mesh(new THREE.CylinderGeometry(.28,.42,8,12),castleGold);column.position.set(i*3.7,4.2,3.65);palace.add(column);
}
for(let i=-2;i<=2;i++){
 const dome=new THREE.Mesh(new THREE.SphereGeometry(i===0?3.5:2.15,20,14,0,Math.PI*2,0,Math.PI/2),castleGold);
 dome.position.set(i*5.2,10.2,i===0?-1:-1.5);palace.add(dome);
 const spire=new THREE.Mesh(new THREE.ConeGeometry(.42,2.2,8),castleRoof);spire.position.set(i*5.2,13.1,i===0?-1:-1.5);palace.add(spire);
}
box(4.2,6,.3,castleShadow,0,3,3.62,palace);
for(let side of [-1,1]){
 const balcony=box(7,.25,1.1,castleGold,side*8,6,4,palace);
 for(let j=0;j<7;j++)box(.08,.8,.08,castleGold,side*8-3+j,6.5,4,palace);
}


const lamps=[];
function addLamp(x,z){
 const group=new THREE.Group();group.position.set(x,.08,z);scene.add(group);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(.38,.48,.18,16),gold);base.position.y=.09;group.add(base);
 const bowl=new THREE.Mesh(new THREE.CylinderGeometry(.2,.38,.22,16),mat(0x9e633b,.45,.3));bowl.position.y=.27;group.add(bowl);
 const flame=new THREE.Mesh(new THREE.SphereGeometry(.12,12,10),new THREE.MeshBasicMaterial({color:0xffc35c}));flame.scale.set(.65,1.8,.65);flame.position.y=.49;group.add(flame);
 // Avoid hundreds of individual point lights: emissive flames and the shared warm lights provide the glow.
 lamps.push({flame,phase:Math.random()*6.28,baseY:.49});
}
for(let z=8;z>-125;z-=2.6){addLamp(-6.25,z);addLamp(6.25,z)}
for(let side of [-1,1])for(let z=4;z>-90;z-=12){
 const x=side*8.2;const cord=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,4,6),gold);cord.position.set(x,5.4,z);scene.add(cord);
 const lantern=new THREE.Mesh(new THREE.OctahedronGeometry(.48,0),gold);lantern.position.set(x,3.2,z);scene.add(lantern);
}
const petalGeo=new THREE.BufferGeometry(),petalCount=240,petalPositions=new Float32Array(petalCount*3),petalSpeeds=[];
for(let i=0;i<petalCount;i++){petalPositions[i*3]=(Math.random()-.5)*17;petalPositions[i*3+1]=Math.random()*10;petalPositions[i*3+2]=-Math.random()*120+12;petalSpeeds.push(.4+Math.random()*.8)}
petalGeo.setAttribute('position',new THREE.BufferAttribute(petalPositions,3));
const petals=new THREE.Points(petalGeo,new THREE.PointsMaterial({color:0xffad69,size:.12,transparent:true,opacity:.85}));scene.add(petals);
const starsGeo=new THREE.BufferGeometry(),starPos=[];
for(let i=0;i<850;i++)starPos.push((Math.random()-.5)*180,12+Math.random()*55,-Math.random()*160+30);
starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));
scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xffe6b5,size:.22,transparent:true,opacity:.8})));

const chariot=new THREE.Group();scene.add(chariot);chariot.position.set(0,-100,-10);chariot.rotation.y=Math.PI;
box(3.8,.42,2.1,gold,0,.58,0,chariot);box(3.25,.22,.18,roof,0,1.02,1.0,chariot);
for(const x of [-1.55,1.55])for(const z of [-.72,.72])box(.12,.65,.12,gold,x,1.28,z,chariot);
for(let x of [-1.35,1.35]){const wheel=new THREE.Mesh(new THREE.TorusGeometry(.55,.12,10,24),gold);wheel.position.set(x,.65,.85);chariot.add(wheel)}
const canopy=new THREE.Mesh(new THREE.ConeGeometry(1.65,1.8,4),roof);canopy.position.set(0,5.65,-.1);canopy.rotation.y=Math.PI/4;chariot.add(canopy);
const travelers=[];
function addTraveler(x,robeColor,crownColor,scale=1){
 const figure=new THREE.Group();figure.position.set(x,1.18,0);figure.scale.setScalar(scale);chariot.add(figure);
 const robeMat=mat(robeColor,.72),skin=mat(0x9b694c),crownMat=mat(crownColor,.35,.45);
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.28,.42,1.35,12),robeMat);body.position.y=.65;figure.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.27,16,12),skin);head.position.y=1.55;figure.add(head);
 const crown=new THREE.Mesh(new THREE.ConeGeometry(.28,.55,5),crownMat);crown.position.y=1.98;figure.add(crown);
 const eyeMat=mat(0x211714,.5),eyeL=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),eyeMat),eyeR=eyeL.clone();
 eyeL.position.set(-.095,1.59,.235);eyeR.position.set(.095,1.59,.235);figure.add(eyeL,eyeR);
 const tilak=new THREE.Mesh(new THREE.BoxGeometry(.045,.17,.025),mat(0xffe2a0));tilak.position.set(0,1.77,.255);figure.add(tilak);
 const haloRing=new THREE.Mesh(new THREE.TorusGeometry(.43,.045,8,32),gold);haloRing.position.set(0,1.62,-.18);figure.add(haloRing);
 travelers.push({figure,phase:Math.random()*6});
}
addTraveler(-.82,0x315a79,0xe8bd62,1.02);addTraveler(0,0x9b3e38,0xf2d28a,1.08);addTraveler(.82,0xb34f75,0xf2d28a,1.02);

const vanaraSena=new THREE.Group();scene.add(vanaraSena);vanaraSena.position.set(0,-100,-10);vanaraSena.rotation.y=Math.PI;
const vanaraWalkers=[],furMat=mat(0x9a6541),furLight=mat(0xc18450),muzzleMat=mat(0xd5a477),vanaraCloth=[mat(0xb64f35),mat(0x315d72),mat(0x9a7434)];
function makeVanara(x,z,index){
 const g=new THREE.Group();g.position.set(x,0,z);vanaraSena.add(g);const fur=index%2?furMat:furLight,robe=vanaraCloth[index%vanaraCloth.length];
 const torso=new THREE.Mesh(new THREE.CylinderGeometry(.22,.34,.95,9),robe);torso.position.y=.78;g.add(torso);
 const head=new THREE.Group();head.position.set(0,1.48,0);g.add(head);
 const skull=new THREE.Mesh(new THREE.SphereGeometry(.29,12,10),fur);head.add(skull);
 const muzzle=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),muzzleMat);muzzle.position.set(0,-.1,.22);muzzle.scale.set(1,.72,.8);head.add(muzzle);
 for(const side of [-1,1]){const ear=new THREE.Mesh(new THREE.SphereGeometry(.12,8,8),fur);ear.position.set(side*.27,.08,0);head.add(ear)}
 const arms=[];
 for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.27,1.12,0);g.add(arm);const limb=new THREE.Mesh(new THREE.CylinderGeometry(.075,.095,.68,8),fur);limb.position.y=-.29;limb.rotation.z=side*.16;arm.add(limb);const hand=new THREE.Mesh(new THREE.SphereGeometry(.11,8,8),muzzleMat);hand.position.set(side*.08,-.62,.04);arm.add(hand);arms.push(arm)}
 const tailCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.35,-.12),new THREE.Vector3(-.2,.05,-.45),new THREE.Vector3(-.38,.42,-.7),new THREE.Vector3(-.18,.72,-.82)]);
 const tail=new THREE.Mesh(new THREE.TubeGeometry(tailCurve,12,.055,6,false),fur);g.add(tail);vanaraWalkers.push({g,arms,phase:index*.8,tail});return g;
}
for(let row=0;row<4;row++)for(const side of [-1,1])makeVanara(side*(3.65+(row%2)*.35),1.8+row*2.05,row+(side===1?4:0));
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
for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.37,1.62,.02);hanuman.add(arm);const limb=new THREE.Mesh(new THREE.CylinderGeometry(.11,.14,.9,10),hanumanFur);limb.position.y=-.38;limb.rotation.z=side*.18;arm.add(limb);hArms.push(arm)}
const gada=new THREE.Group();gada.position.set(.65,1.25,.22);gada.rotation.z=-.12;hanuman.add(gada);
const gadaHandle=new THREE.Mesh(new THREE.CylinderGeometry(.055,.07,1.55,10),hanumanGold);gadaHandle.position.y=.25;gada.add(gadaHandle);
const gadaHead=new THREE.Mesh(new THREE.SphereGeometry(.34,14,12),hanumanGold);gadaHead.position.y=1.12;gada.add(gadaHead);
const gadaBand=new THREE.Mesh(new THREE.TorusGeometry(.25,.045,8,20),gold);gadaBand.position.y=1.12;gada.add(gadaBand);
const hTailCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.18,.55,-.2),new THREE.Vector3(-.58,.2,-.55),new THREE.Vector3(-.72,.72,-.85),new THREE.Vector3(-.42,1.02,-.95)]);
hanuman.add(new THREE.Mesh(new THREE.TubeGeometry(hTailCurve,18,.075,8,false),hanumanFur));
const playerSpawnZ=camera.position.z;
let processionStarted=false,processionProgress=0,processionStartZ=playerSpawnZ-2.5,returnMomentShown=false;
const processionGlow=new THREE.PointLight(0xffd18a,18,24);processionGlow.position.set(0,4.2,1.5);chariot.add(processionGlow);

const carpet=new THREE.Mesh(new THREE.PlaneGeometry(5.2,150),mat(0x92243a,.8));carpet.rotation.x=-Math.PI/2;carpet.position.set(0,.035,-61);scene.add(carpet);
for(const x of [-2.68,2.68]){const edge=new THREE.Mesh(new THREE.BoxGeometry(.12,.035,150),gold);edge.position.set(x,.055,-61);scene.add(edge)}
for(let z=8;z>-125;z-=3.4)for(const x of [-2.35,2.35]){const rangoli=new THREE.Mesh(new THREE.CircleGeometry(.2,12),gold);rangoli.rotation.x=-Math.PI/2;rangoli.position.set(x,.065,z);scene.add(rangoli)}
const greens=[mat(0x315b37),mat(0x477b43),mat(0x668d4b)],bark=mat(0x60412d),blossoms=[mat(0xffc4a6),mat(0xffd77b),mat(0xf2a9c4)];
for(let side of [-1,1])for(let i=0;i<19;i++){const z=5-i*6.4,x=side*(8+(i%3)*.9),g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.25,2.2,8),bark);trunk.position.y=1.1;g.add(trunk);for(let j=0;j<5;j++){const crown=new THREE.Mesh(new THREE.SphereGeometry(.85+(j%2)*.18,10,8),greens[(i+j)%3]);crown.position.set((j%2-.5)*.62,2.45+(j%3)*.35,(j-2)*.18);g.add(crown)}for(let j=0;j<5;j++){const flower=new THREE.Mesh(new THREE.SphereGeometry(.13,8,8),blossoms[(i+j)%3]);flower.position.set(Math.sin(j*2)*.65,2.3+(j%3)*.35,Math.cos(j*2)*.62);g.add(flower)}}

const people=[],crowdColors=[0x9b4939,0x354d5a,0x98703d,0x6b477d,0x3f725d,0xb07838,0x8b354f,0x486b8c];
for(let i=0;i<96;i++){const side=i%2?1:-1,row=Math.floor(i/2),z=3-row*1.65,x=side*(5.15+(row%4)*.38+Math.random()*.25),g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const robeMat=mat(crowdColors[i%crowdColors.length]),robe=new THREE.Mesh(new THREE.CylinderGeometry(.2,.34,1.12,10),robeMat);robe.position.y=.68;g.add(robe);const head=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),mat(i%3===0?0x754a37:0x9c694c));head.position.y=1.48;g.add(head);const arms=[];for(const sideArm of [-1,1]){const arm=new THREE.Group();arm.position.set(sideArm*.27,1.02,0);g.add(arm);const limb=new THREE.Mesh(new THREE.CylinderGeometry(.065,.085,.64,8),robeMat);limb.position.y=-.28;arm.add(limb);arms.push(arm)}people.push({g,arms,phase:Math.random()*6,cheer:i%3!==0})}

let started=false,locked=false,move={w:false,a:false,s:false,d:false,arrowup:false,arrowdown:false,arrowleft:false,arrowright:false},yaw=0,pitch=0,soundOn=false,audioCtx=null,osc=null;
const intro=document.querySelector('#intro'),hud=document.querySelector('#hud'),welcome=document.querySelector('#welcome'),cross=document.querySelector('#crosshair'),wish=document.querySelector('#wish'),enter=document.querySelector('#enter');
const landing=document.querySelector('#landing');
function startExperience(){
 if(started) return;
 started=true;
 document.body.classList.add('game-active');
 landing.classList.add('landing-exit');
 intro.classList.add('hidden');
 hud.classList.remove('hidden');
 welcome.classList.remove('hidden');
 document.querySelector('#movePad').classList.remove('hidden');
 if(matchMedia('(pointer: coarse)').matches)document.querySelector('#mobileTip').classList.remove('hidden');
 // Request pointer lock directly during the user's click, preserving browser activation.
 try{canvas.requestPointerLock?.()}catch(error){console.info('Pointer lock unavailable; use touch or movement controls.',error)}
}
document.querySelector('#beginJourney').addEventListener('click',startExperience);
enter.addEventListener('click',startExperience);

// Automatic cinematic Ramayana TV slideshow.
const tvSlides=[...document.querySelectorAll('.tv-slide')];
const tvDots=[...document.querySelectorAll('.tv-dots span')];
const tvTitle=document.querySelector('#tvTitle'),tvCaption=document.querySelector('#tvCaption');
let tvIndex=0;
function showTvSlide(index){
 tvIndex=index;
 tvSlides.forEach((slide,i)=>slide.classList.toggle('active',i===index));
 tvDots.forEach((dot,i)=>dot.classList.toggle('active',i===index));
 tvTitle.textContent=tvSlides[index].dataset.title;
 tvCaption.textContent=tvSlides[index].dataset.caption;
}
if(tvSlides.length){
 showTvSlide(0);
 setInterval(()=>{if(!started&&!document.querySelector('#tvLightbox')?.classList.contains('open'))showTvSlide((tvIndex+1)%tvSlides.length)},5600);
 const tvScreen=document.querySelector('.tv-screen'),lightbox=document.querySelector('#tvLightbox');
 const lightboxImage=document.querySelector('#tvLightboxImage'),lightboxTitle=document.querySelector('#tvLightboxTitle');
 const closeLightbox=()=>{lightbox.classList.add('hidden');lightbox.classList.remove('open');lightboxImage.removeAttribute('src');tvScreen?.classList.remove('preview-open');document.body.classList.remove('tv-preview-active')};
 tvScreen?.addEventListener('click',()=>{
  const active=tvSlides[tvIndex],img=active?.querySelector('img');
  if(!img)return;
  lightboxImage.src=img.src;lightboxTitle.textContent=active.dataset.title||img.alt||'Ramayana';
  tvScreen.classList.add('preview-open');
  document.body.classList.add('tv-preview-active');
  lightbox.classList.remove('hidden');lightbox.classList.add('open');
 });
 document.querySelector('#tvLightboxClose')?.addEventListener('click',closeLightbox);
 lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lightbox&&!lightbox.classList.contains('hidden'))closeLightbox()});
}
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===canvas;cross.classList.toggle('hidden',!locked)});
document.addEventListener('mousemove',e=>{if(!locked)return;yaw-=e.movementX*.0022;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.0018,-1.15,1.15)});
function movementKey(key){const k=key.toLowerCase();return ({w:'w',arrowup:'w',s:'s',arrowdown:'s',a:'a',arrowleft:'a',d:'d',arrowright:'d'})[k]||null}
window.addEventListener('keydown',e=>{const k=movementKey(e.key);if(k){move[k]=true;e.preventDefault()}});
window.addEventListener('keyup',e=>{const k=movementKey(e.key);if(k)move[k]=false});
window.addEventListener('blur',()=>{Object.keys(move).forEach(k=>move[k]=false)});
document.querySelectorAll('[data-move]').forEach(button=>{
 const key=button.dataset.move;
 const press=e=>{e.preventDefault();move[key]=true;button.classList.add('pressed');try{button.setPointerCapture(e.pointerId)}catch(_){}};
 const release=e=>{if(e)e.preventDefault();move[key]=false;button.classList.remove('pressed')};
 button.addEventListener('pointerdown',press,{passive:false});
 button.addEventListener('pointerup',release,{passive:false});
 button.addEventListener('pointercancel',release,{passive:false});
 button.addEventListener('lostpointercapture',release);
 button.addEventListener('contextmenu',e=>e.preventDefault());
});
window.addEventListener('pointerup',()=>{document.querySelectorAll('[data-move].pressed').forEach(button=>{move[button.dataset.move]=false;button.classList.remove('pressed')})});
window.addEventListener('blur',()=>document.querySelectorAll('[data-move].pressed').forEach(button=>{move[button.dataset.move]=false;button.classList.remove('pressed')}));
document.querySelector('#explore').addEventListener('click',()=>{welcome.classList.add('hidden');canvas.requestPointerLock?.()});
document.querySelector('#again').addEventListener('click',()=>location.reload());
document.querySelector('#sound').addEventListener('click',async()=>{soundOn=!soundOn;document.querySelector('#sound').textContent='♫ Sound: '+(soundOn?'On':'Off');if(soundOn){audioCtx??=new(window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();if(!osc){osc=audioCtx.createOscillator();const gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=110;gain.gain.value=.018;osc.connect(gain).connect(audioCtx.destination);osc.start()}}else if(audioCtx)await audioCtx.suspend()});
let touchStart=null;
canvas.addEventListener('touchstart',e=>{if(!started||e.touches.length!==1)return;touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
canvas.addEventListener('touchmove',e=>{if(!touchStart)return;const t=e.touches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;yaw-=dx*.003;pitch=THREE.MathUtils.clamp(pitch+dy*.002,-1.1,1.1);touchStart={x:t.clientX,y:t.clientY}},{passive:true});
canvas.addEventListener('touchend',()=>touchStart=null);canvas.addEventListener('touchcancel',()=>touchStart=null);
const celebrationParticles=[];
function celebrate(){
 const colors=[0xffd36b,0xff8c69,0xffe9b0,0xe88bd1,0x9dd9b5],origin=camera.position.clone().add(new THREE.Vector3(-Math.sin(yaw)*5,1.2,-Math.cos(yaw)*5));
 for(let i=0;i<90;i++){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.045+Math.random()*.045,6,6),new THREE.MeshBasicMaterial({color:colors[i%colors.length]}));mesh.position.copy(origin);scene.add(mesh);const velocity=new THREE.Vector3((Math.random()-.5)*5,Math.random()*5+1,(Math.random()-.5)*5);celebrationParticles.push({mesh,velocity,life:2.8})}
 try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume();[523.25,659.25,783.99].forEach((hz,index)=>{const oscBell=audioCtx.createOscillator(),gainBell=audioCtx.createGain(),now=audioCtx.currentTime+index*.12;oscBell.type='sine';oscBell.frequency.value=hz;gainBell.gain.setValueAtTime(.0001,now);gainBell.gain.exponentialRampToValueAtTime(.075,now+.025);gainBell.gain.exponentialRampToValueAtTime(.0001,now+1.1);oscBell.connect(gainBell).connect(audioCtx.destination);oscBell.start(now);oscBell.stop(now+1.15)})}catch(error){console.info('Audio unavailable',error)}
 const button=document.querySelector('#celebrate');button.classList.add('celebrating');setTimeout(()=>button.classList.remove('celebrating'),700);
}
document.querySelector('#celebrate').addEventListener('click',celebrate);
const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;
 lamps.forEach(l=>{const flicker=.85+Math.sin(t*8+l.phase)*.12+Math.sin(t*17+l.phase)*.05;l.flame.scale.y=1.8*flicker});
 for(let i=celebrationParticles.length-1;i>=0;i--){const p=celebrationParticles[i];p.life-=dt;p.velocity.y-=4.8*dt;p.mesh.position.addScaledVector(p.velocity,dt);if(p.life<=0){scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();celebrationParticles.splice(i,1)}}
 const p=petals.geometry.attributes.position;for(let i=0;i<petalCount;i++){let y=p.getY(i)-petalSpeeds[i]*dt;if(y<0)y=9+Math.random()*3;p.setY(i,y);p.setX(i,p.getX(i)+Math.sin(t+i)*dt*.16)}p.needsUpdate=true;
 people.forEach(o=>{if(!o.g||!o.arms||o.arms.length<2)return;o.g.rotation.z=Math.sin(t*1.4+o.phase)*.025;o.arms[0].rotation.z=o.cheer?-.65+Math.sin(t*3+o.phase)*.28:-.18;o.arms[1].rotation.z=o.cheer?.65+Math.sin(t*3+o.phase+1)*.28:.18;o.g.position.y=Math.max(0,Math.sin(t*3.2+o.phase))*.045});
 travelers.forEach(o=>{o.figure.rotation.z=Math.sin(t*1.35+o.phase)*.018;o.figure.position.y=1.18+Math.sin(t*2+o.phase)*.025});
 vanaraWalkers.forEach(o=>{if(!o.g||!o.arms||o.arms.length<2)return;o.g.position.y=Math.abs(Math.sin(t*3+o.phase))*.045;o.arms[0].rotation.x=Math.sin(t*3+o.phase)*.18;o.arms[1].rotation.x=-.35+Math.sin(t*3+o.phase+1)*.18;o.g.rotation.y=Math.sin(t*1.7+o.phase)*.035});
 hArms[0].rotation.z=-.25+Math.sin(t*2.4)*.12;hArms[1].rotation.z=.18+Math.sin(t*2.4+1)*.1;hanuman.rotation.y=Math.sin(t*1.1)*.035;
 if(started&&!processionStarted&&camera.position.z<playerSpawnZ-5){processionStarted=true;processionProgress=0;processionStartZ=playerSpawnZ-2.5;chariot.position.set(0,0,processionStartZ);vanaraSena.position.set(0,0,processionStartZ);chariot.rotation.y=Math.PI;vanaraSena.rotation.y=Math.PI;}
 if(processionStarted&&processionProgress<1){processionProgress=Math.min(1,processionProgress+dt*.035);const ease=processionProgress*processionProgress*(3-2*processionProgress);chariot.position.z=processionStartZ+(-79-processionStartZ)*ease;vanaraSena.position.z=chariot.position.z;chariot.position.y=Math.sin(t*2)*.035;processionGlow.intensity=18+Math.sin(t*5)*3;if(processionProgress>=1&&!returnMomentShown){returnMomentShown=true;document.querySelector('#returnMoment').classList.remove('hidden');setTimeout(()=>document.querySelector('#returnMoment')?.classList.add('hidden'),6500)}}
 if(started){camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),input=new THREE.Vector3();if(move.w)input.add(forward);if(move.s)input.sub(forward);if(move.d)input.add(right);if(move.a)input.sub(right);if(input.lengthSq())input.normalize();if(!processionStarted||processionProgress>=1)camera.position.addScaledVector(input,dt*5.2);camera.position.x=THREE.MathUtils.clamp(camera.position.x,-5.1,5.1);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-120,12);camera.position.y=2.1;if(camera.position.z < -104){wish.classList.remove('hidden');document.exitPointerLock?.()}}
 renderer.render(scene,camera);
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
