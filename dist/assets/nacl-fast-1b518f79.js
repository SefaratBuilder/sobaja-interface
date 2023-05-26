import{ac as C0,aw as N0,F as P0}from"./index-52a2ca78.js";var g0={exports:{}};(function(Qf){(function(Y){var U=function(r){var t,x=new Float64Array(16);if(r)for(t=0;t<r.length;t++)x[t]=r[t];return x},wf=function(){throw new Error("no PRNG")},A0=new Uint8Array(16),mf=new Uint8Array(32);mf[0]=9;var zf=U(),Ef=U([1]),p0=U([56129,1]),kf=U([30883,4953,19914,30187,55467,16705,2637,112,59544,30585,16505,36039,65139,11119,27886,20995]),U0=U([61785,9906,39828,60374,45398,33411,5274,224,53552,61171,33010,6542,64743,22239,55772,9222]),f0=U([54554,36645,11616,51542,42930,38181,51040,26924,56412,64982,57905,49316,21502,52590,14035,8553]),r0=U([26200,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214]),B0=U([41136,18958,6951,50414,58488,44335,6150,12099,55207,15867,153,11085,57099,20417,9344,11139]);function x0(r,t,x,f){r[t]=x>>24&255,r[t+1]=x>>16&255,r[t+2]=x>>8&255,r[t+3]=x&255,r[t+4]=f>>24&255,r[t+5]=f>>16&255,r[t+6]=f>>8&255,r[t+7]=f&255}function Of(r,t,x,f,e){var n,i=0;for(n=0;n<e;n++)i|=r[t+n]^x[f+n];return(1&i-1>>>8)-1}function t0(r,t,x,f){return Of(r,t,x,f,16)}function Cf(r,t,x,f){return Of(r,t,x,f,32)}function S0(r,t,x,f){for(var e=f[0]&255|(f[1]&255)<<8|(f[2]&255)<<16|(f[3]&255)<<24,n=x[0]&255|(x[1]&255)<<8|(x[2]&255)<<16|(x[3]&255)<<24,i=x[4]&255|(x[5]&255)<<8|(x[6]&255)<<16|(x[7]&255)<<24,s=x[8]&255|(x[9]&255)<<8|(x[10]&255)<<16|(x[11]&255)<<24,v=x[12]&255|(x[13]&255)<<8|(x[14]&255)<<16|(x[15]&255)<<24,p=f[4]&255|(f[5]&255)<<8|(f[6]&255)<<16|(f[7]&255)<<24,_=t[0]&255|(t[1]&255)<<8|(t[2]&255)<<16|(t[3]&255)<<24,X=t[4]&255|(t[5]&255)<<8|(t[6]&255)<<16|(t[7]&255)<<24,w=t[8]&255|(t[9]&255)<<8|(t[10]&255)<<16|(t[11]&255)<<24,M=t[12]&255|(t[13]&255)<<8|(t[14]&255)<<16|(t[15]&255)<<24,T=f[8]&255|(f[9]&255)<<8|(f[10]&255)<<16|(f[11]&255)<<24,O=x[16]&255|(x[17]&255)<<8|(x[18]&255)<<16|(x[19]&255)<<24,z=x[20]&255|(x[21]&255)<<8|(x[22]&255)<<16|(x[23]&255)<<24,j=x[24]&255|(x[25]&255)<<8|(x[26]&255)<<16|(x[27]&255)<<24,R=x[28]&255|(x[29]&255)<<8|(x[30]&255)<<16|(x[31]&255)<<24,L=f[12]&255|(f[13]&255)<<8|(f[14]&255)<<16|(f[15]&255)<<24,E=e,B=n,l=i,g=s,A=v,y=p,o=_,h=X,u=w,c=M,b=T,d=O,S=z,C=j,P=R,N=L,a,F=0;F<20;F+=2)a=E+S|0,A^=a<<7|a>>>32-7,a=A+E|0,u^=a<<9|a>>>32-9,a=u+A|0,S^=a<<13|a>>>32-13,a=S+u|0,E^=a<<18|a>>>32-18,a=y+B|0,c^=a<<7|a>>>32-7,a=c+y|0,C^=a<<9|a>>>32-9,a=C+c|0,B^=a<<13|a>>>32-13,a=B+C|0,y^=a<<18|a>>>32-18,a=b+o|0,P^=a<<7|a>>>32-7,a=P+b|0,l^=a<<9|a>>>32-9,a=l+P|0,o^=a<<13|a>>>32-13,a=o+l|0,b^=a<<18|a>>>32-18,a=N+d|0,g^=a<<7|a>>>32-7,a=g+N|0,h^=a<<9|a>>>32-9,a=h+g|0,d^=a<<13|a>>>32-13,a=d+h|0,N^=a<<18|a>>>32-18,a=E+g|0,B^=a<<7|a>>>32-7,a=B+E|0,l^=a<<9|a>>>32-9,a=l+B|0,g^=a<<13|a>>>32-13,a=g+l|0,E^=a<<18|a>>>32-18,a=y+A|0,o^=a<<7|a>>>32-7,a=o+y|0,h^=a<<9|a>>>32-9,a=h+o|0,A^=a<<13|a>>>32-13,a=A+h|0,y^=a<<18|a>>>32-18,a=b+c|0,d^=a<<7|a>>>32-7,a=d+b|0,u^=a<<9|a>>>32-9,a=u+d|0,c^=a<<13|a>>>32-13,a=c+u|0,b^=a<<18|a>>>32-18,a=N+P|0,S^=a<<7|a>>>32-7,a=S+N|0,C^=a<<9|a>>>32-9,a=C+S|0,P^=a<<13|a>>>32-13,a=P+C|0,N^=a<<18|a>>>32-18;E=E+e|0,B=B+n|0,l=l+i|0,g=g+s|0,A=A+v|0,y=y+p|0,o=o+_|0,h=h+X|0,u=u+w|0,c=c+M|0,b=b+T|0,d=d+O|0,S=S+z|0,C=C+j|0,P=P+R|0,N=N+L|0,r[0]=E>>>0&255,r[1]=E>>>8&255,r[2]=E>>>16&255,r[3]=E>>>24&255,r[4]=B>>>0&255,r[5]=B>>>8&255,r[6]=B>>>16&255,r[7]=B>>>24&255,r[8]=l>>>0&255,r[9]=l>>>8&255,r[10]=l>>>16&255,r[11]=l>>>24&255,r[12]=g>>>0&255,r[13]=g>>>8&255,r[14]=g>>>16&255,r[15]=g>>>24&255,r[16]=A>>>0&255,r[17]=A>>>8&255,r[18]=A>>>16&255,r[19]=A>>>24&255,r[20]=y>>>0&255,r[21]=y>>>8&255,r[22]=y>>>16&255,r[23]=y>>>24&255,r[24]=o>>>0&255,r[25]=o>>>8&255,r[26]=o>>>16&255,r[27]=o>>>24&255,r[28]=h>>>0&255,r[29]=h>>>8&255,r[30]=h>>>16&255,r[31]=h>>>24&255,r[32]=u>>>0&255,r[33]=u>>>8&255,r[34]=u>>>16&255,r[35]=u>>>24&255,r[36]=c>>>0&255,r[37]=c>>>8&255,r[38]=c>>>16&255,r[39]=c>>>24&255,r[40]=b>>>0&255,r[41]=b>>>8&255,r[42]=b>>>16&255,r[43]=b>>>24&255,r[44]=d>>>0&255,r[45]=d>>>8&255,r[46]=d>>>16&255,r[47]=d>>>24&255,r[48]=S>>>0&255,r[49]=S>>>8&255,r[50]=S>>>16&255,r[51]=S>>>24&255,r[52]=C>>>0&255,r[53]=C>>>8&255,r[54]=C>>>16&255,r[55]=C>>>24&255,r[56]=P>>>0&255,r[57]=P>>>8&255,r[58]=P>>>16&255,r[59]=P>>>24&255,r[60]=N>>>0&255,r[61]=N>>>8&255,r[62]=N>>>16&255,r[63]=N>>>24&255}function Y0(r,t,x,f){for(var e=f[0]&255|(f[1]&255)<<8|(f[2]&255)<<16|(f[3]&255)<<24,n=x[0]&255|(x[1]&255)<<8|(x[2]&255)<<16|(x[3]&255)<<24,i=x[4]&255|(x[5]&255)<<8|(x[6]&255)<<16|(x[7]&255)<<24,s=x[8]&255|(x[9]&255)<<8|(x[10]&255)<<16|(x[11]&255)<<24,v=x[12]&255|(x[13]&255)<<8|(x[14]&255)<<16|(x[15]&255)<<24,p=f[4]&255|(f[5]&255)<<8|(f[6]&255)<<16|(f[7]&255)<<24,_=t[0]&255|(t[1]&255)<<8|(t[2]&255)<<16|(t[3]&255)<<24,X=t[4]&255|(t[5]&255)<<8|(t[6]&255)<<16|(t[7]&255)<<24,w=t[8]&255|(t[9]&255)<<8|(t[10]&255)<<16|(t[11]&255)<<24,M=t[12]&255|(t[13]&255)<<8|(t[14]&255)<<16|(t[15]&255)<<24,T=f[8]&255|(f[9]&255)<<8|(f[10]&255)<<16|(f[11]&255)<<24,O=x[16]&255|(x[17]&255)<<8|(x[18]&255)<<16|(x[19]&255)<<24,z=x[20]&255|(x[21]&255)<<8|(x[22]&255)<<16|(x[23]&255)<<24,j=x[24]&255|(x[25]&255)<<8|(x[26]&255)<<16|(x[27]&255)<<24,R=x[28]&255|(x[29]&255)<<8|(x[30]&255)<<16|(x[31]&255)<<24,L=f[12]&255|(f[13]&255)<<8|(f[14]&255)<<16|(f[15]&255)<<24,E=e,B=n,l=i,g=s,A=v,y=p,o=_,h=X,u=w,c=M,b=T,d=O,S=z,C=j,P=R,N=L,a,F=0;F<20;F+=2)a=E+S|0,A^=a<<7|a>>>32-7,a=A+E|0,u^=a<<9|a>>>32-9,a=u+A|0,S^=a<<13|a>>>32-13,a=S+u|0,E^=a<<18|a>>>32-18,a=y+B|0,c^=a<<7|a>>>32-7,a=c+y|0,C^=a<<9|a>>>32-9,a=C+c|0,B^=a<<13|a>>>32-13,a=B+C|0,y^=a<<18|a>>>32-18,a=b+o|0,P^=a<<7|a>>>32-7,a=P+b|0,l^=a<<9|a>>>32-9,a=l+P|0,o^=a<<13|a>>>32-13,a=o+l|0,b^=a<<18|a>>>32-18,a=N+d|0,g^=a<<7|a>>>32-7,a=g+N|0,h^=a<<9|a>>>32-9,a=h+g|0,d^=a<<13|a>>>32-13,a=d+h|0,N^=a<<18|a>>>32-18,a=E+g|0,B^=a<<7|a>>>32-7,a=B+E|0,l^=a<<9|a>>>32-9,a=l+B|0,g^=a<<13|a>>>32-13,a=g+l|0,E^=a<<18|a>>>32-18,a=y+A|0,o^=a<<7|a>>>32-7,a=o+y|0,h^=a<<9|a>>>32-9,a=h+o|0,A^=a<<13|a>>>32-13,a=A+h|0,y^=a<<18|a>>>32-18,a=b+c|0,d^=a<<7|a>>>32-7,a=d+b|0,u^=a<<9|a>>>32-9,a=u+d|0,c^=a<<13|a>>>32-13,a=c+u|0,b^=a<<18|a>>>32-18,a=N+P|0,S^=a<<7|a>>>32-7,a=S+N|0,C^=a<<9|a>>>32-9,a=C+S|0,P^=a<<13|a>>>32-13,a=P+C|0,N^=a<<18|a>>>32-18;r[0]=E>>>0&255,r[1]=E>>>8&255,r[2]=E>>>16&255,r[3]=E>>>24&255,r[4]=y>>>0&255,r[5]=y>>>8&255,r[6]=y>>>16&255,r[7]=y>>>24&255,r[8]=b>>>0&255,r[9]=b>>>8&255,r[10]=b>>>16&255,r[11]=b>>>24&255,r[12]=N>>>0&255,r[13]=N>>>8&255,r[14]=N>>>16&255,r[15]=N>>>24&255,r[16]=o>>>0&255,r[17]=o>>>8&255,r[18]=o>>>16&255,r[19]=o>>>24&255,r[20]=h>>>0&255,r[21]=h>>>8&255,r[22]=h>>>16&255,r[23]=h>>>24&255,r[24]=u>>>0&255,r[25]=u>>>8&255,r[26]=u>>>16&255,r[27]=u>>>24&255,r[28]=c>>>0&255,r[29]=c>>>8&255,r[30]=c>>>16&255,r[31]=c>>>24&255}function gf(r,t,x,f){S0(r,t,x,f)}function Af(r,t,x,f){Y0(r,t,x,f)}var of=new Uint8Array([101,120,112,97,110,100,32,51,50,45,98,121,116,101,32,107]);function e0(r,t,x,f,e,n,i){var s=new Uint8Array(16),v=new Uint8Array(64),p,_;for(_=0;_<16;_++)s[_]=0;for(_=0;_<8;_++)s[_]=n[_];for(;e>=64;){for(gf(v,s,i,of),_=0;_<64;_++)r[t+_]=x[f+_]^v[_];for(p=1,_=8;_<16;_++)p=p+(s[_]&255)|0,s[_]=p&255,p>>>=8;e-=64,t+=64,f+=64}if(e>0)for(gf(v,s,i,of),_=0;_<e;_++)r[t+_]=x[f+_]^v[_];return 0}function a0(r,t,x,f,e){var n=new Uint8Array(16),i=new Uint8Array(64),s,v;for(v=0;v<16;v++)n[v]=0;for(v=0;v<8;v++)n[v]=f[v];for(;x>=64;){for(gf(i,n,e,of),v=0;v<64;v++)r[t+v]=i[v];for(s=1,v=8;v<16;v++)s=s+(n[v]&255)|0,n[v]=s&255,s>>>=8;x-=64,t+=64}if(x>0)for(gf(i,n,e,of),v=0;v<x;v++)r[t+v]=i[v];return 0}function n0(r,t,x,f,e){var n=new Uint8Array(32);Af(n,f,e,of);for(var i=new Uint8Array(8),s=0;s<8;s++)i[s]=f[s+16];return a0(r,t,x,i,n)}function Nf(r,t,x,f,e,n,i){var s=new Uint8Array(32);Af(s,n,i,of);for(var v=new Uint8Array(8),p=0;p<8;p++)v[p]=n[p+16];return e0(r,t,x,f,e,v,s)}var pf=function(r){this.buffer=new Uint8Array(16),this.r=new Uint16Array(10),this.h=new Uint16Array(10),this.pad=new Uint16Array(8),this.leftover=0,this.fin=0;var t,x,f,e,n,i,s,v;t=r[0]&255|(r[1]&255)<<8,this.r[0]=t&8191,x=r[2]&255|(r[3]&255)<<8,this.r[1]=(t>>>13|x<<3)&8191,f=r[4]&255|(r[5]&255)<<8,this.r[2]=(x>>>10|f<<6)&7939,e=r[6]&255|(r[7]&255)<<8,this.r[3]=(f>>>7|e<<9)&8191,n=r[8]&255|(r[9]&255)<<8,this.r[4]=(e>>>4|n<<12)&255,this.r[5]=n>>>1&8190,i=r[10]&255|(r[11]&255)<<8,this.r[6]=(n>>>14|i<<2)&8191,s=r[12]&255|(r[13]&255)<<8,this.r[7]=(i>>>11|s<<5)&8065,v=r[14]&255|(r[15]&255)<<8,this.r[8]=(s>>>8|v<<8)&8191,this.r[9]=v>>>5&127,this.pad[0]=r[16]&255|(r[17]&255)<<8,this.pad[1]=r[18]&255|(r[19]&255)<<8,this.pad[2]=r[20]&255|(r[21]&255)<<8,this.pad[3]=r[22]&255|(r[23]&255)<<8,this.pad[4]=r[24]&255|(r[25]&255)<<8,this.pad[5]=r[26]&255|(r[27]&255)<<8,this.pad[6]=r[28]&255|(r[29]&255)<<8,this.pad[7]=r[30]&255|(r[31]&255)<<8};pf.prototype.blocks=function(r,t,x){for(var f=this.fin?0:2048,e,n,i,s,v,p,_,X,w,M,T,O,z,j,R,L,E,B,l,g=this.h[0],A=this.h[1],y=this.h[2],o=this.h[3],h=this.h[4],u=this.h[5],c=this.h[6],b=this.h[7],d=this.h[8],S=this.h[9],C=this.r[0],P=this.r[1],N=this.r[2],a=this.r[3],F=this.r[4],G=this.r[5],V=this.r[6],K=this.r[7],I=this.r[8],D=this.r[9];x>=16;)e=r[t+0]&255|(r[t+1]&255)<<8,g+=e&8191,n=r[t+2]&255|(r[t+3]&255)<<8,A+=(e>>>13|n<<3)&8191,i=r[t+4]&255|(r[t+5]&255)<<8,y+=(n>>>10|i<<6)&8191,s=r[t+6]&255|(r[t+7]&255)<<8,o+=(i>>>7|s<<9)&8191,v=r[t+8]&255|(r[t+9]&255)<<8,h+=(s>>>4|v<<12)&8191,u+=v>>>1&8191,p=r[t+10]&255|(r[t+11]&255)<<8,c+=(v>>>14|p<<2)&8191,_=r[t+12]&255|(r[t+13]&255)<<8,b+=(p>>>11|_<<5)&8191,X=r[t+14]&255|(r[t+15]&255)<<8,d+=(_>>>8|X<<8)&8191,S+=X>>>5|f,w=0,M=w,M+=g*C,M+=A*(5*D),M+=y*(5*I),M+=o*(5*K),M+=h*(5*V),w=M>>>13,M&=8191,M+=u*(5*G),M+=c*(5*F),M+=b*(5*a),M+=d*(5*N),M+=S*(5*P),w+=M>>>13,M&=8191,T=w,T+=g*P,T+=A*C,T+=y*(5*D),T+=o*(5*I),T+=h*(5*K),w=T>>>13,T&=8191,T+=u*(5*V),T+=c*(5*G),T+=b*(5*F),T+=d*(5*a),T+=S*(5*N),w+=T>>>13,T&=8191,O=w,O+=g*N,O+=A*P,O+=y*C,O+=o*(5*D),O+=h*(5*I),w=O>>>13,O&=8191,O+=u*(5*K),O+=c*(5*V),O+=b*(5*G),O+=d*(5*F),O+=S*(5*a),w+=O>>>13,O&=8191,z=w,z+=g*a,z+=A*N,z+=y*P,z+=o*C,z+=h*(5*D),w=z>>>13,z&=8191,z+=u*(5*I),z+=c*(5*K),z+=b*(5*V),z+=d*(5*G),z+=S*(5*F),w+=z>>>13,z&=8191,j=w,j+=g*F,j+=A*a,j+=y*N,j+=o*P,j+=h*C,w=j>>>13,j&=8191,j+=u*(5*D),j+=c*(5*I),j+=b*(5*K),j+=d*(5*V),j+=S*(5*G),w+=j>>>13,j&=8191,R=w,R+=g*G,R+=A*F,R+=y*a,R+=o*N,R+=h*P,w=R>>>13,R&=8191,R+=u*C,R+=c*(5*D),R+=b*(5*I),R+=d*(5*K),R+=S*(5*V),w+=R>>>13,R&=8191,L=w,L+=g*V,L+=A*G,L+=y*F,L+=o*a,L+=h*N,w=L>>>13,L&=8191,L+=u*P,L+=c*C,L+=b*(5*D),L+=d*(5*I),L+=S*(5*K),w+=L>>>13,L&=8191,E=w,E+=g*K,E+=A*V,E+=y*G,E+=o*F,E+=h*a,w=E>>>13,E&=8191,E+=u*N,E+=c*P,E+=b*C,E+=d*(5*D),E+=S*(5*I),w+=E>>>13,E&=8191,B=w,B+=g*I,B+=A*K,B+=y*V,B+=o*G,B+=h*F,w=B>>>13,B&=8191,B+=u*a,B+=c*N,B+=b*P,B+=d*C,B+=S*(5*D),w+=B>>>13,B&=8191,l=w,l+=g*D,l+=A*I,l+=y*K,l+=o*V,l+=h*G,w=l>>>13,l&=8191,l+=u*F,l+=c*a,l+=b*N,l+=d*P,l+=S*C,w+=l>>>13,l&=8191,w=(w<<2)+w|0,w=w+M|0,M=w&8191,w=w>>>13,T+=w,g=M,A=T,y=O,o=z,h=j,u=R,c=L,b=E,d=B,S=l,t+=16,x-=16;this.h[0]=g,this.h[1]=A,this.h[2]=y,this.h[3]=o,this.h[4]=h,this.h[5]=u,this.h[6]=c,this.h[7]=b,this.h[8]=d,this.h[9]=S},pf.prototype.finish=function(r,t){var x=new Uint16Array(10),f,e,n,i;if(this.leftover){for(i=this.leftover,this.buffer[i++]=1;i<16;i++)this.buffer[i]=0;this.fin=1,this.blocks(this.buffer,0,16)}for(f=this.h[1]>>>13,this.h[1]&=8191,i=2;i<10;i++)this.h[i]+=f,f=this.h[i]>>>13,this.h[i]&=8191;for(this.h[0]+=f*5,f=this.h[0]>>>13,this.h[0]&=8191,this.h[1]+=f,f=this.h[1]>>>13,this.h[1]&=8191,this.h[2]+=f,x[0]=this.h[0]+5,f=x[0]>>>13,x[0]&=8191,i=1;i<10;i++)x[i]=this.h[i]+f,f=x[i]>>>13,x[i]&=8191;for(x[9]-=8192,e=(f^1)-1,i=0;i<10;i++)x[i]&=e;for(e=~e,i=0;i<10;i++)this.h[i]=this.h[i]&e|x[i];for(this.h[0]=(this.h[0]|this.h[1]<<13)&65535,this.h[1]=(this.h[1]>>>3|this.h[2]<<10)&65535,this.h[2]=(this.h[2]>>>6|this.h[3]<<7)&65535,this.h[3]=(this.h[3]>>>9|this.h[4]<<4)&65535,this.h[4]=(this.h[4]>>>12|this.h[5]<<1|this.h[6]<<14)&65535,this.h[5]=(this.h[6]>>>2|this.h[7]<<11)&65535,this.h[6]=(this.h[7]>>>5|this.h[8]<<8)&65535,this.h[7]=(this.h[8]>>>8|this.h[9]<<5)&65535,n=this.h[0]+this.pad[0],this.h[0]=n&65535,i=1;i<8;i++)n=(this.h[i]+this.pad[i]|0)+(n>>>16)|0,this.h[i]=n&65535;r[t+0]=this.h[0]>>>0&255,r[t+1]=this.h[0]>>>8&255,r[t+2]=this.h[1]>>>0&255,r[t+3]=this.h[1]>>>8&255,r[t+4]=this.h[2]>>>0&255,r[t+5]=this.h[2]>>>8&255,r[t+6]=this.h[3]>>>0&255,r[t+7]=this.h[3]>>>8&255,r[t+8]=this.h[4]>>>0&255,r[t+9]=this.h[4]>>>8&255,r[t+10]=this.h[5]>>>0&255,r[t+11]=this.h[5]>>>8&255,r[t+12]=this.h[6]>>>0&255,r[t+13]=this.h[6]>>>8&255,r[t+14]=this.h[7]>>>0&255,r[t+15]=this.h[7]>>>8&255},pf.prototype.update=function(r,t,x){var f,e;if(this.leftover){for(e=16-this.leftover,e>x&&(e=x),f=0;f<e;f++)this.buffer[this.leftover+f]=r[t+f];if(x-=e,t+=e,this.leftover+=e,this.leftover<16)return;this.blocks(this.buffer,0,16),this.leftover=0}if(x>=16&&(e=x-x%16,this.blocks(r,t,e),t+=e,x-=e),x){for(f=0;f<x;f++)this.buffer[this.leftover+f]=r[t+f];this.leftover+=x}};function Pf(r,t,x,f,e,n){var i=new pf(n);return i.update(x,f,e),i.finish(r,t),0}function i0(r,t,x,f,e,n){var i=new Uint8Array(16);return Pf(i,0,x,f,e,n),t0(r,t,i,0)}function Kf(r,t,x,f,e){var n;if(x<32)return-1;for(Nf(r,0,t,0,x,f,e),Pf(r,16,r,32,x-32,r),n=0;n<16;n++)r[n]=0;return 0}function Ff(r,t,x,f,e){var n,i=new Uint8Array(32);if(x<32||(n0(i,0,32,f,e),i0(t,16,t,32,x-32,i)!==0))return-1;for(Nf(r,0,t,0,x,f,e),n=0;n<32;n++)r[n]=0;return 0}function af(r,t){var x;for(x=0;x<16;x++)r[x]=t[x]|0}function Zf(r){var t,x,f=1;for(t=0;t<16;t++)x=r[t]+f+65535,f=Math.floor(x/65536),r[t]=x-f*65536;r[0]+=f-1+37*(f-1)}function sf(r,t,x){for(var f,e=~(x-1),n=0;n<16;n++)f=e&(r[n]^t[n]),r[n]^=f,t[n]^=f}function bf(r,t){var x,f,e,n=U(),i=U();for(x=0;x<16;x++)i[x]=t[x];for(Zf(i),Zf(i),Zf(i),f=0;f<2;f++){for(n[0]=i[0]-65517,x=1;x<15;x++)n[x]=i[x]-65535-(n[x-1]>>16&1),n[x-1]&=65535;n[15]=i[15]-32767-(n[14]>>16&1),e=n[15]>>16&1,n[14]&=65535,sf(i,n,1-e)}for(x=0;x<16;x++)r[2*x]=i[x]&255,r[2*x+1]=i[x]>>8}function o0(r,t){var x=new Uint8Array(32),f=new Uint8Array(32);return bf(x,r),bf(f,t),Cf(x,0,f,0)}function h0(r){var t=new Uint8Array(32);return bf(t,r),t[0]&1}function If(r,t){var x;for(x=0;x<16;x++)r[x]=t[2*x]+(t[2*x+1]<<8);r[15]&=32767}function tf(r,t,x){for(var f=0;f<16;f++)r[f]=t[f]+x[f]}function ef(r,t,x){for(var f=0;f<16;f++)r[f]=t[f]-x[f]}function Z(r,t,x){var f,e,n=0,i=0,s=0,v=0,p=0,_=0,X=0,w=0,M=0,T=0,O=0,z=0,j=0,R=0,L=0,E=0,B=0,l=0,g=0,A=0,y=0,o=0,h=0,u=0,c=0,b=0,d=0,S=0,C=0,P=0,N=0,a=x[0],F=x[1],G=x[2],V=x[3],K=x[4],I=x[5],D=x[6],q=x[7],$=x[8],H=x[9],J=x[10],W=x[11],Q=x[12],m=x[13],k=x[14],ff=x[15];f=t[0],n+=f*a,i+=f*F,s+=f*G,v+=f*V,p+=f*K,_+=f*I,X+=f*D,w+=f*q,M+=f*$,T+=f*H,O+=f*J,z+=f*W,j+=f*Q,R+=f*m,L+=f*k,E+=f*ff,f=t[1],i+=f*a,s+=f*F,v+=f*G,p+=f*V,_+=f*K,X+=f*I,w+=f*D,M+=f*q,T+=f*$,O+=f*H,z+=f*J,j+=f*W,R+=f*Q,L+=f*m,E+=f*k,B+=f*ff,f=t[2],s+=f*a,v+=f*F,p+=f*G,_+=f*V,X+=f*K,w+=f*I,M+=f*D,T+=f*q,O+=f*$,z+=f*H,j+=f*J,R+=f*W,L+=f*Q,E+=f*m,B+=f*k,l+=f*ff,f=t[3],v+=f*a,p+=f*F,_+=f*G,X+=f*V,w+=f*K,M+=f*I,T+=f*D,O+=f*q,z+=f*$,j+=f*H,R+=f*J,L+=f*W,E+=f*Q,B+=f*m,l+=f*k,g+=f*ff,f=t[4],p+=f*a,_+=f*F,X+=f*G,w+=f*V,M+=f*K,T+=f*I,O+=f*D,z+=f*q,j+=f*$,R+=f*H,L+=f*J,E+=f*W,B+=f*Q,l+=f*m,g+=f*k,A+=f*ff,f=t[5],_+=f*a,X+=f*F,w+=f*G,M+=f*V,T+=f*K,O+=f*I,z+=f*D,j+=f*q,R+=f*$,L+=f*H,E+=f*J,B+=f*W,l+=f*Q,g+=f*m,A+=f*k,y+=f*ff,f=t[6],X+=f*a,w+=f*F,M+=f*G,T+=f*V,O+=f*K,z+=f*I,j+=f*D,R+=f*q,L+=f*$,E+=f*H,B+=f*J,l+=f*W,g+=f*Q,A+=f*m,y+=f*k,o+=f*ff,f=t[7],w+=f*a,M+=f*F,T+=f*G,O+=f*V,z+=f*K,j+=f*I,R+=f*D,L+=f*q,E+=f*$,B+=f*H,l+=f*J,g+=f*W,A+=f*Q,y+=f*m,o+=f*k,h+=f*ff,f=t[8],M+=f*a,T+=f*F,O+=f*G,z+=f*V,j+=f*K,R+=f*I,L+=f*D,E+=f*q,B+=f*$,l+=f*H,g+=f*J,A+=f*W,y+=f*Q,o+=f*m,h+=f*k,u+=f*ff,f=t[9],T+=f*a,O+=f*F,z+=f*G,j+=f*V,R+=f*K,L+=f*I,E+=f*D,B+=f*q,l+=f*$,g+=f*H,A+=f*J,y+=f*W,o+=f*Q,h+=f*m,u+=f*k,c+=f*ff,f=t[10],O+=f*a,z+=f*F,j+=f*G,R+=f*V,L+=f*K,E+=f*I,B+=f*D,l+=f*q,g+=f*$,A+=f*H,y+=f*J,o+=f*W,h+=f*Q,u+=f*m,c+=f*k,b+=f*ff,f=t[11],z+=f*a,j+=f*F,R+=f*G,L+=f*V,E+=f*K,B+=f*I,l+=f*D,g+=f*q,A+=f*$,y+=f*H,o+=f*J,h+=f*W,u+=f*Q,c+=f*m,b+=f*k,d+=f*ff,f=t[12],j+=f*a,R+=f*F,L+=f*G,E+=f*V,B+=f*K,l+=f*I,g+=f*D,A+=f*q,y+=f*$,o+=f*H,h+=f*J,u+=f*W,c+=f*Q,b+=f*m,d+=f*k,S+=f*ff,f=t[13],R+=f*a,L+=f*F,E+=f*G,B+=f*V,l+=f*K,g+=f*I,A+=f*D,y+=f*q,o+=f*$,h+=f*H,u+=f*J,c+=f*W,b+=f*Q,d+=f*m,S+=f*k,C+=f*ff,f=t[14],L+=f*a,E+=f*F,B+=f*G,l+=f*V,g+=f*K,A+=f*I,y+=f*D,o+=f*q,h+=f*$,u+=f*H,c+=f*J,b+=f*W,d+=f*Q,S+=f*m,C+=f*k,P+=f*ff,f=t[15],E+=f*a,B+=f*F,l+=f*G,g+=f*V,A+=f*K,y+=f*I,o+=f*D,h+=f*q,u+=f*$,c+=f*H,b+=f*J,d+=f*W,S+=f*Q,C+=f*m,P+=f*k,N+=f*ff,n+=38*B,i+=38*l,s+=38*g,v+=38*A,p+=38*y,_+=38*o,X+=38*h,w+=38*u,M+=38*c,T+=38*b,O+=38*d,z+=38*S,j+=38*C,R+=38*P,L+=38*N,e=1,f=n+e+65535,e=Math.floor(f/65536),n=f-e*65536,f=i+e+65535,e=Math.floor(f/65536),i=f-e*65536,f=s+e+65535,e=Math.floor(f/65536),s=f-e*65536,f=v+e+65535,e=Math.floor(f/65536),v=f-e*65536,f=p+e+65535,e=Math.floor(f/65536),p=f-e*65536,f=_+e+65535,e=Math.floor(f/65536),_=f-e*65536,f=X+e+65535,e=Math.floor(f/65536),X=f-e*65536,f=w+e+65535,e=Math.floor(f/65536),w=f-e*65536,f=M+e+65535,e=Math.floor(f/65536),M=f-e*65536,f=T+e+65535,e=Math.floor(f/65536),T=f-e*65536,f=O+e+65535,e=Math.floor(f/65536),O=f-e*65536,f=z+e+65535,e=Math.floor(f/65536),z=f-e*65536,f=j+e+65535,e=Math.floor(f/65536),j=f-e*65536,f=R+e+65535,e=Math.floor(f/65536),R=f-e*65536,f=L+e+65535,e=Math.floor(f/65536),L=f-e*65536,f=E+e+65535,e=Math.floor(f/65536),E=f-e*65536,n+=e-1+37*(e-1),e=1,f=n+e+65535,e=Math.floor(f/65536),n=f-e*65536,f=i+e+65535,e=Math.floor(f/65536),i=f-e*65536,f=s+e+65535,e=Math.floor(f/65536),s=f-e*65536,f=v+e+65535,e=Math.floor(f/65536),v=f-e*65536,f=p+e+65535,e=Math.floor(f/65536),p=f-e*65536,f=_+e+65535,e=Math.floor(f/65536),_=f-e*65536,f=X+e+65535,e=Math.floor(f/65536),X=f-e*65536,f=w+e+65535,e=Math.floor(f/65536),w=f-e*65536,f=M+e+65535,e=Math.floor(f/65536),M=f-e*65536,f=T+e+65535,e=Math.floor(f/65536),T=f-e*65536,f=O+e+65535,e=Math.floor(f/65536),O=f-e*65536,f=z+e+65535,e=Math.floor(f/65536),z=f-e*65536,f=j+e+65535,e=Math.floor(f/65536),j=f-e*65536,f=R+e+65535,e=Math.floor(f/65536),R=f-e*65536,f=L+e+65535,e=Math.floor(f/65536),L=f-e*65536,f=E+e+65535,e=Math.floor(f/65536),E=f-e*65536,n+=e-1+37*(e-1),r[0]=n,r[1]=i,r[2]=s,r[3]=v,r[4]=p,r[5]=_,r[6]=X,r[7]=w,r[8]=M,r[9]=T,r[10]=O,r[11]=z,r[12]=j,r[13]=R,r[14]=L,r[15]=E}function xf(r,t){Z(r,t,t)}function c0(r,t){var x=U(),f;for(f=0;f<16;f++)x[f]=t[f];for(f=253;f>=0;f--)xf(x,x),f!==2&&f!==4&&Z(x,x,t);for(f=0;f<16;f++)r[f]=x[f]}function s0(r,t){var x=U(),f;for(f=0;f<16;f++)x[f]=t[f];for(f=250;f>=0;f--)xf(x,x),f!==1&&Z(x,x,t);for(f=0;f<16;f++)r[f]=x[f]}function Uf(r,t,x){var f=new Uint8Array(32),e=new Float64Array(80),n,i,s=U(),v=U(),p=U(),_=U(),X=U(),w=U();for(i=0;i<31;i++)f[i]=t[i];for(f[31]=t[31]&127|64,f[0]&=248,If(e,x),i=0;i<16;i++)v[i]=e[i],_[i]=s[i]=p[i]=0;for(s[0]=_[0]=1,i=254;i>=0;--i)n=f[i>>>3]>>>(i&7)&1,sf(s,v,n),sf(p,_,n),tf(X,s,p),ef(s,s,p),tf(p,v,_),ef(v,v,_),xf(_,X),xf(w,s),Z(s,p,s),Z(p,v,X),tf(X,s,p),ef(s,s,p),xf(v,s),ef(p,_,w),Z(s,p,p0),tf(s,s,_),Z(p,p,s),Z(s,_,w),Z(_,v,e),xf(v,X),sf(s,v,n),sf(p,_,n);for(i=0;i<16;i++)e[i+16]=s[i],e[i+32]=p[i],e[i+48]=v[i],e[i+64]=_[i];var M=e.subarray(32),T=e.subarray(16);return c0(M,M),Z(T,T,M),bf(r,T),0}function Bf(r,t){return Uf(r,t,mf)}function b0(r,t){return wf(t,32),Bf(r,t)}function Sf(r,t,x){var f=new Uint8Array(32);return Uf(f,x,t),Af(r,A0,f,of)}var u0=Kf,M0=Ff;function T0(r,t,x,f,e,n){var i=new Uint8Array(32);return Sf(i,e,n),u0(r,t,x,f,i)}function j0(r,t,x,f,e,n){var i=new Uint8Array(32);return Sf(i,e,n),M0(r,t,x,f,i)}var d0=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591];function v0(r,t,x,f){for(var e=new Int32Array(16),n=new Int32Array(16),i,s,v,p,_,X,w,M,T,O,z,j,R,L,E,B,l,g,A,y,o,h,u,c,b,d,S=r[0],C=r[1],P=r[2],N=r[3],a=r[4],F=r[5],G=r[6],V=r[7],K=t[0],I=t[1],D=t[2],q=t[3],$=t[4],H=t[5],J=t[6],W=t[7],Q=0;f>=128;){for(A=0;A<16;A++)y=8*A+Q,e[A]=x[y+0]<<24|x[y+1]<<16|x[y+2]<<8|x[y+3],n[A]=x[y+4]<<24|x[y+5]<<16|x[y+6]<<8|x[y+7];for(A=0;A<80;A++)if(i=S,s=C,v=P,p=N,_=a,X=F,w=G,M=V,T=K,O=I,z=D,j=q,R=$,L=H,E=J,B=W,o=V,h=W,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=(a>>>14|$<<32-14)^(a>>>18|$<<32-18)^($>>>41-32|a<<32-(41-32)),h=($>>>14|a<<32-14)^($>>>18|a<<32-18)^(a>>>41-32|$<<32-(41-32)),u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,o=a&F^~a&G,h=$&H^~$&J,u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,o=d0[A*2],h=d0[A*2+1],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,o=e[A%16],h=n[A%16],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,l=b&65535|d<<16,g=u&65535|c<<16,o=l,h=g,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=(S>>>28|K<<32-28)^(K>>>34-32|S<<32-(34-32))^(K>>>39-32|S<<32-(39-32)),h=(K>>>28|S<<32-28)^(S>>>34-32|K<<32-(34-32))^(S>>>39-32|K<<32-(39-32)),u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,o=S&C^S&P^C&P,h=K&I^K&D^I&D,u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,M=b&65535|d<<16,B=u&65535|c<<16,o=p,h=j,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=l,h=g,u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,p=b&65535|d<<16,j=u&65535|c<<16,C=i,P=s,N=v,a=p,F=_,G=X,V=w,S=M,I=T,D=O,q=z,$=j,H=R,J=L,W=E,K=B,A%16===15)for(y=0;y<16;y++)o=e[y],h=n[y],u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=e[(y+9)%16],h=n[(y+9)%16],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,l=e[(y+1)%16],g=n[(y+1)%16],o=(l>>>1|g<<32-1)^(l>>>8|g<<32-8)^l>>>7,h=(g>>>1|l<<32-1)^(g>>>8|l<<32-8)^(g>>>7|l<<32-7),u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,l=e[(y+14)%16],g=n[(y+14)%16],o=(l>>>19|g<<32-19)^(g>>>61-32|l<<32-(61-32))^l>>>6,h=(g>>>19|l<<32-19)^(l>>>61-32|g<<32-(61-32))^(g>>>6|l<<32-6),u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,e[y]=b&65535|d<<16,n[y]=u&65535|c<<16;o=S,h=K,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=r[0],h=t[0],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,r[0]=S=b&65535|d<<16,t[0]=K=u&65535|c<<16,o=C,h=I,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=r[1],h=t[1],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,r[1]=C=b&65535|d<<16,t[1]=I=u&65535|c<<16,o=P,h=D,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=r[2],h=t[2],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,r[2]=P=b&65535|d<<16,t[2]=D=u&65535|c<<16,o=N,h=q,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=r[3],h=t[3],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,r[3]=N=b&65535|d<<16,t[3]=q=u&65535|c<<16,o=a,h=$,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=r[4],h=t[4],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,r[4]=a=b&65535|d<<16,t[4]=$=u&65535|c<<16,o=F,h=H,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=r[5],h=t[5],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,r[5]=F=b&65535|d<<16,t[5]=H=u&65535|c<<16,o=G,h=J,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=r[6],h=t[6],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,r[6]=G=b&65535|d<<16,t[6]=J=u&65535|c<<16,o=V,h=W,u=h&65535,c=h>>>16,b=o&65535,d=o>>>16,o=r[7],h=t[7],u+=h&65535,c+=h>>>16,b+=o&65535,d+=o>>>16,c+=u>>>16,b+=c>>>16,d+=b>>>16,r[7]=V=b&65535|d<<16,t[7]=W=u&65535|c<<16,Q+=128,f-=128}return f}function hf(r,t,x){var f=new Int32Array(8),e=new Int32Array(8),n=new Uint8Array(256),i,s=x;for(f[0]=1779033703,f[1]=3144134277,f[2]=1013904242,f[3]=2773480762,f[4]=1359893119,f[5]=2600822924,f[6]=528734635,f[7]=1541459225,e[0]=4089235720,e[1]=2227873595,e[2]=4271175723,e[3]=1595750129,e[4]=2917565137,e[5]=725511199,e[6]=4215389547,e[7]=327033209,v0(f,e,t,x),x%=128,i=0;i<x;i++)n[i]=t[s-x+i];for(n[x]=128,x=256-128*(x<112?1:0),n[x-9]=0,x0(n,x-8,s/536870912|0,s<<3),v0(f,e,n,x),i=0;i<8;i++)x0(r,8*i,f[i],e[i]);return 0}function Yf(r,t){var x=U(),f=U(),e=U(),n=U(),i=U(),s=U(),v=U(),p=U(),_=U();ef(x,r[1],r[0]),ef(_,t[1],t[0]),Z(x,x,_),tf(f,r[0],r[1]),tf(_,t[0],t[1]),Z(f,f,_),Z(e,r[3],t[3]),Z(e,e,U0),Z(n,r[2],t[2]),tf(n,n,n),ef(i,f,x),ef(s,n,e),tf(v,n,e),tf(p,f,x),Z(r[0],i,s),Z(r[1],p,v),Z(r[2],v,s),Z(r[3],i,p)}function y0(r,t,x){var f;for(f=0;f<4;f++)sf(r[f],t[f],x)}function Mf(r,t){var x=U(),f=U(),e=U();c0(e,t[2]),Z(x,t[0],e),Z(f,t[1],e),bf(r,f),r[31]^=h0(x)<<7}function Df(r,t,x){var f,e;for(af(r[0],zf),af(r[1],Ef),af(r[2],Ef),af(r[3],zf),e=255;e>=0;--e)f=x[e/8|0]>>(e&7)&1,y0(r,t,f),Yf(t,r),Yf(r,r),y0(r,t,f)}function Tf(r,t){var x=[U(),U(),U(),U()];af(x[0],f0),af(x[1],r0),af(x[2],Ef),Z(x[3],f0,r0),Df(r,x,t)}function Xf(r,t,x){var f=new Uint8Array(64),e=[U(),U(),U(),U()],n;for(x||wf(t,32),hf(f,t,32),f[0]&=248,f[31]&=127,f[31]|=64,Tf(e,f),Mf(r,e),n=0;n<32;n++)t[n+32]=r[n];return 0}var jf=new Float64Array([237,211,245,92,26,99,18,88,214,156,247,162,222,249,222,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16]);function Gf(r,t){var x,f,e,n;for(f=63;f>=32;--f){for(x=0,e=f-32,n=f-12;e<n;++e)t[e]+=x-16*t[f]*jf[e-(f-32)],x=Math.floor((t[e]+128)/256),t[e]-=x*256;t[e]+=x,t[f]=0}for(x=0,e=0;e<32;e++)t[e]+=x-(t[31]>>4)*jf[e],x=t[e]>>8,t[e]&=255;for(e=0;e<32;e++)t[e]-=x*jf[e];for(f=0;f<32;f++)t[f+1]+=t[f]>>8,r[f]=t[f]&255}function Vf(r){var t=new Float64Array(64),x;for(x=0;x<64;x++)t[x]=r[x];for(x=0;x<64;x++)r[x]=0;Gf(r,t)}function _0(r,t,x,f){var e=new Uint8Array(64),n=new Uint8Array(64),i=new Uint8Array(64),s,v,p=new Float64Array(64),_=[U(),U(),U(),U()];hf(e,f,32),e[0]&=248,e[31]&=127,e[31]|=64;var X=x+64;for(s=0;s<x;s++)r[64+s]=t[s];for(s=0;s<32;s++)r[32+s]=e[32+s];for(hf(i,r.subarray(32),x+32),Vf(i),Tf(_,i),Mf(r,_),s=32;s<64;s++)r[s]=f[s];for(hf(n,r,x+64),Vf(n),s=0;s<64;s++)p[s]=0;for(s=0;s<32;s++)p[s]=i[s];for(s=0;s<32;s++)for(v=0;v<32;v++)p[s+v]+=n[s]*e[v];return Gf(r.subarray(32),p),X}function L0(r,t){var x=U(),f=U(),e=U(),n=U(),i=U(),s=U(),v=U();return af(r[2],Ef),If(r[1],t),xf(e,r[1]),Z(n,e,kf),ef(e,e,r[2]),tf(n,r[2],n),xf(i,n),xf(s,i),Z(v,s,i),Z(x,v,e),Z(x,x,n),s0(x,x),Z(x,x,e),Z(x,x,n),Z(x,x,n),Z(r[0],x,n),xf(f,r[0]),Z(f,f,n),o0(f,e)&&Z(r[0],r[0],B0),xf(f,r[0]),Z(f,f,n),o0(f,e)?-1:(h0(r[0])===t[31]>>7&&ef(r[0],zf,r[0]),Z(r[3],r[0],r[1]),0)}function $f(r,t,x,f){var e,n=new Uint8Array(32),i=new Uint8Array(64),s=[U(),U(),U(),U()],v=[U(),U(),U(),U()];if(x<64||L0(v,f))return-1;for(e=0;e<x;e++)r[e]=t[e];for(e=0;e<32;e++)r[e+32]=f[e];if(hf(i,r,x),Vf(i),Df(s,v,i),Tf(v,t.subarray(32)),Yf(s,v),Mf(n,s),x-=64,Cf(t,0,n,0)){for(e=0;e<x;e++)r[e]=0;return-1}for(e=0;e<x;e++)r[e]=t[e+64];return x}var Hf=32,Lf=24,vf=32,uf=16,yf=32,Rf=32,_f=32,lf=32,Jf=32,l0=Lf,R0=vf,z0=uf,nf=64,cf=32,df=64,Wf=32,qf=64;Y.lowlevel={crypto_core_hsalsa20:Af,crypto_stream_xor:Nf,crypto_stream:n0,crypto_stream_salsa20_xor:e0,crypto_stream_salsa20:a0,crypto_onetimeauth:Pf,crypto_onetimeauth_verify:i0,crypto_verify_16:t0,crypto_verify_32:Cf,crypto_secretbox:Kf,crypto_secretbox_open:Ff,crypto_scalarmult:Uf,crypto_scalarmult_base:Bf,crypto_box_beforenm:Sf,crypto_box_afternm:u0,crypto_box:T0,crypto_box_open:j0,crypto_box_keypair:b0,crypto_hash:hf,crypto_sign:_0,crypto_sign_keypair:Xf,crypto_sign_open:$f,crypto_secretbox_KEYBYTES:Hf,crypto_secretbox_NONCEBYTES:Lf,crypto_secretbox_ZEROBYTES:vf,crypto_secretbox_BOXZEROBYTES:uf,crypto_scalarmult_BYTES:yf,crypto_scalarmult_SCALARBYTES:Rf,crypto_box_PUBLICKEYBYTES:_f,crypto_box_SECRETKEYBYTES:lf,crypto_box_BEFORENMBYTES:Jf,crypto_box_NONCEBYTES:l0,crypto_box_ZEROBYTES:R0,crypto_box_BOXZEROBYTES:z0,crypto_sign_BYTES:nf,crypto_sign_PUBLICKEYBYTES:cf,crypto_sign_SECRETKEYBYTES:df,crypto_sign_SEEDBYTES:Wf,crypto_hash_BYTES:qf,gf:U,D:kf,L:jf,pack:Mf,pack25519:bf,unpack25519:If,M:Z,A:tf,S:xf,Z:ef,pow2523:s0,add:Yf,set25519:af,modL:Gf,scalarmult:Df,scalarbase:Tf};function w0(r,t){if(r.length!==Hf)throw new Error("bad key size");if(t.length!==Lf)throw new Error("bad nonce size")}function O0(r,t){if(r.length!==_f)throw new Error("bad public key size");if(t.length!==lf)throw new Error("bad secret key size")}function rf(){for(var r=0;r<arguments.length;r++)if(!(arguments[r]instanceof Uint8Array))throw new TypeError("unexpected type, use Uint8Array")}function E0(r){for(var t=0;t<r.length;t++)r[t]=0}Y.randomBytes=function(r){var t=new Uint8Array(r);return wf(t,r),t},Y.secretbox=function(r,t,x){rf(r,t,x),w0(x,t);for(var f=new Uint8Array(vf+r.length),e=new Uint8Array(f.length),n=0;n<r.length;n++)f[n+vf]=r[n];return Kf(e,f,f.length,t,x),e.subarray(uf)},Y.secretbox.open=function(r,t,x){rf(r,t,x),w0(x,t);for(var f=new Uint8Array(uf+r.length),e=new Uint8Array(f.length),n=0;n<r.length;n++)f[n+uf]=r[n];return f.length<32||Ff(e,f,f.length,t,x)!==0?null:e.subarray(vf)},Y.secretbox.keyLength=Hf,Y.secretbox.nonceLength=Lf,Y.secretbox.overheadLength=uf,Y.scalarMult=function(r,t){if(rf(r,t),r.length!==Rf)throw new Error("bad n size");if(t.length!==yf)throw new Error("bad p size");var x=new Uint8Array(yf);return Uf(x,r,t),x},Y.scalarMult.base=function(r){if(rf(r),r.length!==Rf)throw new Error("bad n size");var t=new Uint8Array(yf);return Bf(t,r),t},Y.scalarMult.scalarLength=Rf,Y.scalarMult.groupElementLength=yf,Y.box=function(r,t,x,f){var e=Y.box.before(x,f);return Y.secretbox(r,t,e)},Y.box.before=function(r,t){rf(r,t),O0(r,t);var x=new Uint8Array(Jf);return Sf(x,r,t),x},Y.box.after=Y.secretbox,Y.box.open=function(r,t,x,f){var e=Y.box.before(x,f);return Y.secretbox.open(r,t,e)},Y.box.open.after=Y.secretbox.open,Y.box.keyPair=function(){var r=new Uint8Array(_f),t=new Uint8Array(lf);return b0(r,t),{publicKey:r,secretKey:t}},Y.box.keyPair.fromSecretKey=function(r){if(rf(r),r.length!==lf)throw new Error("bad secret key size");var t=new Uint8Array(_f);return Bf(t,r),{publicKey:t,secretKey:new Uint8Array(r)}},Y.box.publicKeyLength=_f,Y.box.secretKeyLength=lf,Y.box.sharedKeyLength=Jf,Y.box.nonceLength=l0,Y.box.overheadLength=Y.secretbox.overheadLength,Y.sign=function(r,t){if(rf(r,t),t.length!==df)throw new Error("bad secret key size");var x=new Uint8Array(nf+r.length);return _0(x,r,r.length,t),x},Y.sign.open=function(r,t){if(rf(r,t),t.length!==cf)throw new Error("bad public key size");var x=new Uint8Array(r.length),f=$f(x,r,r.length,t);if(f<0)return null;for(var e=new Uint8Array(f),n=0;n<e.length;n++)e[n]=x[n];return e},Y.sign.detached=function(r,t){for(var x=Y.sign(r,t),f=new Uint8Array(nf),e=0;e<f.length;e++)f[e]=x[e];return f},Y.sign.detached.verify=function(r,t,x){if(rf(r,t,x),t.length!==nf)throw new Error("bad signature size");if(x.length!==cf)throw new Error("bad public key size");var f=new Uint8Array(nf+r.length),e=new Uint8Array(nf+r.length),n;for(n=0;n<nf;n++)f[n]=t[n];for(n=0;n<r.length;n++)f[n+nf]=r[n];return $f(e,f,f.length,x)>=0},Y.sign.keyPair=function(){var r=new Uint8Array(cf),t=new Uint8Array(df);return Xf(r,t),{publicKey:r,secretKey:t}},Y.sign.keyPair.fromSecretKey=function(r){if(rf(r),r.length!==df)throw new Error("bad secret key size");for(var t=new Uint8Array(cf),x=0;x<t.length;x++)t[x]=r[32+x];return{publicKey:t,secretKey:new Uint8Array(r)}},Y.sign.keyPair.fromSeed=function(r){if(rf(r),r.length!==Wf)throw new Error("bad seed size");for(var t=new Uint8Array(cf),x=new Uint8Array(df),f=0;f<32;f++)x[f]=r[f];return Xf(t,x,!0),{publicKey:t,secretKey:x}},Y.sign.publicKeyLength=cf,Y.sign.secretKeyLength=df,Y.sign.seedLength=Wf,Y.sign.signatureLength=nf,Y.hash=function(r){rf(r);var t=new Uint8Array(qf);return hf(t,r,r.length),t},Y.hash.hashLength=qf,Y.verify=function(r,t){return rf(r,t),r.length===0||t.length===0||r.length!==t.length?!1:Of(r,0,t,0,r.length)===0},Y.setPRNG=function(r){wf=r},function(){var r=typeof self<"u"?self.crypto||self.msCrypto:null;if(r&&r.getRandomValues){var t=65536;Y.setPRNG(function(x,f){var e,n=new Uint8Array(f);for(e=0;e<f;e+=t)r.getRandomValues(n.subarray(e,e+Math.min(f-e,t)));for(e=0;e<f;e++)x[e]=n[e];E0(n)})}else typeof C0<"u"&&(r=N0,r&&r.randomBytes&&Y.setPRNG(function(x,f){var e,n=r.randomBytes(f);for(e=0;e<f;e++)x[e]=n[e];E0(n)}))}()})(Qf.exports?Qf.exports:self.nacl=self.nacl||{})})(g0);var K0=g0.exports;const Z0=P0(K0);export{Z0 as n};
