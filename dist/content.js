// Smart Wheel Zoom
// - Prevent free rolling mouse wheel from accidentally crazy zooming browser page
// - Only allows zoom when Ctrl is pressed BEFORE any wheel activity starts
// - If user is scrolling, pressing Ctrl will scroll instead of zoom
let lastCtrlDownTime=Date.now(),ctrlDownTime=0,wheelFirstReceivedTime=0;
// Track Ctrl key state
document.addEventListener("keydown",e=>{if("Control"===e.key&&0===ctrlDownTime){const t=Date.now();if(lastCtrlDownTime>0&&t-lastCtrlDownTime<500)return;ctrlDownTime=t,e.key}},{passive:!0}),document.addEventListener("keyup",e=>{e.key,"Control"===e.key&&ctrlDownTime>0&&(lastCtrlDownTime=ctrlDownTime,ctrlDownTime=0,Date.now())},{passive:!0});let accumulatedWheelDeltaY=0,accumulatedWheelDeltaX=0,lastZoomTime=0;// accumulated wheel delta Y
// last zoom time
// Handle all wheel events (both tracking and Ctrl+wheel)
document.addEventListener("wheel",e=>{const t=Date.now();if(e.ctrlKey,0===wheelFirstReceivedTime){wheelFirstReceivedTime=t,function e(t){setTimeout(()=>{ctrlDownTime&&t<ctrlDownTime?
// user rapidly up and down ctrl, ignore it and set time again
e(t):wheelFirstReceivedTime=0},2e3)}(ctrlDownTime)}
// Handle Ctrl+wheel combinations
if(e.ctrlKey){if(0===ctrlDownTime);else if(wheelFirstReceivedTime>ctrlDownTime)
// wheel after ctrl, allow zoom
return!(t-lastZoomTime<1500)&&void(lastZoomTime=t);
// Block zoom and scroll instead
e.preventDefault(),e.stopPropagation();const l=0===accumulatedWheelDeltaY&&0===accumulatedWheelDeltaX;return accumulatedWheelDeltaY+=e.deltaY,accumulatedWheelDeltaX+=e.deltaX,l?setTimeout(()=>{
// Smooth scroll instead of zoom
window.scrollBy({top:accumulatedWheelDeltaY,left:accumulatedWheelDeltaX,behavior:"smooth"}),accumulatedWheelDeltaY=0,accumulatedWheelDeltaX=0},100):(accumulatedWheelDeltaY*=1.1,accumulatedWheelDeltaX*=1.05),!1}},{passive:!1,capture:!0});