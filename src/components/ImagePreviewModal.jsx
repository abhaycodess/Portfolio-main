import { useEffect } from "react";
import { Dialog, IconButton, Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "./ImagePreviewModal.module.css";

export default function ImagePreviewModal({
  open,
  src,
  title = "",
  index = null,
  total = null,
  onNext,
  onPrev,
  onClose
}) {
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

  const hasTitle = Boolean(title?.trim());
  const hasIndex = typeof index === "number" && typeof total === "number" && total > 0;

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          onClose?.();
        }
      }}
      maxWidth={false}
      fullWidth
      PaperProps={{ className: styles.paper }}
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

          <IconButton className={styles.closeButton} onClick={() => onClose?.()} aria-label="Close preview">
            <X size={18} />
          </IconButton>
        </Box>

        <Box className={styles.viewport}>
          {onPrev && (
            <IconButton className={`${styles.navButton} ${styles.navLeft}`} onClick={onPrev} aria-label="Previous image">
              <ChevronLeft size={18} />
            </IconButton>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={src}
              className={styles.imageFrame}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50 || info.velocity.x < -300) {
                  onNext?.();
                }
                if (info.offset.x > 50 || info.velocity.x > 300) {
                  onPrev?.();
                }
              }}
            >
              <img src={src} alt={title || "Image preview"} className={styles.image} />
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