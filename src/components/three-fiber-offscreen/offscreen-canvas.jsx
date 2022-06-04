import React, { useEffect } from 'react';
import { DOM_EVENTS } from './events'

const worker = new Worker(new URL('./worker.js', import.meta.url));

const OffscreenCanvas = ({
  onClick,
  ...props
}) => {
  const canvasRef = React.useRef();

  useEffect(() => {
    worker.postMessage({
      type: 'props',
      payload: props
    })
  }, [props])

  useEffect(() => {
    const canvas = canvasRef.current;
    const offscreen = canvasRef.current.transferControlToOffscreen();

    worker.postMessage( {
      type: 'init',
      payload: {
        props,
        drawingSurface: offscreen,
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        pixelRatio: window.devicePixelRatio,
      }
    }, [ offscreen ] );

    Object.values(DOM_EVENTS).forEach(([eventName, passive]) => {
      canvas.addEventListener(eventName, (event) => {
        worker.postMessage({
          type: 'dom_events',
          payload: {
            eventName,
            clientX: event.clientX,
            clientY: event.clientY,
            offsetX: event.offsetX,
            offsetY: event.offsetY,
            x: event.x,
            y: event.y,
          }
        });
      }, { passive })
    })

    const handleResize = () => {
      worker.postMessage({
        type: 'resize',
        payload: {
          width: canvas.clientWidth,
          height: canvas.clientHeight,
        }
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []);

  return (
    <canvas ref={canvasRef} onClick={onClick} />
  );
}

export default OffscreenCanvas
