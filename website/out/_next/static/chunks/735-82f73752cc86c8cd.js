(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[735],{3096:function(e,t,n){var r="Expected a function",i=0/0,o=/^\s+|\s+$/g,u=/^[-+]0x[0-9a-f]+$/i,a=/^0b[01]+$/i,c=/^0o[0-7]+$/i,l=parseInt,s="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g,f="object"==typeof self&&self&&self.Object===Object&&self,p=s||f||Function("return this")(),d=Object.prototype.toString,b=Math.max,v=Math.min,m=function(){return p.Date.now()};function y(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function w(e){if("number"==typeof e)return e;if("symbol"==typeof(t=e)||(n=t)&&"object"==typeof n&&"[object Symbol]"==d.call(t))return i;if(y(e)){var t,n,r="function"==typeof e.valueOf?e.valueOf():e;e=y(r)?r+"":r}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(o,"");var s=a.test(e);return s||c.test(e)?l(e.slice(2),s?2:8):u.test(e)?i:+e}e.exports=function(e,t,n){var i=!0,o=!0;if("function"!=typeof e)throw TypeError(r);return y(n)&&(i="leading"in n?!!n.leading:i,o="trailing"in n?!!n.trailing:o),function(e,t,n){var i,o,u,a,c,l,s=0,f=!1,p=!1,d=!0;if("function"!=typeof e)throw TypeError(r);function g(t){var n=i,r=o;return i=o=void 0,s=t,a=e.apply(r,n)}function k(e){var n=e-l,r=e-s;return void 0===l||n>=t||n<0||p&&r>=u}function C(){var e,n,r,i=m();if(k(i))return T(i);c=setTimeout(C,(e=i-l,n=i-s,r=t-e,p?v(r,u-n):r))}function T(e){return(c=void 0,d&&i)?g(e):(i=o=void 0,a)}function h(){var e,n=m(),r=k(n);if(i=arguments,o=this,l=n,r){if(void 0===c)return s=e=l,c=setTimeout(C,t),f?g(e):a;if(p)return c=setTimeout(C,t),g(l)}return void 0===c&&(c=setTimeout(C,t)),a}return t=w(t)||0,y(n)&&(f=!!n.leading,u=(p="maxWait"in n)?b(w(n.maxWait)||0,t):u,d="trailing"in n?!!n.trailing:d),h.cancel=function(){void 0!==c&&clearTimeout(c),s=0,i=l=o=c=void 0},h.flush=function(){return void 0===c?a:T(m())},h}(e,t,{leading:i,maxWait:t,trailing:o})}},7735:function(e,t,n){"use strict";let r;n.d(t,{n:function(){return l}});var i=n(7294),o=n(3096),u=n.n(o);let a="animate__animated",c="undefined"==typeof window;c||(r=window);let l=({offset:e=150,duration:t=1,style:n,className:o,initiallyVisible:l=!1,animateIn:s,afterAnimatedIn:f,animateOut:p,delay:d=0,animatePreScroll:b=!0,afterAnimatedOut:v,scrollableParentSelector:m,animateOnce:y=!1,children:w})=>{let[g,k]=(0,i.useState)(a),[C,T]=(0,i.useState)({animationDuration:`${t}s`,opacity:l?1:0}),h=(0,i.useRef)(null),$=(0,i.useRef)(!1),j=(0,i.useRef)({onScreen:!1,inViewport:!1}),E=(0,i.useRef)(void 0),S=(0,i.useRef)(void 0),O=(0,i.useRef)(r),x=(0,i.useCallback)(e=>{let t=0;for(;e&&void 0!==e.offsetTop&&void 0!==e.clientTop;)t+=e.offsetTop+e.clientTop,e=e.offsetParent;return t},[]),V=(0,i.useCallback)(()=>void 0!==O.current.pageYOffset?O.current.pageYOffset:O.current.scrollTop,[O]),D=(0,i.useCallback)(()=>void 0!==O.current.innerHeight?O.current.innerHeight:O.current.clientHeight,[O]),R=(0,i.useCallback)(()=>V()+e,[e,V]),_=(0,i.useCallback)(()=>V()+D()-e,[e,V,D]),H=(0,i.useCallback)(e=>e>=R()&&e<=_(),[R,_]),L=(0,i.useCallback)(e=>e<R(),[R]),N=(0,i.useCallback)(e=>e>_(),[_]),M=(0,i.useCallback)((e,t)=>H(e)||H(t)||L(e)&&N(t),[H,L,N]),W=(0,i.useCallback)(e=>e<V(),[V]),Y=(0,i.useCallback)(e=>e>V()+D(),[V,D]),q=(0,i.useCallback)((e,t)=>!W(t)&&!Y(e),[W,Y]),F=(0,i.useCallback)(()=>{let e=x(h.current)-x(O.current),t=e+h.current.clientHeight;return{inViewport:M(e,t),onScreen:q(e,t)}},[x,h,M,q,O]),I=(0,i.useCallback)((e,t)=>e.inViewport!==t.inViewport||e.onScreen!==t.onScreen,[]),P=(0,i.useCallback)((e,n)=>{E.current=setTimeout(()=>{$.current=!0,k(`${a} ${e}`),T({animationDuration:`${t}s`}),S.current=setTimeout(n,1e3*t)},d)},[$,d,t]),z=(0,i.useCallback)(e=>{P(s,()=>{y||(T({animationDuration:`${t}s`,opacity:1}),$.current=!1);let n=F();e&&e(n)})},[$,s,y,t,P,F]),A=(0,i.useCallback)(e=>{P(p,()=>{k(a),T({animationDuration:`${t}s`,opacity:0});let n=F();n.inViewport&&s?z(f):$.current=!1,e&&e(n)})},[$,P,s,t,f,z,p,F]),B=(0,i.useCallback)(()=>{if(!$.current){let{current:e}=j,n=F();I(e,n)&&(clearTimeout(E.current),n.onScreen?n.inViewport&&s?z(f):n.onScreen&&e.inViewport&&p&&"1"===h.current.style.opacity&&A(v):(k(a),T({animationDuration:`${t}s`,opacity:l?1:0})),j.current=n)}},[f,v,s,z,p,t,l,I,A,F]),G=(0,i.useMemo)(()=>u()(()=>{B()},50),[B]);return(0,i.useEffect)(()=>{if(!c)return O.current=m?document.querySelector(m):window,O.current&&O.current.addEventListener?O.current.addEventListener("scroll",G):console.warn(`Cannot find element by locator: ${m}`),b&&B(),()=>{clearTimeout(E.current),clearTimeout(S.current),window&&window.removeEventListener&&window.removeEventListener("scroll",G)}},[B,m,O,G,b]),i.createElement("div",{ref:h,className:o?`${o} ${g}`:g,style:Object.assign({},C,n)},w)}}}]);