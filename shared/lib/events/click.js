import { isMobile } from 'lib/devices';

export function getPosition(e) {
  return {
    x: getX(e),
    y: getY(e)
  }
}

export function getX(e) {
  if(isMobile()) {
    if (e.touches && e.touches[0]) {
      return e.touches[0].pageX;
    } else {
      return null;
    }
  } else {
    return e.clientX;
  }
}

export function getY(e) {
  if(isMobile()) {
    if (e.touches && e.touches[0]) {
      return e.touches[0].pageY;
    } else {
      return null;
    }
  } else {
    return e.clientY;
  }
}

export default {
  getPosition,
  getX,
  getY
}
