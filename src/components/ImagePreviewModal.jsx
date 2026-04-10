import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, IconButton, Box, Typography, useMediaQuery } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCw, X } from "lucide-react";
import styles from "./ImagePreviewModal.module.css";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getDistance(firstPoint, secondPoint) {
  return Math.hypot(secondPoint.x - firstPoint.x, secondPoint.y - firstPoint.y);
}

function getMidpoint(firstPoint, secondPoint) {
  return {
    x: (firstPoint.x + secondPoint.x) / 2,
    y: (firstPoint.y + secondPoint.y) / 2
  };
}

export default function ImagePreviewModal({
  open,
  src,
  photo,
  title = "",
  index = null,
  total = null,
  onNext,
  onPrev,
  onClose
}) {
  const isMobile = useMediaQuery("(max-width:639px)");
  const [mobileRotated, setMobileRotated] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const pointersRef = useRef(new Map());
  const gestureRef = useRef({
    startPan: { x: 0, y: 0 },
    startZoom: 1,
    startDistance: 0,
    startCenter: { x: 0, y: 0 },
    startPoint: { x: 0, y: 0 },
    swiped: false
  });

  const activePhoto = photo ?? { src };
  const baseSource = useMemo(
    () => (isMobile ? activePhoto.mobileSrc ?? activePhoto.optimizedSrc ?? activePhoto.src : activePhoto.optimizedSrc ?? activePhoto.src),
    [activePhoto.mobileSrc, activePhoto.optimizedSrc, activePhoto.src, isMobile]
  );
  const detailSource = zoom >= 2 ? activePhoto.src ?? baseSource : baseSource;

  const resetTransform = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    resetTransform();
    setMobileRotated(false);
  }, [src]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight" && onNext) {
        onNext();
      }
      if (event.key === "ArrowLeft" && onPrev) {
        onPrev();
      }
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, onNext, onPrev]);

  useEffect(() => {
    if (!open) {
      setMobileRotated(false);
      resetTransform();
      if (typeof screen !== "undefined" && screen.orientation?.unlock) {
        try {
          screen.orientation.unlock();
        } catch {
          // Some browsers do not allow programmatic unlock.
        }
      }
    }
  }, [open]);

  const handleRotate = async () => {
    const next = !mobileRotated;
    setMobileRotated(next);
    setPan({ x: 0, y: 0 });
    setZoom(next ? 1.45 : 1);

    if (typeof screen !== "undefined" && screen.orientation?.lock) {
      try {
        if (next) {
          await screen.orientation.lock("landscape");
        } else if (screen.orientation?.unlock) {
          screen.orientation.unlock();
        }
      } catch {
        // Browser support for orientation lock is inconsistent on mobile.
      }
    }
  };

  const hasTitle = Boolean(title?.trim());
  const hasIndex = typeof index === "number" && typeof total === "number" && total > 0;

  const adjustZoom = (delta) => {
    setZoom((current) => {
      const nextZoom = clamp(Number((current + delta).toFixed(2)), MIN_ZOOM, MAX_ZOOM);
      if (nextZoom <= 1) {
        setPan({ x: 0, y: 0 });
      }
      return nextZoom;
    });
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    gestureRef.current.swiped = false;

    if (pointersRef.current.size === 1) {
      gestureRef.current.startPan = pan;
      gestureRef.current.startZoom = zoom;
      gestureRef.current.startPoint = { x: event.clientX, y: event.clientY };
      return;
    }

    if (pointersRef.current.size === 2) {
      const [firstPoint, secondPoint] = Array.from(pointersRef.current.values());
      gestureRef.current.startPan = pan;
      gestureRef.current.startZoom = zoom;
      gestureRef.current.startDistance = getDistance(firstPoint, secondPoint) || 1;
      gestureRef.current.startCenter = getMidpoint(firstPoint, secondPoint);
    }
  };

  const handlePointerMove = (event) => {
    if (!pointersRef.current.has(event.pointerId)) {
      return;
    }

    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size === 2) {
      const [firstPoint, secondPoint] = Array.from(pointersRef.current.values());
      const nextDistance = getDistance(firstPoint, secondPoint) || gestureRef.current.startDistance;
      const nextZoom = clamp(gestureRef.current.startZoom * (nextDistance / gestureRef.current.startDistance), MIN_ZOOM, MAX_ZOOM);
      const nextCenter = getMidpoint(firstPoint, secondPoint);
      const deltaCenter = {
        x: nextCenter.x - gestureRef.current.startCenter.x,
        y: nextCenter.y - gestureRef.current.startCenter.y
      };

      setZoom(nextZoom);
      setPan({
        x: gestureRef.current.startPan.x + deltaCenter.x,
        y: gestureRef.current.startPan.y + deltaCenter.y
      });
      return;
    }

    if (pointersRef.current.size === 1) {
      const currentPoint = pointersRef.current.get(event.pointerId);
      if (!currentPoint) {
        return;
      }

      const deltaX = currentPoint.x - gestureRef.current.startPoint.x;
      const deltaY = currentPoint.y - gestureRef.current.startPoint.y;

      if (zoom > 1) {
        setPan({
          x: gestureRef.current.startPan.x + deltaX,
          y: gestureRef.current.startPan.y + deltaY
        });
        return;
      }

      if (isMobile && Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) && !gestureRef.current.swiped) {
        gestureRef.current.swiped = true;
        if (deltaX < 0) {
          onNext?.();
        } else {
          onPrev?.();
        }
      }
    }
  };

  const handlePointerUp = (event) => {
    pointersRef.current.delete(event.pointerId);
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (pointersRef.current.size === 0 && zoom <= 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  const handleWheel = (event) => {
    if (!open) {
      return;
    }

    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.16 : 0.16;
    setZoom((current) => clamp(Number((current + delta).toFixed(2)), MIN_ZOOM, MAX_ZOOM));
    if (zoom <= 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  return (
    <Dialog
      open={open}
      fullScreen={isMobile}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          onClose?.();
        }
      }}
      maxWidth={false}
      fullWidth
      PaperProps={{ className: `${styles.paper} ${isMobile ? styles.mobilePaper : ""}`.trim() }}
      BackdropProps={{ className: styles.backdrop }}
    >
      <Box className={styles.shell}>
        <Box className={styles.topBar}>
          <Box className={styles.metaGroup}>
            {hasIndex && (
              <Typography component="span" className={styles.indexPill}>
                {String(index + 1).padStart(2, "0")} / {total}
              </Typography>
            )}
            {hasTitle && (
              <Typography component="span" className={styles.titleText}>
                {title}
              </Typography>
            )}
          </Box>

          <Box className={styles.topActions}>
            <IconButton className={styles.zoomButton} onClick={() => adjustZoom(-0.2)} aria-label="Zoom out preview">
              <Minus size={16} />
            </IconButton>
            <IconButton className={styles.zoomButton} onClick={() => adjustZoom(0.2)} aria-label="Zoom in preview">
              <Plus size={16} />
            </IconButton>
            {isMobile && (
              <IconButton className={styles.rotateButton} onClick={handleRotate} aria-label="Rotate preview view">
                <RotateCw size={16} />
              </IconButton>
            )}
            <IconButton className={styles.closeButton} onClick={() => onClose?.()} aria-label="Close preview">
              <X size={18} />
            </IconButton>
          </Box>
        </Box>

        <Box className={`${styles.viewport} ${isMobile ? styles.mobileViewport : ""}`.trim()}>
          {onPrev && (
            <IconButton className={`${styles.navButton} ${styles.navLeft}`} onClick={onPrev} aria-label="Previous image">
              <ChevronLeft size={18} />
            </IconButton>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={src}
              className={`${styles.imageFrame} ${isMobile ? styles.mobileImageFrame : ""} ${
                isMobile && mobileRotated ? styles.mobileImageFrameRotated : ""
              }`.trim()}
              style={{ "--preview-zoom": zoom, "--preview-pan-x": `${pan.x}px`, "--preview-pan-y": `${pan.y}px` }}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
            >
              <img
                src={detailSource}
                alt={title || "Image preview"}
                className={`${styles.image} ${mobileRotated ? styles.imageRotated : ""} ${
                  isMobile && mobileRotated ? styles.mobileImageFill : ""
                }`.trim()}
                loading="eager"
                decoding="async"
                draggable="false"
              />
              <Box className={styles.bottomOverlay} />
              {hasTitle && (
                <Box className={styles.captionBar}>
                  <Typography className={styles.captionTitle}>{title}</Typography>
                </Box>
              )}
            </motion.div>
          </AnimatePresence>

          {onNext && (
            <IconButton className={`${styles.navButton} ${styles.navRight}`} onClick={onNext} aria-label="Next image">
              <ChevronRight size={18} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}