(this["webpackJsonpbluespot-health"]=this["webpackJsonpbluespot-health"]||[]).push([[0],{99:function(t,e,n){"use strict";n.r(e),n.d(e,"createSwipeBackGesture",(function(){return u}));var r=n(10),i=n(22),a=n(35),u=function(t,e,n,u,o){var c=t.ownerDocument.defaultView,s=Object(i.a)(t),h=function(t){return s?-t.deltaX:t.deltaX};return Object(a.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:function(t){return function(t){var e=t.startX;return s?e>=c.innerWidth-50:e<=50}(t)&&e()},onStart:n,onMove:function(t){var e=h(t)/c.innerWidth;u(e)},onEnd:function(t){var e=h(t),n=c.innerWidth,i=e/n,a=function(t){return s?-t.velocityX:t.velocityX}(t),u=a>=0&&(a>.2||e>n/2),f=(u?1-i:i)*n,l=0;if(f>5){var b=f/Math.abs(a);l=Math.min(b,540)}o(u,i<=0?.01:Object(r.j)(0,i,.9999),l)}})}}}]);