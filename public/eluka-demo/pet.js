// Eluka demo: the pet page as the child will see it (locked room v8 art).
// Generated from C:/CC/_worklogs/harjutaja-pet/room9.html by mk_pet.py; regenerate when the room changes.
// LIVE mode (window.ELUKA = {child, name, width, height}): one room, the real Tallinn clock, real hours,
// state saved only in this browser (localStorage), and Tarkus fed by the child's real exercises
// (read-only GET /api/parent/history). It writes nothing to the server.
(function(){
if(!document.getElementById('rooms')||document.getElementById('rooms').childNodes.length)return;
// LIVE = the child's own pet page (one room, real clock, real hours, saved in this browser).
var CFG=window.ELUKA||{},LIVE=!!CFG.child;
var WW=60,VW=36,H=80,C=4,CAM=0,HC=2;
// LIVE fills the screen. ZOOM < 1 draws everything smaller: the view shows more of the room's width
// (up to all 60 cells) and the room gets extra floor rows at the bottom, so the furniture keeps its
// places and the egg/baby gets more space. The status bar stretches to the same width.
// Kaur 2026-11-05: the room at 75 %; the status bar keeps its full size (HS) so it stays readable.
var S=1.45,ZOOM=0.75,HS=S;
if(LIVE){var avW=CFG.width||360,avH=CFG.height||760;ZOOM=CFG.zoom||ZOOM;var S0=avH/(H*C+17*HC);S=Math.max(1,S0*ZOOM);
 HS=Math.max(1,Math.min(S0,avW/(72*HC)));
 // Kaur 2026-11-05: "slightly wider" = the whole 60-cell room across the screen (nothing cut at the
 // sides), as long as its 80 rows still fit above the status bar; otherwise the zoom rule below.
 var SW=avW/(WW*C);
 if(!CFG.zoom&&SW>=1&&SW*C*80+17*HC*HS<=avH){S=SW;VW=WW;}
 else{VW=Math.min(WW,Math.max(36,Math.floor(avW/(C*S))));S=Math.max(1,Math.min(S,avW/(VW*C)));
 // the whole room already fits across: zoom in just enough to fill the width
 // (a tablet: no wider than the 80 rows allow above the status bar; the room is then centred)
 if(VW===WW)S=Math.max(S,Math.min(avW/(WW*C),(avH-17*HC*HS)/(80*C)));}
 H=Math.max(80,Math.floor((avH-17*HC*HS)/(C*S)));}
// SX/SY/HSX: whole cells leave a few pixels; stretch by that last 1-3 % so everything meets the screen edges.
var HUDH=17*HC*HS,HUW=LIVE?Math.max(72,Math.floor(avW/(HC*HS))):VW*C/HC,HX=(HUW-72)/2,
 HSX=LIVE?avW/(HUW*HC):S,SX=LIVE?Math.max(S,Math.min(S*1.04,avW/(VW*C))):S,
 SY=LIVE?Math.max(S,Math.min(S*1.04,(avH-HUDH)/(H*C))):S;
var EGGS={
 kiur:['................','......kkkk......','.....kggggk.....','....kggggggk....','...kgggbbgggk...','...kgggbbgggk...','..kgggggggggbk..','..kggggggggbbk..','..kgggggggggbk..','..kggggggggggk..','..kgbbgggggggk..','..kgbbggggggk...','...kgggggggk....','...kkgggggkk....','.....kkkkk......','................'],
 kirsi:['................','......kkkk......','.....kcccck.....','....kcccccck....','...kccllcccck...','...kccllcccck...','..kccccccppcck..','..kccccccppcck..','..kcccccccccck..','..kcccccccccck..','..kccccccllcck..','..kccccccllcck..','...kccppcccck...','...kkcppccckk...','.....kkkkkk.....','................']};
var EPAL={kiur:{k:'#2f343b',g:'#a0a8b2',b:'#3b82f6'},kirsi:{k:'#3b2a4a',c:'#fff1e0',l:'#c7a6ee',p:'#f6a8c8'}};
// grey copies of the egg colours, used once the egg has gone to the stars
function greyOf(hex){var n=parseInt(hex.slice(1),16),l=Math.round(((n>>16)*0.3+((n>>8)&255)*0.59+(n&255)*0.11)*0.8+30),h=('0'+Math.min(255,l).toString(16)).slice(-2);return '#'+h+h+h;}
var GREY={};Object.keys(EPAL).forEach(function(k){GREY[k]={};Object.keys(EPAL[k]).forEach(function(c){GREY[k][c]=greyOf(EPAL[k][c]);});});
var ROOMS=[
 {id:'kiur',name:'Kiuri tuba',who:'Kiuri',mirror:false,wall:'#c9d9e8',wall2:'#b2c7db',trim:'#7f9bb6',floor:'#8b5a3c',floor2:'#6f4530',curt:'#34507a',curt2:'#28406a',sofa:'#4f8a4b',sofa2:'#3c6b39',sofa3:'#6fae6a',rug:'#5d7f66',rug2:'#3f5a47',rug3:'#86a88d',media:'tv'},
 {id:'kirsi',name:'Kirsi tuba',who:'Kirsi',mirror:true,wall:'#f7d6e0',wall2:'#efc1d1',trim:'#d896ae',floor:'#d9a877',floor2:'#bf8c5c',curt:'#b9a0e0',curt2:'#9f86cc',sofa:'#f4a6c4',sofa2:'#d77fa7',sofa3:'#f9c6da',rug:'#c9a4e3',rug2:'#a07cc4',rug3:'#f6c6dc',media:'radio'}];
if(LIVE)ROOMS=ROOMS.filter(function(r){return r.id===CFG.child;});
var TIMES=[
 {id:'hommik',label:'Hommik',sky:['#f6a57f','#ffe0a8'],sun:{y:15,x:24,c:'#ffb14a'},amb:'rgba(255,150,70,0.13)'},
 {id:'paev',label:'Päev',sky:['#73c0f0','#b8e4fb'],sun:{y:9,x:29,c:'#ffe066'},amb:null,beam:'#fff3a0'},
 {id:'ohtu',label:'Õhtu',sky:['#5f4a8f','#f08a6a'],sun:{y:17,x:30,c:'#ff7b54'},amb:'rgba(110,50,120,0.26)'},
 {id:'oo',label:'Öö',sky:['#121a3a','#222b58'],moon:true,amb:'rgba(10,14,40,0.62)'}];
// v8: the nest sits in the middle of the room and the view starts centred on it
var SPOTS={nest:{x:22,y:33},couch:{x:41,y:40}},FLOOR_MIN=31,CAM0=(WW-VW)/2;
var STARS=[];for(var i=0;i<34;i++)STARS.push([(i*7)%15,(i*11+3)%WW]);
var BOX={x:1,y:68,w:11,h:9};
// Pacing in the real app: one "step" is 8 hours. A full need lasts 2-3 days without care
// (Soojus ~2.5 days, Tuju ~3, Tarkus ~3.5, so one free day is fine). 8 h away = one small step down.
// A need at zero for a whole day (24 h) ends the egg's life; the danger warning comes a day before that.
var STEP={warm:-14,mood:-12,tark:-10,moodNoLearn:-6,zeroDeathH:24,hatchDays:7,boost:0.2};
function clockIdx(){var h=Number(new Intl.DateTimeFormat('en-GB',{hour:'2-digit',hourCycle:'h23',timeZone:'Europe/Tallinn'}).format(new Date()))%24;return h>=6&&h<10?0:h<17?1:h<21?2:3;}
var time=LIVE?clockIdx():1,timeFixed=!LIVE,state={},MEM=[],LOG=[],AWAY_MIN=8;
function clamp(v){return Math.max(0,Math.min(100,v));}
function dayOf(st){return Math.floor(st.hours/24)+1;}
function danger(st){return !st.dead&&(st.warmth<=0.5||st.mood<=0.5||st.tarkus<=0.5);}
function initEgg(r,st,first){
 st.warmth=first?65:70;st.mood=first?70:75;st.tarkus=first?(r.id==='kiur'?55:45):60;st.growth=first?(r.id==='kiur'?42:30):0;
 st.hours=first?(r.id==='kiur'?48:24):0;st.zeroH=0;st.dead=false;st.deathT=0;st.away=null;st.warned=false;st.bornT=performance.now();
 st.egg={x:SPOTS.nest.x,y:SPOTS.nest.y,spot:'nest'};st.move=null;st.drag=null;st.wakeT=-1e9;st.wakes=[];st.angry=false;
 st.items={hat:{where:'hook'},blanket:{where:'on'},bottle:{where:'floor',x:24,y:63},teddy:{where:'floor',x:48,y:38}};}
ROOMS.forEach(function(r){var st=state[r.id]={cam:CAM0,curt:!TIMES[time].moon,lamp:false,night:false,media:0,boxOpen:false,wob:0,hearts:[],ring:null,pan:null,last:0,n:1,tapBank:15,r:r,seenId:null,wall:0};
 initEgg(r,st,!LIVE);if(LIVE)load(r,st);});
// ---- Saving (LIVE): the whole pet lives in this browser's storage, nothing goes to the server.
function key(r){return 'eluka-demo:'+r.id;}
function save(r,st){if(!LIVE)return;var it={};ITEMS.forEach(function(id){var o=st.items[id];if(o.drag){it[id]={where:o.drag.from==='carried'?'floor':o.drag.from,x:o.drag.x0,y:o.drag.y0};return;}var w=o.where==='carried'?'floor':o.where;it[id]={where:w,x:o.x,y:o.y};});
 var e=st.drag?{x:st.drag.ex0,y:st.drag.ey0,spot:st.egg.spot}:st.move?{x:st.move.x1,y:st.move.y1,spot:st.move.spot}:{x:st.egg.x,y:st.egg.y,spot:st.egg.spot};
 try{localStorage.setItem(key(r),JSON.stringify({v:1,warmth:st.warmth,mood:st.mood,tarkus:st.tarkus,growth:st.growth,hours:st.hours,zeroH:st.zeroH,dead:st.dead,lived:st.lived,warned:st.warned,
  egg:e,items:it,curt:st.curt,lamp:st.lamp,night:st.night,boxOpen:st.boxOpen,n:st.n,mem:MEM,log:LOG.slice(-6),seenId:st.seenId,tapBank:st.tapBank,wall:st.wall||Date.now()}));}catch(x){}}
function load(r,st){var d=null;try{d=JSON.parse(localStorage.getItem(key(r))||'null');}catch(x){}
 if(!d||d.v!==1||!d.egg||typeof d.egg.x!=='number'||typeof d.egg.y!=='number'||!d.items||typeof d.items!=='object'){st.wall=Date.now();return;}
 ['warmth','mood','tarkus','growth','hours','zeroH','warned','curt','lamp','night','boxOpen','n','seenId','tapBank','lived'].forEach(function(k){if(d[k]!=null&&(typeof st[k]!=='number'||(typeof d[k]==='number'&&isFinite(d[k]))))st[k]=d[k];});
 st.egg={x:d.egg.x,y:d.egg.y,spot:d.egg.spot};Object.keys(st.items).forEach(function(id){var o=d.items[id];if(o&&['on','box','hook','floor'].indexOf(o.where)>=0)st.items[id]={where:o.where,x:Number(o.x)||0,y:Number(o.y)||0};});
 MEM=Array.isArray(d.mem)?d.mem:[];LOG=Array.isArray(d.log)?d.log:[];st.wall=d.wall||Date.now();
 if(d.dead){st.dead=true;st.deathT=-1e9;st.loadedDead=true;}}

function sx(r,x,w){return (r.mirror?WW-x-(w||1):x)-CAM;}
function R(ctx,r,x,y,w,h,c,a){ctx.globalAlpha=a==null?1:a;ctx.fillStyle=c;ctx.fillRect(Math.round(sx(r,x,w)*C),y*C,w*C,h*C);ctx.globalAlpha=1;}
function P(ctx,r,x,y,c,a){R(ctx,r,x,y,1,1,c,a);}
function sprite(ctx,r,rows,x,y,pal,a){var w=rows[0].length,bx=sx(r,x,w);ctx.globalAlpha=a==null?1:a;
 for(var yy=0;yy<rows.length;yy++)for(var xx=0;xx<w;xx++){var ch=rows[yy][xx];if(ch==='.')continue;ctx.fillStyle=pal[ch];ctx.fillRect(Math.round((bx+xx)*C),(y+yy)*C,C,C);}ctx.globalAlpha=1;}

function drawWall(ctx,r){
 R(ctx,r,0,0,WW,44,r.wall);R(ctx,r,0,0,WW,2,r.wall2);
 for(var y=5;y<34;y+=5)for(var x=(y/5%2)*2;x<WW;x+=4)P(ctx,r,x,y,r.wall2);
 R(ctx,r,0,36,WW,8,r.wall2);R(ctx,r,0,36,WW,1,r.trim);R(ctx,r,0,43,WW,1,r.trim);
 R(ctx,r,0,44,WW,H-44,r.floor);
 for(var y2=48;y2<H;y2+=5){R(ctx,r,0,y2,WW,1,r.floor2);for(var x2=(y2%2)*6;x2<WW;x2+=12)R(ctx,r,x2,y2-4,1,4,r.floor2);}
}
function drawWindow(ctx,r,st){
 var T=TIMES[time];
 R(ctx,r,21,6,13,15,'#f5efe6');R(ctx,r,22,7,11,6,T.sky[0]);R(ctx,r,22,13,11,7,T.sky[1]);
 if(T.sun){var s=T.sun;R(ctx,r,s.x-1,s.y-1,3,3,s.c);P(ctx,r,s.x-2,s.y,s.c);P(ctx,r,s.x+2,s.y,s.c);P(ctx,r,s.x,s.y-2,s.c);}
 if(T.moon){R(ctx,r,28,9,3,3,'#f3eccb');P(ctx,r,29,9,T.sky[0]);P(ctx,r,24,8,'#ffffff');P(ctx,r,26,12,'#ffffff');P(ctx,r,31,15,'#ffffff');P(ctx,r,23,16,'#ffffff');}
 if(time===1){R(ctx,r,23,15,3,1,'#ffffff');R(ctx,r,24,14,2,1,'#ffffff');}
 R(ctx,r,27,7,1,13,'#f5efe6');R(ctx,r,22,13,11,1,'#f5efe6');R(ctx,r,20,21,15,1,'#e4dccd');R(ctx,r,20,5,15,1,'#3a3a3a');
 if(st.curt){R(ctx,r,19,6,3,17,r.curt);R(ctx,r,20,6,1,17,r.curt2);R(ctx,r,32,6,3,17,r.curt);R(ctx,r,33,6,1,17,r.curt2);}
 else{R(ctx,r,21,6,13,16,r.curt);for(var x=22;x<34;x+=2)R(ctx,r,x,6,1,16,r.curt2);}
}
function drawDecor(ctx,r){
 R(ctx,r,3,14,13,1,r.trim);
 if(r.id==='kiur'){
  R(ctx,r,4,10,4,4,'#8b5a3c');R(ctx,r,4,10,4,1,'#5fae4a');P(ctx,r,5,11,'#5fae4a');P(ctx,r,7,11,'#5fae4a');
  R(ctx,r,9,11,3,3,'#8e959c');P(ctx,r,10,12,'#6b737a');
  R(ctx,r,12,11,4,3,'#a0703f');R(ctx,r,12,11,4,1,'#7a5230');P(ctx,r,13,12,'#ffd54a');P(ctx,r,14,12,'#ffd54a');
  R(ctx,r,4,18,9,10,'#2d3a4a');R(ctx,r,5,19,7,1,'#9fb3c6');P(ctx,r,5,20,'#9fb3c6');P(ctx,r,11,20,'#9fb3c6');for(var i=0;i<6;i++)P(ctx,r,8,20+i,'#a0703f');
  R(ctx,r,40,20,16,1,r.trim);[[41,'#5fae4a'],[45,'#8e959c'],[49,'#3b82f6'],[53,'#d9534f']].forEach(function(b){R(ctx,r,b[0],17,3,3,b[1]);P(ctx,r,b[0]+1,18,'#ffffff',0.35);});
  drawClock(ctx,r);
 }else{
  R(ctx,r,5,9,3,2,'#f2c94c');R(ctx,r,5,10,3,2,'#fde0c8');P(ctx,r,5,10,'#f2c94c');P(ctx,r,7,10,'#f2c94c');R(ctx,r,4,12,5,2,'#e06a9a');
  P(ctx,r,10,11,'#ef5b7b');P(ctx,r,12,11,'#ef5b7b');R(ctx,r,10,12,3,1,'#ef5b7b');P(ctx,r,11,13,'#ef5b7b');
  R(ctx,r,14,12,2,2,'#7cc4f2');P(ctx,r,14,11,'#8fd16a');P(ctx,r,15,10,'#f6a8c8');
  R(ctx,r,4,18,9,10,'#fdf6e8');var rc=['#ef5b7b','#f2a33d','#f2c94c','#8fd16a','#7cc4f2'];for(var k=0;k<5;k++)R(ctx,r,5,20+k,7,1,rc[k]);
  R(ctx,r,5,25,2,2,'#ffffff');R(ctx,r,10,25,2,2,'#ffffff');
  for(var g=40;g<57;g+=4){P(ctx,r,g,9+(g%8?1:0),'#ef5b7b');P(ctx,r,g+1,9+(g%8?1:0),'#ef5b7b');P(ctx,r,g,10+(g%8?1:0),'#ef5b7b');P(ctx,r,g+1,10+(g%8?1:0),'#ef5b7b');P(ctx,r,g+2,8,'#d896ae');}
  R(ctx,r,45,15,7,11,'#f2c94c');R(ctx,r,46,16,5,9,'#cfe8f7');R(ctx,r,47,17,1,3,'#ffffff',0.7);
 }
}
// v9: the wall clock shows the real time in Tallinn (read once a second)
var CLK={t:0,h:0,m:0};
function clockNow(){var n=Date.now();if(n-CLK.t>1000){CLK.t=n;try{new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:'Europe/Tallinn'}).formatToParts(new Date()).forEach(function(p){if(p.type==='hour')CLK.h=Number(p.value)%24;if(p.type==='minute')CLK.m=Number(p.value);});}catch(x){var d=new Date();CLK.h=d.getHours();CLK.m=d.getMinutes();}}return CLK;}
function drawClock(ctx,r){var O='#2f343b',F='#f5efe6',cx=47,cy=9;
 R(ctx,r,45,5,5,1,O);P(ctx,r,44,6,O);P(ctx,r,50,6,O);R(ctx,r,45,6,5,1,F);R(ctx,r,43,7,1,5,O);R(ctx,r,51,7,1,5,O);R(ctx,r,44,7,7,5,F);
 P(ctx,r,44,12,O);P(ctx,r,50,12,O);R(ctx,r,45,12,5,1,F);R(ctx,r,45,13,5,1,O);
 [[47,6],[50,9],[47,12],[44,9]].forEach(function(t){P(ctx,r,t[0],t[1],'#b9b2a6');});
 var k=clockNow(),am=k.m/60*2*Math.PI,ah=((k.h%12)+k.m/60)/12*2*Math.PI;
 function hand(a,len,c){for(var i=1;i<=len;i++)P(ctx,r,cx+Math.round(i*Math.sin(a)),cy-Math.round(i*Math.cos(a)),c);}
 hand(ah,2,O);hand(am,3,'#d9534f');P(ctx,r,cx,cy,O);}
function drawLamp(ctx,r,on){
 R(ctx,r,17,14,1,29,'#3a3a3a');R(ctx,r,15,42,5,2,'#3a3a3a');var c=on?'#ffe58a':'#cfc8bb';
 R(ctx,r,15,10,5,1,c);R(ctx,r,14,11,7,1,c);R(ctx,r,13,12,9,2,c);R(ctx,r,13,13,9,1,on?'#f2c94c':'#b0a99c');
}
// v8: the TV / radio moved to the far wall corner, so the nest can sit in the middle
function drawMedia(ctx,r,st,now){
 var on=st.media>now;
 if(r.media==='tv'){R(ctx,r,3,33,10,8,'#1f2328');var sc=on?['#7cc4f2','#8fd16a','#f6a8c8','#ffe066'][Math.floor(now/250)%4]:'#3a4654';
  R(ctx,r,4,34,8,6,sc);if(on)R(ctx,r,5,35,3,2,'#ffffff',0.5);R(ctx,r,6,41,4,1,'#1f2328');R(ctx,r,4,42,8,2,'#7a5230');}
 else{P(ctx,r,11,33,'#3a3a3a');P(ctx,r,10,34,'#3a3a3a');P(ctx,r,9,35,'#3a3a3a');
  R(ctx,r,3,36,10,7,'#2a9d8f');R(ctx,r,4,37,4,4,'#1e6f66');for(var y=37;y<41;y+=2)for(var x=4;x<8;x+=2)P(ctx,r,x,y,'#2a9d8f');
  R(ctx,r,9,37,3,1,on?'#ffe066':'#c9d6d4');P(ctx,r,10,39,'#f6a8c8');R(ctx,r,3,43,10,1,'#7a5230');}
}
function drawCouch(ctx,r){
 R(ctx,r,39,45,19,10,r.sofa);R(ctx,r,39,45,19,1,r.sofa3);for(var x=45;x<57;x+=6)R(ctx,r,x,46,1,9,r.sofa2);
 R(ctx,r,38,49,3,14,r.sofa2);R(ctx,r,56,49,3,14,r.sofa2);R(ctx,r,38,49,3,1,r.sofa3);R(ctx,r,56,49,3,1,r.sofa3);
 R(ctx,r,41,55,15,6,r.sofa);R(ctx,r,41,55,15,1,r.sofa3);R(ctx,r,41,60,15,1,r.sofa2);
 R(ctx,r,39,63,2,2,'#3a3a3a');R(ctx,r,56,63,2,2,'#3a3a3a');
 if(r.id==='kirsi'){R(ctx,r,42,51,5,4,'#c7a6ee');R(ctx,r,43,52,3,2,'#ffffff',0.4);R(ctx,r,50,51,5,4,'#fde8d0');P(ctx,r,52,52,'#ef5b7b');}
 else{R(ctx,r,42,51,5,4,'#3b82f6');R(ctx,r,50,51,5,4,'#8b5a3c');R(ctx,r,50,51,5,1,'#5fae4a');}
}
function rugAt(){return {x:16,y:H>90?Math.round((66+H)/2)-6:58};}
function drawRug(ctx,r){var g=rugAt(),dx=g.x-6,dy=g.y-58;
 R(ctx,r,6+dx,58+dy,28,12,r.rug2);R(ctx,r,7+dx,59+dy,26,10,r.rug);
 for(var y=60;y<68;y++)for(var x=8;x<32;x++)if((x+y)%4===0&&(x-y+64)%4===0)P(ctx,r,x+dx,y+dy,r.rug3);
 R(ctx,r,8+dx,60+dy,24,1,r.rug3,0.5);R(ctx,r,8+dx,67+dy,24,1,r.rug3,0.5);
 for(var x2=7;x2<33;x2+=2){P(ctx,r,x2+dx,70+dy,r.rug3);}
}
var NL={x:51,y:25};
function drawNightLight(ctx,r,on){var x=NL.x,y=NL.y;
 R(ctx,r,x-2,y+5,9,1,r.trim);P(ctx,r,x-1,y+6,r.trim);P(ctx,r,x+5,y+6,r.trim);
 if(r.id==='kiur'){R(ctx,r,x,y+1,4,4,'#3a3a3a');R(ctx,r,x+1,y+2,2,2,on?'#ffb347':'#6b737d');R(ctx,r,x,y,4,1,'#5a5a5a');}
 else{R(ctx,r,x,y+1,4,4,on?'#ffe58a':'#d8d0b0');P(ctx,r,x+3,y+1,r.wall);R(ctx,r,x,y+4,4,1,'#c7a6ee');}
}
var BOXPAL={kiur:{k:'#2a2f38',W:'#a0703f',b:'#3b82f6',L:'#8b5a3c',S:'#ffd54a',D:'#3a2a1c'},kirsi:{k:'#3b2a4a',W:'#f4a6c4',b:'#c7a6ee',L:'#e98fb8',S:'#ffffff',D:'#7a4a66'}};
var BOX_BODY=['kkkkkkkkkkk','kWWWWWWWWWk','kWbbbbbbbWk','kWWWWSWWWWk','kWWWSSSWWWk','kWWWWSWWWWk','kWbbbbbbbWk','kkkkkkkkkkk'];
var LID=['.kkkkkkkkk.','kLLLLLLLLLk','kkkkkkkkkkk'];
function drawBox(ctx,r,st){var pal=BOXPAL[r.id];
 if(st.boxOpen){sprite(ctx,r,LID,BOX.x,BOX.y-4,pal);R(ctx,r,BOX.x+1,BOX.y,9,2,pal.D);sprite(ctx,r,BOX_BODY,BOX.x,BOX.y+1,pal);}
 else{sprite(ctx,r,LID,BOX.x,BOX.y-2,pal);sprite(ctx,r,BOX_BODY,BOX.x,BOX.y+1,pal);}
}
function drawNest(ctx,r,part){
 // v9: a woven straw bowl, outlined so it reads on any floor, with a soft cushion inside
 var nx=SPOTS.nest.x-3,ny=SPOTS.nest.y,O='#3a2414',Lt='#e8b85a',Md='#c48a3a',Dk='#8a5a2b',Hi='#f6d98a',cu=r.id==='kirsi'?['#f4a6c4','#e07fae']:['#7fa9de','#5b86c0'];
 function weave(x,y){return (x*3+y)%7===0?Dk:(x+y)%2?Lt:Md;}
 // wider and deeper than the blanket the egg wears, so the bowl still shows around it
 if(part==='back'){
  R(ctx,r,nx+1,ny+9,20,1,O);P(ctx,r,nx,ny+10,O);P(ctx,r,nx+21,ny+10,O);
  for(var x=nx+1;x<nx+21;x++)P(ctx,r,x,ny+10,weave(x,ny+10));
  P(ctx,r,nx-2,ny+11,O);P(ctx,r,nx-1,ny+11,O);P(ctx,r,nx+22,ny+11,O);P(ctx,r,nx+23,ny+11,O);R(ctx,r,nx,ny+11,22,1,cu[0]);
  P(ctx,r,nx-3,ny+12,O);P(ctx,r,nx+24,ny+12,O);P(ctx,r,nx-2,ny+12,Md);P(ctx,r,nx+23,ny+12,Md);R(ctx,r,nx-1,ny+12,24,1,cu[1]);
  P(ctx,r,nx+4,ny+8,Lt);P(ctx,r,nx+16,ny+8,Lt);P(ctx,r,nx+17,ny+7,Lt);}
 else{
  R(ctx,r,nx-1,ny+20,24,1,'#000000',0.25);
  [[-3,24],[-3,24],[-3,24],[-2,23],[-2,23],[-1,22]].forEach(function(rw,i){var y=ny+13+i;P(ctx,r,nx+rw[0],y,O);P(ctx,r,nx+rw[1],y,O);
   for(var x=nx+rw[0]+1;x<nx+rw[1];x++)P(ctx,r,x,y,i===0?Hi:i===5?Dk:weave(x,y));});
  R(ctx,r,nx,ny+19,22,1,O);
  P(ctx,r,nx-4,ny+12,Lt);P(ctx,r,nx-5,ny+13,Md);P(ctx,r,nx+25,ny+12,Lt);P(ctx,r,nx+26,ny+13,Md);P(ctx,r,nx+6,ny+20,Lt);P(ctx,r,nx+15,ny+20,Md);}
}
function rimCell(g,x,y){function emp(xx,yy){return yy<0||xx<0||xx>15||g[yy][xx]==='.'||g[yy][xx]==='k';}return emp(x,y-1)||emp(x-1,y)||emp(x+1,y);}
var CRYSTALS=[[5,3],[10,4],[7,7]];
function drawEgg(ctx,r,st,lean,fx,now){var g=EGGS[r.id],pal=st.dead?GREY[r.id]:EPAL[r.id],ex=Math.round(st.egg.x),ey=Math.round(st.egg.y)+fx.dy,bx=sx(r,ex,16)+fx.dx;
 var alpha=1;if(st.dead){var d=now-st.deathT;alpha=d<1500?1:Math.max(0,1-(d-1500)/2200);}
 var born=now-st.bornT;if(born<900)alpha*=born/900;
 if(alpha<=0)return;
 var dull=!st.dead&&st.mood<30,cold=!st.dead&&st.warmth<35,frost=!st.dead&&st.warmth<15;
 for(var y=0;y<16;y++){var s=lean*(y<4?2:y<9?1:0);for(var x=0;x<16;x++){var ch=g[y][x];if(ch==='.')continue;var X=Math.round((bx+x+s)*C),Y=(ey+y)*C;
  ctx.globalAlpha=alpha;ctx.fillStyle=pal[ch];ctx.fillRect(X,Y,C,C);
  if(ch==='k')continue;
  // unhappy: the colours go a little dull (softer than v7)
  if(dull){ctx.globalAlpha=alpha*0.18;ctx.fillStyle='#3a4058';ctx.fillRect(X,Y,C,C);}
  // cold: a bluish tint, stronger when very cold
  if(cold){ctx.globalAlpha=alpha*(frost?0.24:0.1);ctx.fillStyle='#8cc4ff';ctx.fillRect(X,Y,C,C);}
  // very cold: a pale icy rim just inside the top of the shell
  if(frost&&y<8&&rimCell(g,x,y)){ctx.globalAlpha=alpha*0.9;ctx.fillStyle='#dff2ff';ctx.fillRect(X,Y,C,C);}}}
 // very cold: two or three ice crystals that twinkle in turn
 if(frost){CRYSTALS.forEach(function(c,i){var ph=Math.floor(now/700+i*1.3)%3;if(ph===2)return;var s=lean*(c[1]<4?2:c[1]<9?1:0),X=bx+c[0]+s,Y=ey+c[1];
  ctx.globalAlpha=alpha;ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(X*C),Y*C,C,C);
  if(ph===0){ctx.fillStyle='#bfe3ff';[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(o){ctx.fillRect(Math.round((X+o[0])*C),(Y+o[1])*C,C,C);});}});}
 ctx.globalAlpha=1;}
function fxOf(st,now){var o={dx:0,dy:0},g=now-st.wakeT;if(st.dead)return o;
 if(g>=0&&g<1800){if(g<260)o.dy=-1;if(g<1100)o.dx=Math.floor(g/80)%2?1:-1;return o;}
 if(st.warmth<35){var c=now%2600;if(c<650)o.dx=Math.floor(c/70)%2;}
 return o;}
function Q(ctx,x,y,c,a){ctx.globalAlpha=a==null?1:a;ctx.fillStyle=c;ctx.fillRect(x*C,y*C,C,C);ctx.globalAlpha=1;}
var CLOUD=['..cc..cc..','.cccccccc.','cccccccccc','.dddddddd.'];
var SCRIBBLE=['.xxxx..','x..x.x.','.xx.xxx','x.xx..x','.x..xx.'];
var BANG=['wwwww','wrrrw','wrrrw','wwrww','wwwww','wwrww','wwwww','..w..'];
function drawMoodFx(ctx,r,st,now,fx){if(st.drag||st.move||st.dead)return;
 var ex=sx(r,Math.round(st.egg.x),16)+fx.dx,ey=Math.round(st.egg.y)+fx.dy,m=st.mood;
 if(m<50&&m>=30){var t=now%4200;if(t<1800){var yy=ey+5+Math.floor(t/1800*7),a=t>1400?(1800-t)/400:1;Q(ctx,ex+4,yy,'#9fd6ff',a);Q(ctx,ex+4,yy+1,'#4a9fe0',a);}}
 if(m<30&&m>=15){[[5,2],[8,3],[11,2]].forEach(function(l){for(var i=0;i<l[1];i++)Q(ctx,ex+l[0],ey-4+i,'#6f86b8',0.85);});
  var t2=now%5200;if(t2<1800){var px=ex+(r.mirror?1:14)+(r.mirror?-1:1)*Math.floor(t2/600),py=ey+3-Math.floor(t2/700),a2=1-t2/1800;Q(ctx,px,py,'#e6e9f0',a2);Q(ctx,px+1,py,'#e6e9f0',a2);Q(ctx,px,py-1,'#e6e9f0',a2*0.7);}}
 if(m<15){var cx=ex+3+(Math.floor(now/1300)%2),cy=ey-8;
  for(var y=0;y<CLOUD.length;y++)for(var x=0;x<10;x++){var ch=CLOUD[y][x];if(ch!=='.')Q(ctx,cx+x,cy+y,ch==='c'?'#9aa3b2':'#6b7380');}
  [1,4,7].forEach(function(d,i){var k=Math.floor((now+i*230)/110)%6;if(k<4)Q(ctx,cx+d,cy+4+k,'#7cc4f2',0.9);});}
 if(st.warmth<35&&now%2600<650){Q(ctx,ex,ey+6,'#9cd3ff');Q(ctx,ex-1,ey+6,'#9cd3ff');Q(ctx,ex+1,ey+9,'#9cd3ff');Q(ctx,ex,ey+9,'#9cd3ff');
  Q(ctx,ex+15,ey+6,'#9cd3ff');Q(ctx,ex+16,ey+6,'#9cd3ff');Q(ctx,ex+14,ey+9,'#9cd3ff');Q(ctx,ex+15,ey+9,'#9cd3ff');}
 // danger: a pulsing "!" bubble beside the egg
 if(danger(st)){var on=Math.floor(now/450)%2,bxx=ex+(r.mirror?13:-2),byy=ey-3-(on?1:0);
  for(var y4=0;y4<BANG.length;y4++)for(var x4=0;x4<5;x4++){var c4=BANG[y4][x4];if(c4!=='.')Q(ctx,bxx+x4,byy+y4,c4==='w'?'#ffffff':'#e5383b',on?1:0.8);}}
 var g=now-st.wakeT;if(g>=0&&g<1900){var a3=g>1400?(1900-g)/500:1,sides=st.angry?[r.mirror?-1:10,r.mirror?10:-1]:[r.mirror?0:10];
  sides.forEach(function(ox,i){var oy=ey-7+(i?2:0)+(Math.floor(g/200)%2);for(var y=0;y<5;y++)for(var x=0;x<7;x++)if(SCRIBBLE[y][x]==='x')Q(ctx,ex+ox+x,oy+y,'#d9434f',a3);});}
}
// The soft ending: the egg greys, a small star leaves it and floats out through the window.
function drawDeath(ctx,r,st,now){if(!st.dead)return;var d=now-st.deathT;
 var x0=sx(r,Math.round(st.egg.x),16)+8,y0=Math.round(st.egg.y)+6,x1=sx(r,27,1),y1=11;
 if(d>=1200&&d<4800){var k=Math.min(1,(d-1200)/3000),e=k*k*(3-2*k),x=x0+(x1-x0)*e+Math.sin(k*Math.PI*3)*1.5,y=y0+(y1-y0)*e;
  for(var t=1;t<=3;t++){var kt=Math.max(0,k-t*0.05),et=kt*kt*(3-2*kt);Q(ctx,Math.round(x0+(x1-x0)*et),Math.round(y0+(y1-y0)*et),'#ffe58a',0.5-t*0.13);}
  var X=Math.round(x),Y=Math.round(y),tw=Math.floor(d/160)%2;
  Q(ctx,X,Y,'#ffffff');[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(o){Q(ctx,X+o[0],Y+o[1],'#ffd54a');});
  if(tw)[[2,0],[-2,0],[0,2],[0,-2]].forEach(function(o){Q(ctx,X+o[0],Y+o[1],'#ffe58a',0.7);});}
 else if(d>=4800){var tw2=Math.floor(d/400)%3;Q(ctx,x1,y1,'#fff6c0',tw2?1:0.5);if(tw2===1)[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(o){Q(ctx,x1+o[0],y1+o[1],'#ffe58a',0.7);});}
}
function wake(st,t){st.wakes=st.wakes.filter(function(w){return t-w<20000;});st.wakes.push(t);st.angry=st.wakes.length>=2;
 st.wakeT=t;st.mood=Math.max(0,st.mood-(st.angry?14:8));}
function sleeping(st,now){return !!TIMES[time].moon&&!(st.media>now)&&!st.dead;}

var HAT=['....kk....','...kZZk...','...kZZk...','..kXXXXk..','.kXZXZXZk.','kXXXXXXXXk','kZXZXZXZXk','kkkkkkkkkk'];
var BLANKET_ON=['.....kkkkkkkkkk.....','...kkBBLBBBLBBBkk...','..kBBLLQLLLQLLLBBk..','.kBBBBLBBBLBBBLBBBk.','kBBBBBLBBBLBBBLBBBBk','kLLLLLQLLLQLLLQLLLLk','kBBBBBLBBBLBBBLBBBBk','kkkkkkkkkkkkkkkkkkkk','.F.F.F.F.F.F.F.F.F..'];
var BLANKET_FLOOR=['F.kkkkkkkkkkkkkk.F','FkBBLBBBLBBBLBBLkF','FkLLQLLLQLLLQLLQkF','FkBBLBBBLBBBLBBLkF','FkLLQLLLQLLLQLLQkF','F.kkkkkkkkkkkkkk.F'];
var BOTTLE=['..kkkk..','..kWWk..','..kPPk..','.kPPPPk.','kPrrrrPk','kPPPPPPk','kPrrrrPk','kPPPPPPk','kPrrrrPk','.kPPPPk.','..kkkk..'];
var TEDDY=['..kkkkkk..','.kTTTTTTk.','kTTTTTTTTk','kTkTTTTkTk','kTTTttTTTk','kTTtkktTTk','.kTTttTTk.','..kXkkXk..','.kTTTTTTk.','kTTttttTTk','kTkttttkTk','.kTTTTTTk.','.kTk..kTk.','.kkk..kkk.'];
var IPAL={kiur:{k:'#2a2f38',Z:'#fde8d0',X:'#d94a5c',Q:'#2f5aa0',B:'#4a7cc9',L:'#9cc0ee',F:'#c9dcf5',W:'#ffffff',P:'#e9667a',r:'#f39aa8',T:'#b07a4a',t:'#e2bf8f'},
          kirsi:{k:'#3b2a4a',Z:'#fde8d0',X:'#d94a5c',Q:'#c9527f',B:'#e98fb8',L:'#f7c6dc',F:'#fde3ee',W:'#ffffff',P:'#e9667a',r:'#f39aa8',T:'#b07a4a',t:'#e2bf8f'}};
var ITEMS=['hat','blanket','bottle','teddy'];
var HOOK={x:35,y:25};
function rowsOf(st,id){var it=st.items[id];if(id==='hat')return HAT;if(id==='bottle')return BOTTLE;if(id==='teddy')return TEDDY;return (it.where==='on'||it.drag)?BLANKET_ON:BLANKET_FLOOR;}
function boxSlot(st,id){var stored=ITEMS.filter(function(k){return st.items[k].where==='box';}),i=stored.indexOf(id),x=BOX.x;for(var j=0;j<i;j++)x+=rowsOf(st,stored[j])[0].length+1;var rows=rowsOf(st,id);return {x:x,y:BOX.y-4-rows.length};}
function itemRect(st,id){var e=st.egg,ex=Math.round(e.x),ey=Math.round(e.y),it=st.items[id],rows=rowsOf(st,id),w=rows[0].length,h=rows.length;
 if(it.drag)return {x:Math.round(it.x),y:Math.round(it.y),w:w,h:h};
 if(it.where==='on'){if(id==='hat')return {x:ex+3,y:ey-5,w:w,h:h};if(id==='blanket')return {x:ex-2,y:ey+8,w:w,h:h};
  var tRight=WW-(ex+14)>=10,tx=tRight?ex+11:ex-7;if(id==='teddy')return {x:tx,y:ey+2,w:w,h:h};
  return {x:tRight?Math.max(0,ex-5):ex+12,y:ey+5,w:w,h:h};}
 if(it.where==='hook')return {x:HOOK.x,y:HOOK.y,w:w,h:h};
 if(it.where==='box'){var b=boxSlot(st,id);return {x:b.x,y:b.y,w:w,h:h,hidden:!st.boxOpen};}
 return {x:it.x,y:it.y,w:w,h:h};}
function drawItem(ctx,r,st,id,lean){var it=st.items[id],q=itemRect(st,id);if(q.hidden)return;
 if(id==='hat'&&it.where==='on')q.x+=lean*2;
 if(id==='hat'&&it.where==='hook'&&!it.drag)R(ctx,r,q.x+4,q.y-1,2,1,'#3a3a3a');
 sprite(ctx,r,rowsOf(st,id),q.x,q.y,IPAL[r.id]);
 if(id==='bottle'&&it.where==='on'){var k=Math.floor(performance.now()/420)%2;R(ctx,r,q.x+3+k,q.y-3,1,1,'#ffb347',0.7);R(ctx,r,q.x+4-k,q.y-2,1,1,'#ffb347',0.7);}}
function hitItem(st,p){var order=['hat','teddy','bottle','blanket'];for(var i=0;i<order.length;i++){var id=order[i],q=itemRect(st,id);if(q.hidden)continue;
 if(p.x>=q.x&&p.x<q.x+q.w&&p.y>=q.y&&p.y<q.y+q.h)return id;}return null;}
function inBox(p,x0,y0,x1,y1){return p.x>=x0&&p.x<=x1&&p.y>=y0&&p.y<=y1;}
function nearEgg(st,p){var e=st.egg;return p.x>=e.x-4&&p.x<=e.x+19&&p.y>=e.y-6&&p.y<=e.y+16;}
function onEgg(st,p){var e=st.egg;return inBox(p,Math.round(e.x)+2,Math.round(e.y)+1,Math.round(e.x)+13,Math.round(e.y)+14);}
function overBox(p){return inBox(p,BOX.x-1,BOX.y-4,BOX.x+BOX.w,BOX.y+BOX.h+1);}
// v8: where a released egg comes to rest. It snaps only when dropped right over the nest or the couch seat;
// anywhere else it stays where it was let go, and only drops down if it was let go in the air.
function restingPlace(st){var ex=st.egg.x,ey=st.egg.y,n=SPOTS.nest,c=SPOTS.couch,mid=ex+8;
 if(Math.abs(ex-n.x)<=4&&ey-n.y<=4&&ey-n.y>=-14)return {x:n.x,y:n.y,spot:'nest'};
 if(Math.abs(ex-c.x)<=4&&ey-c.y<=4&&ey-c.y>=-20)return {x:c.x,y:c.y,spot:'couch'};
 var y=Math.max(ey,FLOOR_MIN);
 if(mid>=SPOTS.nest.x-1&&mid<=SPOTS.nest.x+17&&y<n.y+6)y=n.y+6;          // just missed the nest: in front of it
 if(mid>=38&&mid<=58&&y<49)y=49;                                         // just missed the couch: on the floor in front of it
 return {x:ex,y:Math.min(H-16,y),spot:'floor'};}

function drawLight(ctx,r,st,now){
 var T=TIMES[time];
 if(st.curt&&T.beam){for(var y=22;y<52;y++){var a=Math.round(20-(y-22)*0.55);for(var x=a;x<a+12;x++)if((x+y)%2===0)P(ctx,r,x,y,T.beam,0.3);}}
 var dark=T.amb?parseFloat(T.amb.split(',')[3]):0;
 if(!st.curt&&!T.moon)dark+=0.16;if(T.moon&&st.night)dark-=0.12;
 var col=T.moon||!T.amb?'#0a0e28':T.amb.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,'rgb($1,$2,$3)');
 // v9: switching the lamp on is like turning the big light off: the room goes dim and the lamp lights a warm pool
 if(st.lamp){dark=Math.max(dark+0.12,T.moon?0.7:0.58);col='#0d1026';}
 dark=Math.min(dark,0.78);
 if(dark>0){if(!st.lamp&&!st.night){ctx.globalAlpha=dark;ctx.fillStyle=col;ctx.fillRect(0,0,VW*C,H*C);ctx.globalAlpha=1;}
  else lightRuns(st,dark,col).forEach(function(q){R(ctx,r,q[0],q[1],q[2],1,q[4],q[3]);});}
 if(st.lamp){drawLamp(ctx,r,true);R(ctx,r,14,14,7,1,'#fff6c0',0.9);for(var y2=15;y2<46;y2++){var w=1+Math.floor((y2-14)/2.4);for(var x2=17-w;x2<=17+w;x2++)if((x2+y2)%3===0)P(ctx,r,x2,y2,'#fff3a0',0.3);}}
 if(st.night){var tw=Math.floor(now/500);STARS.forEach(function(s,i){P(ctx,r,s[1],s[0],'#ffe58a',(i+tw)%3===0?0.45:0.95);});
  for(var y3=NL.y-3;y3<NL.y+9;y3++)for(var x3=NL.x-3;x3<NL.x+7;x3++)if((x3+y3)%2===0)P(ctx,r,x3,y3,r.id==='kiur'?'#ffb347':'#ffe58a',0.22);drawNightLight(ctx,r,true);}
 if(st.media>now){var k=Math.floor((st.media-now)/350)%4,nx=r.media==='tv'?5:7;
  [[0,'#8b6cf0'],[2,'#ef5b7b']].forEach(function(n){var yy=30-((k+n[0])%4)*2;P(ctx,r,nx+n[0]+1,yy,n[1]);P(ctx,r,nx+n[0]+2,yy,n[1]);P(ctx,r,nx+n[0]+1,yy+1,n[1]);P(ctx,r,nx+n[0],yy+2,n[1]);P(ctx,r,nx+n[0]+1,yy+2,n[1]);});}
}
// The dim room as row runs: darkness with holes around the lights, plus a warm tint where the lamp shines.
// Cached until the lights, the darkness or the room height change.
function lightRuns(st,dark,col){var key=[st.lamp,st.night,dark.toFixed(3),col,H].join('|');if(st.lightC&&st.lightC.k===key)return st.lightC.runs;
 var L=[];if(st.lamp)L.push([17,12,26,1,'#ffbf5a']);if(st.night)L.push([NL.x+2,NL.y+2,10,0.8,st.r&&st.r.id==='kiur'?'#ffb347':'#ffe58a']);
 function sm(v){v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);}
 function lit(x,y){var li=0,tc=null;L.forEach(function(l){var dx=x+0.5-l[0],dy=(y+0.5-l[1])*0.8,v=sm(1-Math.sqrt(dx*dx+dy*dy)/l[2])*l[3];if(v>li){li=v;tc=l[4];}});
  if(st.lamp){var cw=1.5+(y-13)*0.42;if(y>13&&y<46&&Math.abs(x+0.5-17)<=cw){var cv=0.85*sm(1.2-Math.abs(x+0.5-17)/cw);if(cv>li){li=cv;tc='#ffbf5a';}}
   var ex=(x+0.5-17)/14,ey=(y+0.5-46)/5,pv=0.8*sm(1-(ex*ex+ey*ey));if(pv>li){li=pv;tc='#ffbf5a';}}
  return [Math.round(li*8)/8,tc];}
 var runs=[];for(var y=0;y<H;y++){var x0=0,a0=null,w0=null,c0=null;for(var x=0;x<=WW;x++){var q=x<WW?lit(x,y):[0,null],li=q[0],a=x<WW?+(dark*(1-li*0.8)).toFixed(3):null,w=x<WW?+(li*0.32).toFixed(3):null,tc=q[1];
   if(x<WW&&a===a0&&w===w0&&tc===c0)continue;
   if(a0!=null&&a0>0)runs.push([x0,y,x-x0,a0,col]);if(w0&&c0)runs.push([x0,y,x-x0,w0,c0]);x0=x;a0=a;w0=w;c0=tc;}}
 st.lightC={k:key,runs:runs};return runs;}
function drawHearts(ctx,r,st,now){
 var e=st.egg;st.hearts=st.hearts.filter(function(h){return now-h.t<1100;});
 st.hearts.forEach(function(h){if(now<h.t)return;var age=(now-h.t)/1100,hx=(h.x!=null?h.x:Math.round(e.x)+5)+h.dx,hy=(h.y!=null?h.y:Math.round(e.y)-2)-Math.floor(age*5),a=age>0.6?1-(age-0.6)/0.4:1;
  [[0,0],[1,0],[3,0],[4,0],[0,1],[1,1],[2,1],[3,1],[4,1],[1,2],[2,2],[3,2],[2,3]].forEach(function(c){P(ctx,r,hx+c[0],hy+c[1],'#ef5b7b',a);});});
 if(st.ring&&now-st.ring.t<300){var g=st.ring;[[-1,-2],[0,-2],[1,-2],[-2,-1],[2,-1],[-2,0],[2,0],[-2,1],[2,1],[-1,2],[0,2],[1,2]].forEach(function(c){P(ctx,r,g.x+c[0],g.y+c[1],'#ffffff',0.9);});}
}
function drawEdges(ctx,st){var maxc=WW-VW,y=H*C/2;ctx.fillStyle='#ffffff';
 if(st.cam>0.5){ctx.globalAlpha=0.55;ctx.fillRect(4,y-8,4,4);ctx.fillRect(0,y-4,4,4);ctx.fillRect(4,y,4,4);}
 if(st.cam<maxc-0.5){ctx.globalAlpha=0.55;var x=VW*C-8;ctx.fillRect(x-4,y-8,4,4);ctx.fillRect(x,y-4,4,4);ctx.fillRect(x-4,y,4,4);}
 ctx.globalAlpha=1;}
function lean(st,now){if(st.dead)return 0;if(st.move)return Math.floor(now/120)%2?1:-1;if(st.media>now)return Math.floor(now/320)%2?1:-1;
 if(st.wob&&now-st.wob<480)return [-1,0,1,0][Math.floor((now-st.wob)/120)];return 0;}
function meters(st){return {top:[{ic:'flame',v:st.warmth,k:'soojus'},{ic:'heart',v:st.mood,k:'tuju'},{ic:'book',v:st.tarkus,k:'tarkus'}],
 bot:[{ic:'grow',v:st.growth,prog:true,k:'kasv'},{ic:'cal',txt:dayOf(st)+'/7',k:'paev',day:dayOf(st)}]};}
function frame(ctx,r,now){
 var st=state[r.id];CAM=st.cam;
 if(LIVE){var wn=Date.now();if(st.wall&&wn-st.wall>3000&&!st.dead)catchUp(r,st,(wn-st.wall)/3.6e6,now);st.wall=wn;}
 var dt=st.last?Math.min(0.1,(now-st.last)/1000):0;st.last=now;tick(st,dt,now);
 if(st.move){var m=st.move,k=Math.min(1,(now-m.t)/m.d),kk=m.fall?k*k:k;st.egg.x=m.x0+(m.x1-m.x0)*k;st.egg.y=m.y0+(m.y1-m.y0)*kk;if(k>=1){st.move=null;st.egg.spot=m.spot;st.wob=now;}}
 ctx.clearRect(0,0,VW*C,H*C);
 drawWall(ctx,r);drawWindow(ctx,r,st);drawDecor(ctx,r);drawLamp(ctx,r,st.lamp);drawMedia(ctx,r,st,now);
 var its=st.items,fx=fxOf(st,now),ln=(now-st.wakeT>=0&&now-st.wakeT<1800)?0:lean(st,now);
 function behindCouch(id){var q=itemRect(st,id);return its[id].where==='floor'&&!its[id].drag&&q.x+q.w>38&&q.y+q.h<=64;}
 ITEMS.forEach(function(id){if(behindCouch(id))drawItem(ctx,r,st,id,ln);});
 drawCouch(ctx,r);drawRug(ctx,r);drawNightLight(ctx,r,false);drawBox(ctx,r,st);
 drawNest(ctx,r,'back');
 var inNest=st.egg.spot==='nest'&&!st.drag&&!st.move;if(!inNest)drawNest(ctx,r,'front');
 ITEMS.filter(function(id){return (its[id].where==='floor'&&!behindCouch(id))||its[id].where==='hook'||its[id].where==='box';}).filter(function(id){return !its[id].drag;})
  .sort(function(a,b){var qa=itemRect(st,a),qb=itemRect(st,b);return (qa.y+qa.h)-(qb.y+qb.h);}).forEach(function(id){drawItem(ctx,r,st,id,ln);});
 ['bottle','teddy'].forEach(function(id){if(its[id].where==='on'&&!its[id].drag)drawItem(ctx,r,st,id,ln);});
 drawEgg(ctx,r,st,ln,fx,now);if(inNest)drawNest(ctx,r,'front');
 ['blanket','hat'].forEach(function(id){if(its[id].where==='on'&&!its[id].drag)drawItem(ctx,r,st,id,ln);});
 drawLight(ctx,r,st,now);
 ITEMS.forEach(function(id){if(its[id].drag)drawItem(ctx,r,st,id,0);});
 drawMoodFx(ctx,r,st,now,fx);drawZzz(ctx,r,st,now);drawDeath(ctx,r,st,now);drawHearts(ctx,r,st,now);drawEdges(ctx,st);
 drawHud(st.hud,meters(st),now,st.dead);
}
// Live stats in the preview move fast (seconds); the real app uses the hour pacing in STEP.
function tick(st,dt,now){if(st.dead)return;var its=st.items,on=function(id){return its[id].where==='on'&&!its[id].drag;};
 if(LIVE){liveTick(st,dt/3600,now,on);return;}
 var heat=(on('blanket')?0.6:0)+(on('hat')?0.35:0)+(on('bottle')?0.5:0)+(on('teddy')?0.15:0)+(st.lamp?0.25:0)+(TIMES[time].beam&&st.curt?0.2:0);
 st.warmth=clamp(st.warmth+(heat-0.35)*dt*2);
 st.mood=clamp(st.mood+((on('teddy')?0.35:0)-0.12-(st.tarkus<40?0.1:0))*dt*2);
 st.tarkus=clamp(st.tarkus-0.03*dt*2);}
// Real hours while the page is open: everything the egg wears stays on, so good care makes warmth rise.
function liveTick(st,h,now,on){if(h<=0)return;
 var prot=(on('blanket')?12:0)+(on('hat')?6:0)+(on('bottle')?4:0)+(st.lamp?2:0)+(TIMES[time].beam&&st.curt?2:0);
 st.warmth=clamp(st.warmth+(STEP.warm+prot)/8*h);
 st.mood=clamp(st.mood+(STEP.mood+(on('teddy')?6:0)+(st.tarkus<40?STEP.moodNoLearn:0))/8*h);
 st.tarkus=clamp(st.tarkus+STEP.tark/8*h);
 var care=(st.warmth+st.mood+st.tarkus)/3,speed=1+STEP.boost*Math.max(0,Math.min(1,(care-40)/45));
 st.growth=Math.min(100,st.growth+100/(STEP.hatchDays*24)*speed*h);st.hours+=h;
 st.tapBank=Math.min(15,st.tapBank+15*h);
 if(danger(st))st.zeroH+=h;else{st.zeroH=0;st.warned=false;}
 if(st.zeroH>=STEP.zeroDeathH)die(st.r,st,now);}
// Petting: in the real pace taps give at most ~15 mood an hour, so tapping cannot replace care.
function pet(st,n){if(!LIVE){st.mood=Math.min(100,st.mood+n);return;}var g=Math.min(n,st.tapBank);st.tapBank-=g;st.mood=clamp(st.mood+g);}
var ZBIG=['####','..#.','.#..','####'],ZSMALL=['###','.#.','###'];
function drawZzz(ctx,r,st,now){if(!sleeping(st,now)||st.drag||st.move)return;
 var since=now-st.wakeT;if(since<3200)return;var fade=Math.min(1,(since-3200)/2500);
 var e=st.egg,ex=sx(r,Math.round(e.x),16),ey=Math.round(e.y),side=r.mirror?-1:1;
 for(var i=0;i<3;i++){var age=((now/9000)+i/3)%1,g=age<0.4?ZSMALL:ZBIG,a=age<0.2?age/0.2:age>0.7?(1-age)/0.3:1;
  var zx=ex+(r.mirror?3:12)+side*Math.round(age*5)+Math.round(Math.sin(age*Math.PI*2)*0.8),zy=ey-1-Math.floor(age*12);
  ctx.globalAlpha=a*0.85*fade;ctx.fillStyle='#e8eeff';
  for(var y=0;y<g.length;y++)for(var x=0;x<g[y].length;x++)if(g[y][x]==='#')ctx.fillRect((zx+x)*C,(zy+y)*C,C,C);}
 ctx.globalAlpha=1;}
// ---- Status bar (HUD), 72 x 17 cells of 2 px. Top row: the three needs. Bottom row: growth and age.
var ICONS={
 flame:{rows:['...r...','..rr...','..rrr.r','.rryrrr','.ryyyr.','.ryyyr.','..rrr..'],pal:{r:'#f2763a',y:'#ffd54a'}},
 heart:{rows:['.rr.rr.','rWrrrrr','rrrrrrr','.rrrrr.','..rrr..','...r...','.......'],pal:{r:'#ef5b7b',W:'#ffd0dc'}},
 // Tarkus = an owl (the Estonian school symbol): ear tufts, big eyes, a beak, a light belly and feet
 book:{rows:['b.....b','bbbbbbb','bWWbWWb','bWkbkWb','bbbybbb','.bcccb.','..y.y..'],pal:{b:'#a0703f',W:'#ffffff',k:'#1d2230',y:'#ffb347',c:'#e2bf8f'}},
 grow:{rows:['..www..','.wwwww.','.wwkww.','wwkwkww','wwwwwww','.wwwww.','..www..'],pal:{w:'#fff1e0',k:'#6b5a4a'}},
 cal:{rows:['kkkkkkk','krrrrrk','kwwwwwk','kwkwkwk','kwwwwwk','kwkwkwk','kkkkkkk'],pal:{k:'#8a93a3',r:'#ef5b5b',w:'#f5efe6'}},
 bowl:{rows:['.s..s..','..s..s.','.ooooo.','bbbbbbb','.bbbbb.','..bbb..','.......'],pal:{s:'#c9d0dc',o:'#f2a33d',b:'#4a7cc9'}},
 cake:{rows:['...y...','...w...','.ppppp.','.wwwww.','ppppppp','wwwwwww','.......'],pal:{y:'#ffd54a',w:'#fff1e0',p:'#f6a8c8'}},
 bell:{rows:['..kkk..','.k...k.','.kkkkk.','kgggggk','kgggggk','kgggggk','.kkkkk.'],pal:{k:'#5a6270',g:'#9aa3b2'}}};
var FONT={'0':['###','#.#','#.#','#.#','###'],'1':['.#.','##.','.#.','.#.','###'],'2':['###','..#','###','#..','###'],'3':['###','..#','.##','..#','###'],
 '4':['#.#','#.#','###','..#','..#'],'5':['###','#..','###','..#','###'],'6':['###','#..','###','#.#','###'],'7':['###','..#','.#.','.#.','.#.'],
 '8':['###','#.#','###','#.#','###'],'9':['###','#.#','###','..#','###'],'/':['..#','..#','.#.','#..','#..'],',':['.','.','.','#','#'],
 'k':['#..','#.#','##.','#.#','#.#'],'g':['.##','#..','#.#','#.#','.##'],'p':['###','#.#','###','#..','#..'],' ':['.','.','.','.','.']};
function makeHud(parent){var c=document.createElement('canvas');c.width=HUW*HC;c.height=17*HC;
 c.style.cssText='width:'+(HUW*HC*HSX)+'px;height:'+(17*HC*HS)+'px;image-rendering:pixelated;border-radius:0 0 12px 12px;display:block;cursor:help;touch-action:manipulation';
 c.setAttribute('aria-label','Näidikud');parent.appendChild(c);var ctx=c.getContext('2d');ctx.canvas=c;return ctx;}
function hp(ctx,x,y,c,a){ctx.globalAlpha=a==null?1:a;ctx.fillStyle=c;ctx.fillRect(x*HC,y*HC,HC,HC);ctx.globalAlpha=1;}
function drawMeter(ctx,m,x0,y0,bw,now,dead){var ic=ICONS[m.ic];
 for(var y=0;y<7;y++)for(var x=0;x<7;x++){var ch=ic.rows[y][x];if(ch!=='.')hp(ctx,x0+x,y0+y,ic.pal[ch],dead?0.4:1);}
 if(m.txt!=null){var tx=x0+10;m.txt.split('').forEach(function(ch){var f=FONT[ch];for(var y=0;y<5;y++)for(var x=0;x<f[y].length;x++)if(f[y][x]==='#')hp(ctx,tx+x,y0+1+y,'#f5efe6',dead?0.4:1);tx+=f[0].length+1;});return;}
 var bx=x0+9,v=Math.max(0,Math.min(100,m.v)),fill=Math.round(v/100*(bw-2));
 for(var x=0;x<bw;x++){hp(ctx,bx+x,y0+1,'#4a5266');hp(ctx,bx+x,y0+5,'#4a5266');}for(var y=1;y<6;y++){hp(ctx,bx,y0+y,'#4a5266');hp(ctx,bx+bw-1,y0+y,'#4a5266');}
 var col=dead?'#6b7080':m.prog?'#c7a6ee':v>=60?'#5fbf5a':v>=30?'#f2c94c':'#ef5b5b',a=(!dead&&!m.prog&&v<15&&Math.floor(now/400)%2)?0.35:1;
 for(var x=1;x<=fill;x++)for(var y=2;y<5;y++)hp(ctx,bx+x,y0+y,col,a);
 for(var x=1;x<=fill;x++)hp(ctx,bx+x,y0+2,'#ffffff',0.25*a);
 // empty need: the frame itself blinks red
 if(!dead&&!m.prog&&v<=0.5&&Math.floor(now/400)%2){for(var x=0;x<bw;x++){hp(ctx,bx+x,y0+1,'#ef5b5b');hp(ctx,bx+x,y0+5,'#ef5b5b');}for(var y=1;y<6;y++){hp(ctx,bx,y0+y,'#ef5b5b');hp(ctx,bx+bw-1,y0+y,'#ef5b5b');}}}
function drawHud(ctx,m,now,dead){ctx.fillStyle='#1d2230';ctx.fillRect(0,0,HUW*HC,17*HC);ctx.save();ctx.translate(HX*HC,0);
 m.top.forEach(function(mt,i){drawMeter(ctx,mt,i*24+1,1,13,now,dead);});
 for(var x=1;x<71;x++)hp(ctx,x,8,'#2a3142');
 m.bot.forEach(function(mt,i){drawMeter(ctx,mt,i*36+2,9,24,now,dead);});ctx.restore();}
// tooltips: hover with a mouse, tap on a phone (stays 3 s)
var EMPTY=' Kui see on kaua tühi, on muna ohus.';
var TIPS={
 soojus:function(m){return '<b>Soojus '+Math.round(m.v)+'/100.</b> Tekk, müts, soojapudel, lamp ja päike hoiavad muna soojas.'+EMPTY;},
 tuju:function(m){return '<b>Tuju '+Math.round(m.v)+'/100.</b> Paitamine, kaisukaru ja hästi tehtud harjutused teevad muna rõõmsaks.'+EMPTY;},
 tarkus:function(m){return '<b>Tarkus '+Math.round(m.v)+'/100.</b> Kasvab ainult Harjutaja harjutustest – mida paremini läheb, seda rohkem.'+EMPTY;},
 kasv:function(m){return '<b>Kasv '+Math.round(m.v)+'%.</b> Nii kaugel on koorumine. Hea hoolitsus teeb selle kuni 20% kiiremaks.';},
 paev:function(m){return '<b>Päev '+m.day+'.</b> Muna koorub umbes 7. päeval, hea hoolitsusega varem.';},
 kõht:function(m){return '<b>Kõht '+Math.round(m.v)+'/100.</b> Toida beebit. Söök täidab kõhu, maius teeb tuju heaks, aga kaal kasvab.'+EMPTY.replace('muna','beebi');},
 tujuB:function(m){return '<b>Tuju '+Math.round(m.v)+'/100.</b> Mängi beebiga ja tee harjutusi hästi.'+EMPTY.replace('muna','beebi');},
 tarkusB:function(m){return '<b>Tarkus '+Math.round(m.v)+'/100.</b> Kasvab ainult harjutustest.'+EMPTY.replace('muna','beebi');},
 vanus:function(m){return '<b>Vanus: '+m.txt.replace(' p',' päeva')+'.</b>';},
 kaal:function(m){return '<b>Kaal '+m.txt.replace(' kg','').replace(',',',')+' kg.</b> Liiga palju maiuseid teeb beebi raskeks.';}};
function attachTips(hctx,wrap,getM){var c=hctx.canvas,tip=document.createElement('div');tip.className='ptip';tip.style.bottom=(HUDH+4)+'px';wrap.appendChild(tip);var timer=0;
 function pick(ev){var b=c.getBoundingClientRect(),x=(ev.clientX-b.left)/b.width*HUW-HX,y=(ev.clientY-b.top)/b.height*17,m=getM();
  return y<8.5?m.top[Math.min(2,Math.floor(x/24))]:m.bot[Math.min(1,Math.floor(x/36))];}
 function show(ev,stay){var mt=pick(ev);if(!mt)return;tip.innerHTML=TIPS[mt.k](mt);tip.style.display='block';clearTimeout(timer);if(stay)timer=setTimeout(function(){tip.style.display='none';},3000);}
 c.addEventListener('pointermove',function(ev){if(ev.pointerType==='mouse')show(ev,false);});
 c.addEventListener('pointerdown',function(ev){show(ev,true);});
 c.addEventListener('pointerleave',function(ev){if(ev.pointerType==='mouse')tip.style.display='none';});}
function heart(st,n,now,at){for(var i=0;i<n;i++)st.hearts.push({t:now+i*180,dx:(i-(n-1)/2)*4,x:at?at.x:null,y:at?at.y:null});}
function cellAt(r,st,ev,c){var b=c.getBoundingClientRect(),scx=(ev.clientX-b.left)/(b.width/VW),y=(ev.clientY-b.top)/(b.height/H),wx=scx+st.cam;
 return {fx:r.mirror?WW-wx:wx,fy:y,x:Math.floor(r.mirror?WW-wx:wx),y:Math.floor(y),scx:scx,cx:ev.clientX};}
function clampCam(st){st.cam=Math.max(0,Math.min(WW-VW,st.cam));}

// ---- In-room messages: a toast after exercises, and cards (away, danger, the soft ending).
function toast(st,text){var t=st.ui.toast;t.textContent=text;t.style.opacity=1;clearTimeout(st.ui.tt);st.ui.tt=setTimeout(function(){t.style.opacity=0;},3200);}
function showCard(st,html,btn){var c=st.ui.card;c.innerHTML=html+'<br>';var b=document.createElement('button');b.textContent=btn.t;
 b.onclick=function(){c.style.display='none';btn.fn();};c.appendChild(b);c.style.display='block';}
function hideCard(st){st.ui.card.style.display='none';}
function hoursText(h){h=Math.round(h);var d=Math.floor(h/24),t=h%24,p=[];if(d)p.push(d+(d===1?' päev':' päeva'));if(t)p.push(t+' tundi');return p.join(' ja ');}
function stateLines(st){var L=[];
 if(st.warmth<=0.5)L.push('Muna on täiesti külmaks jäänud.');else if(st.warmth<15)L.push('Muna külmetab väga.');else if(st.warmth<35)L.push('Munal on külm.');
 if(st.mood<=0.5)L.push('Muna on väga õnnetu.');else if(st.mood<15)L.push('Muna on väga kurb.');else if(st.mood<30)L.push('Muna on kurb.');
 if(st.tarkus<=0.5)L.push('Muna pole ammu midagi õppinud.');else if(st.tarkus<15)L.push('Muna igatseb väga harjutamist.');else if(st.tarkus<40)L.push('Muna igatseb harjutamist.');
 return L;}
function needWords(st){var w=[];if(st.warmth<=0.5)w.push('külm');if(st.mood<=0.5)w.push('õnnetu');if(st.tarkus<=0.5)w.push('pole harjutanud');return w.join(', ');}
function hintOf(st){var n=[['warmth',st.warmth,'pane tekk ja müts peale.'],['mood',st.mood,'paita muna ja too talle kaisukaru.'],['tarkus',st.tarkus,'tee mõni harjutus.']].sort(function(a,b){return a[1]-b[1];})[0];return n[1]<50?n[2]:null;}
function showAway(r,st){var a=st.away,b=a.before,L=stateLines(st),d=dayOf(st);
 if(st.growth>=100&&b.growth<100)L.unshift('Muna on valmis kooruma!');else if(d>b.day)L.unshift('Muna kasvas: nüüd on '+d+'. päev.');
 if(!L.length)L.push('Munal on kõik hästi.');
 var html='<b>Sind polnud '+hoursText(a.h)+'.</b><br>'+L.join('<br>');
 if(st.zeroH>0)html+='<br><b style="color:#ff9a9a">Muna on ohus! Ta vajab kohe abi.</b>';
 // the hint is hidden until the child asks for it
 var h=hintOf(st);if(h)html+='<br><a href="#" class="phint" onclick="this.nextSibling.style.display=\'inline\';this.style.display=\'none\';return false;">Vihje?</a><span style="display:none;color:#c9d3e6">Vihje: '+h+'</span>';
 showCard(st,html,{t:'Selge',fn:function(){st.away=null;}});}
function awayStep(r,st,now,hrs,quiet){if(st.dead)return;hrs=hrs||8;var f=hrs/8;
 if(!st.away)st.away={h:0,before:{day:dayOf(st),growth:st.growth}};
 var its=st.items,on=function(id){return its[id].where==='on';},wasZero=danger(st);
 var prot=(on('blanket')?12:0)+(on('hat')?6:0)+(on('bottle')?4:0)+(st.lamp?2:0);
 st.warmth=clamp(st.warmth+(STEP.warm+prot*0.5)*f);
 if(hrs>=4&&on('blanket')){its.blanket.where='floor';its.blanket.x=13;its.blanket.y=72;}   // it slipped off at some point
 if(hrs>=4)st.lamp=false;
 st.mood=clamp(st.mood+(STEP.mood+(on('teddy')?6:0)+(st.tarkus<40?STEP.moodNoLearn:0))*f);
 st.tarkus=clamp(st.tarkus+STEP.tark*f);
 var care=(st.warmth+st.mood+st.tarkus)/3,speed=1+STEP.boost*Math.max(0,Math.min(1,(care-40)/45));
 st.growth=Math.min(100,st.growth+100/(STEP.hatchDays*3)*speed*f);st.hours+=hrs;st.away.h+=hrs;
 if(danger(st))st.zeroH+=wasZero?hrs:hrs/2;else st.zeroH=0;
 if(st.zeroH>=STEP.zeroDeathH){die(r,st,now);return;}
 if(st.zeroH>0&&!st.warned){st.warned=true;addLog(r.who+' muna on ohus ('+needWords(st)+'). Ta vajab täna hoolt.');}
 if(!st.zeroH)st.warned=false;
 if(!quiet)showAway(r,st);save(r,st);}
function catchUp(r,st,el,now){var left=el;while(left>1e-6&&!st.dead){var c=Math.min(8,left);awayStep(r,st,now,c,true);left-=c;}
 if(!st.dead&&el>=AWAY_MIN)showAway(r,st);else if(!st.dead)st.away=null;save(r,st);}
function exercise(r,st,now,good,quiet){if(st.dead)return;
 st.tarkus=clamp(st.tarkus+(good?20:6));
 if(good){st.mood=clamp(st.mood+10);heart(st,3,now);}else heart(st,1,now);
 if(!danger(st)){st.zeroH=0;st.warned=false;}
 if(!quiet)toast(st,good?'Muna on nüüd rõõmsam, sest sa harjutasid!':'Muna sai natuke targemaks. Proovi veel!');save(r,st);}
function die(r,st,now){st.dead=true;st.deathT=now;st.away=null;hideCard(st);st.drag=null;st.move=null;
 var its=st.items,spots={hat:[36,68],blanket:[13,72],bottle:[24,63],teddy:[40,64]};
 ITEMS.forEach(function(id){if(its[id].where==='on'||its[id].where==='carried'){its[id].where='floor';its[id].drag=null;its[id].x=spots[id][0];its[id].y=spots[id][1];}});
 var days=Math.max(1,Math.round(st.hours/24));st.lived=days;
 addLog(r.who+' muna läks tähtede juurde (oli '+days+' päeva). Uus muna ootab.');
 save(r,st);setTimeout(function(){showDeath(r,st);},5400);}
function showDeath(r,st){var days=st.lived||1;showCard(st,'<b>Muna läks tähtede juurde.</b><br>Ta ei saanud piisavalt soojust, rõõmu ja harjutamist.<br>Ta oli sinuga '+days+(days===1?' päeva':' päeva')+'.<br><span style="color:#aab4c8">Ta jääb sinu mälestusraamatusse.</span>',
  {t:'Alusta uue munaga',fn:function(){MEM.push({who:r.who,n:st.n,days:days});st.n++;initEgg(r,st,false);st.seenId=null;markSeen(r,st);st.cam=CAM0;heart(st,3,performance.now());renderLog();save(r,st);}});}
function historyOf(r){return fetch('/api/parent/history?learner='+r.id+'&limit=50',{credentials:'same-origin',cache:'no-store'}).then(function(x){return x.ok?x.json():null;}).catch(function(){return null;});}
// A new egg counts only exercises made after it appeared.
function markSeen(r,st){historyOf(r).then(function(j){if(!j||!j.items)return;st.seenId=j.items.reduce(function(m,a){return Math.max(m,a.id);},0);save(r,st);});}
function syncExercises(r,st){if(!LIVE||st.dead)return;if(st.seenId==null){markSeen(r,st);return;}
 historyOf(r).then(function(j){if(!j||!j.items||st.dead)return;var fresh=j.items.filter(function(a){return a.id>st.seenId;});if(!fresh.length)return;
  var good=0,weak=0,now=performance.now();fresh.forEach(function(a){if(a.questionCount>0&&a.score/a.questionCount>=0.8)good++;else weak++;});
  st.seenId=fresh.reduce(function(m,a){return Math.max(m,a.id);},st.seenId);
  for(var i=0;i<good;i++)exercise(r,st,now,true,true);for(var k=0;k<weak;k++)exercise(r,st,now,false,true);
  var n=good+weak;toast(st,good?(CFG.name||r.who)+' tegi '+n+' '+(n===1?'harjutuse':'harjutust')+' – muna on nüüd rõõmsam!':'Muna sai natuke targemaks. Proovi veel!');save(r,st);});}
function addLog(t){LOG.push(t);renderLog();}
function renderLog(){var h='<div><b>Mälestusraamat:</b> '+(MEM.length?MEM.map(function(m){return m.who+' '+m.n+'. muna – oli '+m.days+' päeva';}).join('; '):'veel tühi')+'</div>';
 if(LOG.length)h+='<div><b>Vanema teated (näidis):</b> '+LOG.slice(-3).join(' · ')+'</div>';var lg=document.getElementById('log');if(lg)lg.innerHTML=h;}

var roomsEl=document.getElementById('rooms');
if(LIVE)try{document.documentElement.style.setProperty('--eluka-hud',HUDH+'px');}catch(x){}
ROOMS.forEach(function(r){
 var st=state[r.id];
 var d=document.createElement('div');d.style.cssText='display:flex;flex-direction:column;align-items:center;gap:6px';
 var c=document.createElement('canvas');c.width=VW*C;c.height=H*C;c.style.cssText='width:'+(VW*C*SX)+'px;height:'+(H*C*SY)+'px;image-rendering:pixelated;border-radius:12px 12px 0 0;touch-action:none;cursor:grab;display:block';
 c.setAttribute('aria-label',r.name);
 var cap=document.createElement('div');cap.style.cssText='font-size:13px;color:var(--text-secondary)';cap.textContent=r.name;
 var stack=document.createElement('div');stack.style.position='relative';d.appendChild(stack);stack.appendChild(c);st.hud=makeHud(stack);
 var card=document.createElement('div');card.className='pcard';card.style.top='18%';stack.appendChild(card);
 var tst=document.createElement('div');tst.className='ptoast';tst.style.bottom=(HUDH+112)+'px';stack.appendChild(tst);
 if(CFG.exitHref){var ex=document.createElement('a');ex.className='pexit';ex.href=CFG.exitHref;ex.textContent='← '+(CFG.exitLabel||'Tagasi');ex.style.bottom=(HUDH+10)+'px';stack.appendChild(ex);}
 st.ui={card:card,toast:tst};attachTips(st.hud,stack,function(){return meters(st);});
 if(!LIVE)d.appendChild(cap);roomsEl.appendChild(d);
 var ctx=c.getContext('2d');
 c.addEventListener('pointerdown',function(ev){var p=cellAt(r,st,ev,c),now=performance.now();c.setPointerCapture(ev.pointerId);
  st.ring={x:p.x,y:p.y,t:now};
  if(!st.dead){
   var hit=st.move?null:hitItem(st,p);
   if(hit){var q=itemRect(st,hit),it=st.items[hit];it.drag={ox:p.fx-q.x,oy:p.fy-q.y,from:it.where,sx:p.fx,sy:p.fy,x0:it.x,y0:it.y};it.x=q.x;it.y=q.y;it.where='carried';return;}
   if(onEgg(st,p)&&!st.move){st.drag={ox:p.fx-st.egg.x,oy:p.fy-st.egg.y,sx:p.fx,sy:p.fy,moved:false,ex0:st.egg.x,ey0:st.egg.y};return;}}
  st.pan={cx:ev.clientX,cam:st.cam,moved:false,p:p};
 });
 function edgeScroll(p){if(p.scx<2.5){st.cam-=0.6;clampCam(st);}else if(p.scx>VW-2.5){st.cam+=0.6;clampCam(st);}}
 c.addEventListener('pointermove',function(ev){var p=cellAt(r,st,ev,c);
  var carried=ITEMS.filter(function(id){return st.items[id].drag;});
  if(carried.length){carried.forEach(function(id){var it=st.items[id];it.x=p.fx-it.drag.ox;it.y=p.fy-it.drag.oy;});edgeScroll(p);return;}
  if(st.drag){var dr=st.drag;if(Math.abs(p.fx-dr.sx)+Math.abs(p.fy-dr.sy)>1)dr.moved=true;
   st.egg.x=Math.max(-2,Math.min(WW-14,p.fx-dr.ox));st.egg.y=Math.max(20,Math.min(H-16,p.fy-dr.oy));edgeScroll(p);return;}
  if(st.pan){var b=c.getBoundingClientRect(),dx=(ev.clientX-st.pan.cx)/(b.width/VW);if(Math.abs(dx)>0.8)st.pan.moved=true;st.cam=st.pan.cam-dx;clampCam(st);}
 });
 c.addEventListener('pointerup',function(ev){var p=cellAt(r,st,ev,c),now=performance.now();
  var carried=ITEMS.filter(function(id){return st.items[id].drag;});
  if(carried.length){carried.forEach(function(id){var it=st.items[id],q=itemRect(st,id),dg=it.drag;it.drag=null;
    if(dg.from==='on'&&Math.abs(p.fx-dg.sx)+Math.abs(p.fy-dg.sy)<1.5){it.where='on';if(sleeping(st,now))wake(st,now);else{st.wob=now;heart(st,1,now);pet(st,5);}return;}
    if(nearEgg(st,p)){it.where='on';heart(st,2,now);pet(st,4);}
    else if(overBox(p)){it.where='box';heart(st,1,now,{x:BOX.x+3,y:BOX.y-6});pet(st,3);}
    else if(id==='hat'&&inBox(p,HOOK.x-2,HOOK.y-3,HOOK.x+11,HOOK.y+9)){it.where='hook';}
    else{it.where='floor';it.x=Math.max(0,Math.min(WW-q.w,Math.round(q.x)));it.y=Math.max(44-q.h+3,Math.min(H-q.h,Math.round(q.y)));}});return;}
  if(st.drag){var dr=st.drag;st.drag=null;
   if(!dr.moved){if(sleeping(st,now)){wake(st,now);return;}st.wob=now;heart(st,1,now);pet(st,5);return;}
   var to=restingPlace(st),dist=Math.abs(to.y-st.egg.y)+Math.abs(to.x-st.egg.x);
   st.move={x0:st.egg.x,y0:st.egg.y,x1:to.x,y1:to.y,t:now,d:dist<0.5?1:Math.min(500,140+dist*22),spot:to.spot,fall:to.spot==='floor'};
   if(sleeping(st,now))wake(st,now+220);else if(to.spot!=='floor')heart(st,2,now+220);return;}
  if(st.pan){var pn=st.pan;st.pan=null;if(pn.moved)return;var q=pn.p;
   if(inBox(q,19,5,34,22)){st.curt=!st.curt;return;}
   if(inBox(q,13,10,21,13)||inBox(q,16,14,18,43)){st.lamp=!st.lamp;if(st.lamp&&!st.dead)heart(st,1,now);return;}
   if(inBox(q,2,32,13,44)){if(TIMES[time].moon&&!st.dead){wake(st,now+200);st.media=now+3600;return;}st.media=now+3600;if(!st.dead){heart(st,1,now+900);pet(st,3);}return;}
   if(inBox(q,NL.x-2,NL.y-1,NL.x+6,NL.y+6)){st.night=!st.night;if(st.night&&!st.dead)heart(st,1,now);return;}
   if(overBox(q)){st.boxOpen=!st.boxOpen;return;}}
 });
 c.addEventListener('pointercancel',function(){ITEMS.forEach(function(id){var it=st.items[id],dg=it.drag;if(!dg)return;it.drag=null;it.where=dg.from;it.x=dg.x0;it.y=dg.y0;});
  if(st.drag){st.egg.x=st.drag.ex0;st.egg.y=st.drag.ey0;st.drag=null;}st.pan=null;});
 if(LIVE){if(st.loadedDead)showDeath(r,st);syncExercises(r,st);
  var timer=setInterval(function(){if(!c.isConnected){clearInterval(timer);return;}
   if(!timeFixed){var ti=clockIdx();if(ti!==time)setTime(ti,false);}syncExercises(r,st);save(r,st);},30000);
  var saver=setInterval(function(){if(!c.isConnected){clearInterval(saver);return;}save(r,st);},5000);
  var onHide=function(){if(!c.isConnected){window.removeEventListener('pagehide',onHide);return;}save(r,st);};
  var onVis=function(){if(!c.isConnected){document.removeEventListener('visibilitychange',onVis);return;}if(document.visibilityState==='hidden')save(r,st);else syncExercises(r,st);};
  window.addEventListener('pagehide',onHide);document.addEventListener('visibilitychange',onVis);}
 function loop(now){if(!c.isConnected)return;frame(ctx,r,now);requestAnimationFrame(loop);}
 requestAnimationFrame(loop);
});
var tEl=document.getElementById('times');
function setTime(i,fixed){time=i;timeFixed=fixed;var T=TIMES[i];
 Array.prototype.forEach.call(tEl.children,function(x){x.setAttribute('aria-pressed',x.dataset.t===(fixed?String(i):'clock'));});
 ROOMS.forEach(function(r){var st=state[r.id];if(T.moon)st.curt=false;else if(i===0){st.curt=true;st.night=false;}});}
function timeBtn(label,t,fn){var b=document.createElement('button');b.className='rbtn';b.textContent=label;b.dataset.t=t;b.onclick=fn;tEl.appendChild(b);}
if(LIVE)timeBtn('Päris kell','clock',function(){setTime(clockIdx(),false);});
TIMES.forEach(function(T,i){timeBtn(T.label,String(i),function(){setTime(i,true);});});
setTime(time,timeFixed);
function rowOf(el,list){list.forEach(function(e){var b=document.createElement('button');b.className='rbtn';b.textContent=e[0];
 b.onclick=function(){var now=performance.now();ROOMS.forEach(function(r){e[1](r,state[r.id],now);save(r,state[r.id]);});};el.appendChild(b);});}
rowOf(document.getElementById('events'),[
 ['Tekk kukub maha',function(r,st){if(st.items.blanket.where==='on'){st.items.blanket.where='floor';st.items.blanket.x=13;st.items.blanket.y=72;}}],
 ['Muna veereb pesast välja',function(r,st,now){if(!st.dead&&st.egg.spot==='nest')st.move={x0:st.egg.x,y0:st.egg.y,x1:9,y1:50,t:now,d:700,spot:'floor'};}],
 ['Lamp kustub',function(r,st){st.lamp=false;}]]);
rowOf(document.getElementById('sim'),[
 ['Harjutus läks hästi',function(r,st,now){exercise(r,st,now,true);}],
 ['Harjutus läks kehvasti',function(r,st,now){exercise(r,st,now,false);}],
 [LIVE?'Keri 8 tundi edasi':'Möödub 8 tundi',function(r,st,now){awayStep(r,st,now,8);}],
 ['Kõik korras',function(r,st){if(st.dead)return;st.warmth=85;st.mood=85;st.tarkus=85;st.zeroH=0;st.warned=false;}]].concat(LIVE?[
 ['Alusta otsast (uus muna)',function(r){try{localStorage.removeItem(key(r));}catch(x){}location.reload();}]]:[]));
renderLog();
var bh=document.getElementById('babyhud');
if(bh)[['Kiuri beebi',{top:[{ic:'bowl',v:35,k:'kõht'},{ic:'heart',v:80,k:'tujuB'},{ic:'book',v:62,k:'tarkusB'}],bot:[{ic:'cake',txt:'4 p',k:'vanus'},{ic:'bell',txt:'1,6 kg',k:'kaal'}]}],
 ['Kirsi beebi',{top:[{ic:'bowl',v:70,k:'kõht'},{ic:'heart',v:22,k:'tujuB'},{ic:'book',v:12,k:'tarkusB'}],bot:[{ic:'cake',txt:'2 p',k:'vanus'},{ic:'bell',txt:'0,9 kg',k:'kaal'}]}]].forEach(function(b){
 var d=document.createElement('div');d.style.cssText='display:flex;flex-direction:column;align-items:center;gap:6px';
 var wrap=document.createElement('div');wrap.style.position='relative';d.appendChild(wrap);var hx=makeHud(wrap);hx.canvas.style.borderRadius='12px';
 attachTips(hx,wrap,function(){return b[1];});
 var cap=document.createElement('div');cap.style.cssText='font-size:13px;color:var(--text-secondary)';cap.textContent=b[0];d.appendChild(cap);bh.appendChild(d);
 (function loop(now){drawHud(hx,b[1],now||0,false);requestAnimationFrame(loop);})(0);});
window.__pet={state:state,ROOMS:ROOMS,save:function(){if(roomsEl.isConnected)ROOMS.forEach(function(r){save(r,state[r.id]);});}};
})();
