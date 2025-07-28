// Smart Wheel Zoom
// - Prevent free rolling mouse wheel from accidentally crazy zooming browser page
// - Only allows zoom when Ctrl is pressed BEFORE any wheel activity starts
// - If user is scrolling, pressing Ctrl will scroll instead of zoom

let lastCtrlDownTime = Date.now();
let ctrlDownTime = 0;
let wheelFirstReceivedTime = 0;

/*@__PURE__*/
function debug(...args) {
  console.log("Smart Wheel Zoom: ", ...args);
}

// Track Ctrl key state
document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Control") {
      if (ctrlDownTime === 0) {
        const now = Date.now();
        if (lastCtrlDownTime > 0 && now - lastCtrlDownTime < 500) {
          // user is spamming ctrl key, ignore it
          debug("ctrl key up/down too fast, ignore it", now, lastCtrlDownTime);
          return;
        }
        ctrlDownTime = now;
        debug("ctrl keydown", event.key, ctrlDownTime);
      }
    }
  },
  { passive: true }
);

document.addEventListener(
  "keyup",
  (event) => {
    debug("keyup", event.key, ctrlDownTime);
    if (event.key === "Control") {
      if (ctrlDownTime > 0) {
        lastCtrlDownTime = ctrlDownTime;
        ctrlDownTime = 0;
        debug("Ctrl released", Date.now());
      }
    }
  },
  { passive: true }
);

let accumulatedWheelDeltaY = 0; // accumulated wheel delta Y
let accumulatedWheelDeltaX = 0; // accumulated wheel delta X
let lastZoomTime = 0; // last zoom time

// Handle all wheel events (both tracking and Ctrl+wheel)
document.addEventListener(
  "wheel",
  (event) => {
    const now = Date.now();

    debug(
      "wheel, ctrlKey",
      event.ctrlKey,
      "time",
      now,
      "wheelFirstReceivedTime",
      wheelFirstReceivedTime,
      "ctrlDownTime",
      ctrlDownTime,
      "diff",
      wheelFirstReceivedTime - ctrlDownTime
    );

    if (wheelFirstReceivedTime === 0) {
      debug("Wheel first received", now);
      wheelFirstReceivedTime = now;
      function resetWheel(ctrlDownTimeAtWheel) {
        setTimeout(() => {
          if (ctrlDownTime && ctrlDownTimeAtWheel < ctrlDownTime) {
            // user rapidly up and down ctrl, ignore it and set time again
            resetWheel(ctrlDownTimeAtWheel);
          } else {
            wheelFirstReceivedTime = 0;
          }
        }, 2000);
      }
      resetWheel(ctrlDownTime);
    }

    // Handle Ctrl+wheel combinations
    if (event.ctrlKey) {
      if (ctrlDownTime === 0) {
        debug("ctrlDownTime", ctrlDownTime, "can't determine, block zoom");
      } else if (wheelFirstReceivedTime > ctrlDownTime) {
        // wheel after ctrl, allow zoom
        if (now - lastZoomTime < 1500) {
          debug(
            "zooming too fast, rate limiting",
            "now",
            now,
            "lastZoomTime",
            lastZoomTime,
            "diff",
            now - lastZoomTime
          );
          return false;
        }
        debug("Intentional zoom allowed");
        lastZoomTime = now;
        return; // Let browser handle zoom naturally
      }

      // Block zoom and scroll instead
      event.preventDefault();
      event.stopPropagation();

      const isInitialScroll =
        accumulatedWheelDeltaY === 0 && accumulatedWheelDeltaX === 0;

      accumulatedWheelDeltaY += event.deltaY;
      accumulatedWheelDeltaX += event.deltaX;

      if (isInitialScroll) {
        debug("Scroll threshold reached, scrolling");
        setTimeout(() => {
          // Smooth scroll instead of zoom
          window.scrollBy({
            top: accumulatedWheelDeltaY,
            left: accumulatedWheelDeltaX,
            behavior: "smooth",
          });
          accumulatedWheelDeltaY = 0;
          accumulatedWheelDeltaX = 0;
        }, 100);
      } else {
        accumulatedWheelDeltaY *= 1.1;
        accumulatedWheelDeltaX *= 1.05;
      }

      debug("Blocked accidental zoom, scrolled instead");
      return false;
    }
  },
  { passive: false, capture: true }
);

debug("extension loaded");
