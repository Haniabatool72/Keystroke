var WORDS={
easy:"the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us".split(" "),
medium:"about above accept account across actually address advice agree allow almost already always amount animal answer appear around attention available balance because become before behind believe better between beyond bridge brother budget business capital careful century change chapter choose circle citizen collect comfort common company compare complete concern connect consider control country courage create culture current decide degree demand describe develop different direction discover distance doctor dream during economy effort either energy enough entire environment example expect explain family famous figure finally foreign forward friend future garden general gather government ground growth happen healthy history holiday imagine important improve include increase industry inside interest island journey keyboard knowledge language laptop learning library machine manager market meaning measure member message minute mistake modern morning mountain natural network nothing number object office online opinion outside pattern perfect person picture planet popular possible practice present problem produce program project protect quality question quickly reason record remember report result science second service simple society software speaker special station student subject success suggest support system teacher thought together toward travel trouble understand universe usually various village visitor weather whether window without wonder yesterday".split(" "),
hard:"Accommodate, achievement; acquaintance, algorithm! bureaucracy, calendar? catastrophe, chronological; coincidence, communicate, comprehensive; conscientious, correspondence, curiosity, definitely, determination; dilemma, embarrass, encyclopedia, entrepreneur, environment; exaggerate, extraordinary, fluorescent, guarantee, harassment; hierarchy, hypothesis, immediately, independent, infrastructure; jurisdiction, knowledge, laboratory, maintenance, miscellaneous; necessary, occurrence, pharmaceutical, phenomenon, questionnaire; rhythm, sophisticated, surveillance, synchronize, temperature; unanimous, vocabulary, Wednesday, xylophone, yearning; zealous, 2026, 100%, (parallel), \"quoted\", well-known, e-mail, user_name, C++, $50".split(" ")};
var TIMES=[15,30,60,120], LV=["easy","medium","hard"];
var S={time:30,lvl:"medium",text:"",pos:0,st:[],started:false,done:false,t0:0,ok:0,bad:0,samples:[],timer:null,extra:0};
var $=function(i){return document.getElementById(i)};
var textEl=$("text"),inp=$("in"),stage=$("stage");

function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

function gen(n){var w=WORDS[S.lvl],o=[],last="";for(var i=0;i<n;i++){var x;do{x=w[Math.floor(Math.random()*w.length)]}while(x===last);last=x;o.push(x)}return o.join(" ")}

function build(){
  S.text=gen(120);S.pos=0;S.st=[];S.ok=0;S.bad=0;S.samples=[];S.raw=[];S.last=0;S.miss={};S.started=false;S.done=false;clearInterval(S.timer);
  textEl.innerHTML="";textEl.scrollTop=0;
  for(var i=0;i<S.text.length;i++){var s=document.createElement("span");s.textContent=S.text[i];textEl.appendChild(s)}
  textEl.children[0].className="cur";
  $("wpm").textContent="0";$("acc").textContent="100%";$("left").textContent=S.time;$("pbar").style.width="0";
  stage.classList.add("idle");
}

function extend(){
  var add=gen(60);S.text+=" "+add;var t=" "+add;
  for(var i=0;i<t.length;i++){var s=document.createElement("span");s.textContent=t[i];textEl.appendChild(s)}
}

function elapsed(){return (Date.now()-S.t0)/1000}
function wpmNow(){var m=Math.max(elapsed(),1)/60;return Math.round(S.ok/5/m)}
function accNow(){var t=S.ok+S.bad;return t?Math.round(S.ok/t*100):100}

function tick(){
  var e=elapsed(),left=Math.max(0,Math.ceil(S.time-e));
  $("left").textContent=left;$("pbar").style.width=Math.min(100,e/S.time*100)+"%";
  $("wpm").textContent=wpmNow();$("acc").textContent=accNow()+"%";
  S.samples.push(wpmNow());S.raw.push((S.ok-S.last)*12);S.last=S.ok;
  if(e>=S.time)finish();
}

function start(){S.started=true;S.t0=Date.now();stage.classList.remove("idle");S.timer=setInterval(tick,1000)}

function press(ch){
  if(S.done)return;
  if(!S.started)start();
  var kids=textEl.children,c=kids[S.pos];
  var good=ch===S.text[S.pos];
  c.className=good?"ok":"no";S.st[S.pos]=good;
  if(good)S.ok++;else{S.bad++;var mk_=S.text[S.pos];S.miss[mk_]=(S.miss[mk_]||0)+1}
  S.pos++;
  if(S.pos>S.text.length-80)extend();
  kids[S.pos].classList.add("cur");
  scroll();
}

function back(){
  if(S.done||S.pos===0)return;
  var kids=textEl.children;kids[S.pos].className="";
  S.pos--;kids[S.pos].className="cur";
  if(S.st[S.pos]){S.ok--}else{S.bad--}
  S.st[S.pos]=undefined;
  scroll();
}

function scroll(){
  var c=textEl.children[S.pos],lh=parseFloat(getComputedStyle(textEl).lineHeight);
  var line=Math.round(c.offsetTop/lh);
  textEl.scrollTop=Math.max(0,(line-1)*lh);
}

function finish(){
  S.done=true;clearInterval(S.timer);
  var wpm=Math.round(S.ok/5/(S.time/60)),tot=S.ok+S.bad,acc=tot?Math.round(S.ok/tot*100):0,raw=Math.round(tot/5/(S.time/60));
  var net=Math.max(0,wpm);
  $("rWpm").textContent=net;$("rAcc").textContent=acc+"%";$("rRaw").textContent=raw;$("rKeys").textContent=S.ok+"/"+S.bad;
  var r=net<25?"Warming up. Keep practising.":net<40?"Solid start. You type at an average pace.":net<60?"Good speed. Above average.":net<80?"Fast. Well above average.":net<100?"Very fast. Professional level.":"Elite typist.";
  $("rank").textContent=r;
  var key="kb_best_"+S.time+"_"+S.lvl,prev=parseInt(store(key)||"0",10);
  if(net>prev){store(key,String(net));$("best").textContent=prev?"New personal best! Previous: "+prev+" WPM.":"First result saved as your best for this mode."}
  else $("best").textContent="Personal best for this mode: "+prev+" WPM.";
  chart();
  var r2=S.raw.slice(0,-0||undefined),mean=r2.reduce(function(a,b){return a+b},0)/(r2.length||1),sd=Math.sqrt(r2.reduce(function(a,b){return a+(b-mean)*(b-mean)},0)/(r2.length||1));
  $("rCons").textContent=(mean?Math.max(0,Math.round(100-sd/mean*100)):0)+"%";
  var ks=Object.keys(S.miss).sort(function(a,b){return S.miss[b]-S.miss[a]}).slice(0,6);
  $("miss").innerHTML=ks.length?ks.map(function(k){return '<span class="chip"><kbd>'+(k===" "?"space":k.replace(/&/g,"&amp;").replace(/</g,"&lt;"))+'</kbd> '+S.miss[k]+'x</span>'}).join(""):'<span class="best">No mistakes. Clean run.</span>';
  var h=[];try{h=JSON.parse(store("kb_hist")||"[]")}catch(e){}
  h.unshift({w:net,a:acc,t:S.time,l:S.lvl,d:new Date().toLocaleDateString(undefined,{day:"numeric",month:"short"})});h=h.slice(0,8);store("kb_hist",JSON.stringify(h));
  $("hist").innerHTML="<tr><th>Date</th><th>Mode</th><th>WPM</th><th>Accuracy</th></tr>"+h.map(function(x){return "<tr><td>"+x.d+"</td><td>"+x.t+"s, "+x.l+"</td><td>"+x.w+"</td><td>"+x.a+"%</td></tr>"}).join("");
  $("play").style.display="none";$("res").classList.add("show");
  S.summary="I typed "+net+" WPM with "+acc+"% accuracy ("+S.time+"s, "+S.lvl+") on Keystroke.";
}

function chart(){
  var d=S.samples.length?S.samples:[0],max=Math.max.apply(null,d.concat([10])),W=600,H=190,p=24;
  var pts=d.map(function(v,i){var x=p+(d.length>1?i/(d.length-1):0)*(W-2*p),y=H-p-(v/max)*(H-2*p);return x.toFixed(1)+","+y.toFixed(1)}).join(" ");
  var g="";for(var i=0;i<=3;i++){var y=H-p-i/3*(H-2*p);g+='<line x1="'+p+'" x2="'+(W-p)+'" y1="'+y+'" y2="'+y+'" stroke="var(--line)"/><text x="2" y="'+(y+4)+'" font-size="10" fill="var(--dim)">'+Math.round(max*i/3)+'</text>'}
  $("svg").innerHTML=g+'<polyline points="'+pts+'" fill="none" stroke="var(--acc)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>';
}

function restart(){$("res").classList.remove("show");$("play").style.display="";build();focusIn()}
function focusIn(){inp.focus({preventScroll:true});stage.classList.add("active")}

function mk(id,arr,key,fmt){
  var g=$(id);arr.forEach(function(v){
    var b=document.createElement("button");b.className="opt";b.textContent=fmt(v);b.setAttribute("aria-pressed",S[key]===v);
    b.onclick=function(){S[key]=v;store("kb_"+key,String(v));[].forEach.call(g.querySelectorAll(".opt"),function(x){x.setAttribute("aria-pressed","false")});b.setAttribute("aria-pressed","true");build();focusIn()};
    g.appendChild(b)})
}

document.addEventListener("keydown",function(e){
  if(S.done){if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();restart()}return}
  if(e.key==="Tab"||e.key==="Escape"){e.preventDefault();restart();return}
  if(document.activeElement!==inp)return;
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==="Backspace"){e.preventDefault();back()}
  else if(e.key.length===1){e.preventDefault();press(e.key)}
});
inp.addEventListener("input",function(){var v=inp.value;inp.value="";if(v&&v.length===1&&!S.done)press(v)});
inp.addEventListener("blur",function(){if(!S.done&&S.started===false)return;stage.classList.remove("active")});
stage.addEventListener("click",focusIn);
$("restart").onclick=restart;$("again").onclick=restart;
$("share").onclick=function(){var b=$("share");try{navigator.clipboard.writeText(S.summary).then(function(){b.textContent="Copied"})}catch(e){b.textContent="Copy failed"}setTimeout(function(){b.textContent="Copy result"},1800)};
$("theme").onclick=function(){var r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=dark?"light":"dark";store("kb_theme",r.dataset.theme)};

var th=store("kb_theme");if(th)document.documentElement.dataset.theme=th;
var st=parseInt(store("kb_time")||"30",10);if(TIMES.indexOf(st)>-1)S.time=st;
var sl=store("kb_lvl");if(LV.indexOf(sl)>-1)S.lvl=sl;
mk("gTime",TIMES,"time",function(v){return v+"s"});
mk("gLvl",LV,"lvl",function(v){return v[0].toUpperCase()+v.slice(1)});
build();
