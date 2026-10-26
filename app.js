'use strict';
// Finite sampling and fixed mathematical conclusions are separate.
// Quadratic: delta=min(1,epsilon/5), |x+2|<5, hence |x^2-4|<epsilon.
// Jump: epsilon=1; for any L and delta>0 at least one of +/-delta/2 fails.
const $ = id => document.getElementById(id);
const colors={text:'#ebf0f8',gray:'#91a0b4',blue:'#55beff',purple:'#b991ff',green:'#5ae19b',red:'#ff6473',panel:'#1b2433'};
let state;
const N=150;
const logValue=(t,lo,hi)=>lo*Math.pow(hi/lo,t/1000);
const logPosition=(v,lo,hi)=>1000*Math.log(v/lo)/Math.log(hi/lo);
function reset(jump=false){state={jump,automatic:!jump,epsilon:jump?0.5:1,delta:jump?0.5:0.2,limit:jump?0:4};update();}
function samples(s){
 const a=s.jump?0:2,points=[];let left=0,right=0;
 for(const side of [-1,1])for(let i=1;i<=N;i++){
  const x=a+side*s.delta*i/(N+1),y=s.jump?(x<0?-1:1):x*x;
  const fail=Math.abs(y-s.limit)>=s.epsilon;
  if(fail){if(side<0)left++;else right++;}points.push({x,y,fail});
 }
 return {points,left,right};
}
function update(){
 const s=state;if(!s.jump&&s.automatic){s.delta=Math.min(1,s.epsilon/5);s.limit=4;}
 $('quadratic').setAttribute('aria-pressed',String(!s.jump));$('jump').setAttribute('aria-pressed',String(s.jump));
 $('auto').hidden=s.jump;$('sides').hidden=!s.jump;
 $('auto').textContent=`Auto delta: ${s.automatic?'ON':'OFF'}`;$('auto').setAttribute('aria-pressed',String(s.automatic));
 $('epsilon').value=logPosition(s.epsilon,.01,3);$('delta').value=logPosition(s.delta,.001,1.5);
 $('candidate').min=s.jump?-2:2;$('candidate').max=s.jump?2:6;$('candidate').value=s.limit;
 for(const [id,v] of [['epsilon',s.epsilon],['delta',s.delta],['candidate',s.limit]]){$(id+'-value').textContent=v.toFixed(3);$(id).setAttribute('aria-valuetext',v.toFixed(3));}
 for(const id of ['delta','candidate']){const disabled=!s.jump&&s.automatic;$(id).disabled=disabled;document.querySelector(`label[for="${id}"]`).classList.toggle('disabled',disabled);}
 $('base').textContent=`a = ${s.jump?0:2}`;
 $('math-result').textContent=s.jump?'Limit does not exist':'Limit = 4';$('math-result').className=s.jump?'red':'green';
 $('math-detail').textContent=s.jump?'Left -1 != Right +1':'delta = min(1, epsilon / 5)';
 const result=samples(s);$('sample-result').textContent=`Fail: ${result.left+result.right} / ${2*N}`;
 $('sample-result').className=result.left+result.right?'red':'green';$('sample-detail').textContent=`Left: ${result.left}   Right: ${result.right}`;
 draw(result);
}
function draw(result=samples(state)){
 const canvas=$('graph'),ctx=canvas.getContext('2d'),box=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
 const w=box.width,h=box.height;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 const s=state,a=s.jump?0:2,radius=Math.max(.7,s.delta*1.25),xmin=a-radius,xmax=a+radius;
 let ymin=s.jump?-1.5:(xmin<=0&&xmax>=0?0:Math.min(xmin*xmin,xmax*xmax)),ymax=s.jump?1.5:Math.max(xmin*xmin,xmax*xmax);
 ymin=Math.min(ymin,s.limit-s.epsilon);ymax=Math.max(ymax,s.limit+s.epsilon);const pad=(ymax-ymin)*.12;ymin-=pad;ymax+=pad;
 const p={x:42,y:18,w:w-58,h:h-52};const X=x=>p.x+(x-xmin)/(xmax-xmin)*p.w,Y=y=>p.y+p.h-(y-ymin)/(ymax-ymin)*p.h;
 function line(x1,y1,x2,y2,c,width=1,dash=[]){ctx.strokeStyle=c;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);}
 ctx.clearRect(0,0,w,h);ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,p.w,p.h);ctx.clip();
 ctx.fillStyle='#b991ff2e';ctx.fillRect(p.x,Y(s.limit+s.epsilon),p.w,Y(s.limit-s.epsilon)-Y(s.limit+s.epsilon));
 ctx.fillStyle='#55beff29';ctx.fillRect(X(a-s.delta),p.y,X(a+s.delta)-X(a-s.delta),p.h);
 for(let i=0;i<=8;i++){line(p.x+p.w*i/8,p.y,p.x+p.w*i/8,p.y+p.h,'#91a0b426');line(p.x,p.y+p.h*i/8,p.x+p.w,p.y+p.h*i/8,'#91a0b426');}
 for(const x of [a-s.delta,a+s.delta])line(X(x),p.y,X(x),p.y+p.h,colors.blue,1,[6,6]);
 line(X(a),p.y,X(a),p.y+p.h,colors.gray,1,[6,6]);
 for(const y of [s.limit-s.epsilon,s.limit+s.epsilon])line(p.x,Y(y),p.x+p.w,Y(y),colors.purple,1,[6,6]);
 line(p.x,Y(s.limit),p.x+p.w,Y(s.limit),colors.purple,1.5);
 if(s.jump){line(X(xmin),Y(-1),X(0),Y(-1),colors.text,3);line(X(0),Y(1),X(xmax),Y(1),colors.text,3);}
 else{ctx.beginPath();for(let i=0;i<=800;i++){const x=xmin+(xmax-xmin)*i/800;i?ctx.lineTo(X(x),Y(x*x)):ctx.moveTo(X(x),Y(x*x));}ctx.strokeStyle=colors.text;ctx.lineWidth=3;ctx.stroke();}
 for(const t of result.points){const x=X(t.x),y=Y(t.y);if(t.fail){line(x-3,y-3,x+3,y+3,colors.red,1.8);line(x-3,y+3,x+3,y-3,colors.red,1.8);}else{ctx.fillStyle=colors.green;ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();}}
 if(s.jump)for(const y of [-1,1]){ctx.beginPath();ctx.arc(X(0),Y(y),6,0,Math.PI*2);ctx.fillStyle=colors.panel;ctx.fill();ctx.strokeStyle=colors.text;ctx.lineWidth=1.5;ctx.stroke();}
 ctx.restore();ctx.fillStyle=colors.gray;ctx.font='14px Tema, sans-serif';ctx.textAlign='center';ctx.textBaseline='top';
 for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4;ctx.fillText(x.toFixed(2),X(x),p.y+p.h+10);}
 ctx.textAlign='right';ctx.textBaseline='middle';for(let i=0;i<=4;i++){const y=ymin+(ymax-ymin)*i/4;ctx.fillText(y.toFixed(1),p.x-8,Y(y));}
}
$('quadratic').onclick=()=>reset(false);$('jump').onclick=()=>reset(true);$('reset').onclick=()=>reset(state.jump);
$('auto').onclick=()=>{state.automatic=!state.automatic;update();};
$('epsilon').oninput=e=>{state.epsilon=logValue(+e.target.value,.01,3);update();};
$('delta').oninput=e=>{state.delta=logValue(+e.target.value,.001,1.5);update();};
$('candidate').oninput=e=>{state.limit=+e.target.value;update();};
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==='1')reset(false);if(e.key==='2')reset(true);if(e.key.toLowerCase()==='r')reset(state.jump);});
reset();new ResizeObserver(()=>draw()).observe($('graph'));document.fonts.ready.then(()=>draw());
