(function(root){
const defaults={name:'Form01',version:'1.0',designer:'互助營造',b0:100,h0:1.5,l0:.35,b1:4.5,h1:10.5,l1:.9,b2:4.5,h2:10.5,l2:.9,e0:70000,fb0:140,fv0:10,e1:70000,fb1:160,fv1:14,e2:70000,fb2:160,fv2:14,limit0:.3,limit1:.3,limit2:.3,ratio:300,defMode:'absolute',slabThickness:35,extraDead:0,live:.2,impact:.2,beam0:'simple',beam1:'simple',beam2:'simple',support:'tube',lb:100,k:1,diameter:4.85,thick:.25,es:2100000,fy:2400,rated:4.37};
function beam(w,L,E,I,mode){
 const ends=mode==='simple'?[[0,0]]:[[0,-w*L*L/10],[-w*L*L/10,-w*L*L/10],[-w*L*L/10,0]];
 let M=0,V=0,def=0,peakX=0,peakSpan=1;
 const spans=ends.map(([a,b],index)=>{
  const R=w*L/2+(b-a)/L,C=-(a*L*L/2+R*L**3/6-w*L**4/24)/L;
  const moment=x=>a+R*x-w*x*x/2, slope=x=>a*x+R*x*x/2-w*x**3/6+C;
  const y=x=>(a*x*x/2+R*x**3/6-w*x**4/24+C*x)/(E*I);
  let points=[0,L];if(w>0&&R/w>0&&R/w<L)M=Math.max(M,Math.abs(moment(R/w)));
  for(let j=1;j<=100;j++){let lo=L*(j-1)/100,hi=L*j/100;if(slope(lo)*slope(hi)<0){for(let k=0;k<50;k++){let mid=(lo+hi)/2;if(slope(lo)*slope(mid)<=0)hi=mid;else lo=mid;}points.push((lo+hi)/2);}else if(slope(lo)===0)points.push(lo);}
  let sd=0,sx=0;for(let x of points){if(Math.abs(y(x))>sd){sd=Math.abs(y(x));sx=x;}}
  if(sd>def){def=sd;peakX=sx;peakSpan=index+1;}M=Math.max(M,Math.abs(a),Math.abs(b));V=Math.max(V,Math.abs(R),Math.abs(R-w*L));
  return{a,b,R,C,def:sd,x:sx};
 });return{M,V,def,spans,peakX,peakSpan};
}
function calculate(s){let errors=[];const pos=['slabThickness','b0','h0','l0','b1','h1','l1','b2','h2','l2','e0','fb0','fv0','e1','fb1','fv1','e2','fb2','fv2'];if(s.defMode==='absolute')pos.push('limit0','limit1','limit2');else pos.push('ratio');if(s.support==='tube')pos.push('lb','k','diameter','thick','es','fy');else pos.push('rated');for(let n of pos)if(!Number.isFinite(s[n])||s[n]<=0)errors.push(n);for(let n of ['extraDead','live','impact'])if(!Number.isFinite(s[n])||s[n]<0)errors.push(n);if(s.support==='tube'&&s.thick*2>=s.diameter)errors.push('thick');if(errors.length)return{errors};let concreteDead=s.slabThickness/100*2.4,dead=concreteDead+s.extraDead,q=dead+s.live+s.impact;
let widths=[s.b0/100,s.l0,s.l1];
let members=widths.map((width,i)=>{let b=s['b'+i],h=s['h'+i],L=s['l'+i]*100,A=b*h,I=b*h**3/12,Z=b*h*h/6,w=q*10*width,r=beam(w,L,s['e'+i],I,s['beam'+i]);let limit=s.defMode==='absolute'?s['limit'+i]:L/s.ratio,fb=r.M/Z,fv=1.5*r.V/A;return{...r,b,h,L,A,I,Z,w,width,fb,fv,limit,ratios:[fb/s['fb'+i],fv/s['fv'+i],r.def/limit],pass:fb<=s['fb'+i]&&fv<=s['fv'+i]&&r.def<=limit};});
let P=q*s.l1*s.l2;let support={P,capacity:s.rated};if(s.support==='tube'){let D=s.diameter,d=D-2*s.thick,A=Math.PI*(D*D-d*d)/4,I=Math.PI*(D**4-d**4)/64,Z=2*I/D,r=Math.sqrt(I/A),slender=s.k*s.lb/r,Cc=Math.sqrt(2*Math.PI**2*s.es/s.fy),t=slender/Cc,FS=5/3+3*t/8-t**3/8;let Fa=slender<Cc?(1-t*t/2)*s.fy/FS:12*Math.PI**2*s.es/(23*slender**2);support={P,A,I,Z,r,slender,Cc,Fa,FS,capacity:Fa*A/1000,slenderOK:slender<=200};}support.ratio=P/support.capacity;support.pass=support.ratio<=1&&support.slenderOK!==false;return{errors:[],concreteDead,dead,q,members,support,pass:members.every(m=>m.pass)&&support.pass};}
root.FormCalc={defaults,calculate,beam};if(typeof module!=='undefined')module.exports=root.FormCalc;
})(typeof window!=='undefined'?window:globalThis);
