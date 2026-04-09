import { useEffect, useMemo, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./PhotoCarousel.module.css";

const DESKTOP_CARD_WIDTH = 420;
const TABLET_CARD_WIDTH = 340;
const MOBILE_CARD_WIDTH = 260;
const DESKTOP_GAP = 44;
const TABLET_GAP = 34;
const MOBILE_GAP = 24;
const DESKTOP_BREAKPOINT = 960;
const TABLET_BREAKPOINT = 640;
const MAX_VISIBLE_OFFSET = 4;

function clampIndex(index, total) {
  return Math.max(0, Math.min(index, total - 1));
}

function shuffleWithOriginalIndexes(items) {
  const enriched = items.map((photo, originalIndex) => ({ photo, originalIndex }));
  for (let i = enriched.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [enriched[i], enriched[j]] = [enriched[j], enriched[i]];
  }
  return enriched;
}

function getCircularOffset(index, activeIndex, total) {
  if (total <= 0) {
    return 0;
  }
  const raw = index - activeIndex;
  const wrapped = raw > 0 ? raw - total : raw + total;
  return Math.abs(raw) <= Math.abs(wrapped) ? raw : wrapped;
}

function getCardWidth() {
  if (typeof window === "undefined") {
    return DESKTOP_CARD_WIDTH;
  }
  const width = window.innerWidth;
  if (width < TABLET_BREAKPOINT) {
    return MOBILE_CARD_WIDTH;
  }
  if (width < DESKTOP_BREAKPOINT) {
    return TABLET_CARD_WIDTH;
  }
  return DESKTOP_CARD_WIDTH;
}

function getCardGap() {
  if (typeof window === "undefined") {
    return DESKTOP_GAP;
  }
  const width = window.innerWidth;
  if (width < TABLET_BREAKPOINT) {
    return MOBILE_GAP;
  }
  if (width < DESKTOP_BREAKPOINT) {
    return TABLET_GAP;
  }
  return DESKTOP_GAP;
}

export default function PhotoCarousel({ photos, onPhotoClick, className = "", initialIndex = null }) {
  const shuffledPhotos = useMemo(() => shuffleWithOriginalIndexes(photos), [photos]);
  const total = shuffledPhotos.length;
  const [activeIndex, setActiveIndex] = useState(() => {
    if (typeof initialIndex === "number") {
      return clampIndex(initialIndex, total);
    }
    return total > 0 ? Math.floor(Math.random() * total) : 0;
  });
  const [cardWidth, setCardWidth] = useState(() => getCardWidth());
  const [cardGap, setCardGap] = useState(() => getCardGap());
  const canNavigate = total > 1;

  const updateSizing = () => {
    setCardWidth(getCardWidth());
    setCardGap(getCardGap());
  };

  const next = () => {
    if (total <= 1) {
      return;
    }
    setActiveIndex((current) => (current + 1) % total);
  };

  const prev = () => {
    if (total <= 1) {
      return;
    }
    setActiveIndex((current) => (current - 1 + total) % total);
  };

  useEffect(() => {
    if (total <= 0) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((current) => ((current % total) + total) % total);
  }, [total]);

  useEffect(() => {
    updateSizing();
    window.addEventListener("resize", updateSizing);

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        prev();
      }
      if (event.key === "ArrowRight") {
        next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", updateSizing);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [total]);

  const handleCardClick = (index) => {
    if (index === activeIndex) {
      onPhotoClick(index);
      return;
    }
    setActiveIndex(index);
  };

  return (
    <Box className={`${styles.carouselSection} ${className}`.trim()}>
      <IconButton
        className={`${styles.navButton} ${styles.navLeft}`}
        onClick={prev}
        aria-label="Previous photo"
        disabled={!canNavigate}
      >
        <ChevronLeft size={20} />
      </IconButton>
      <IconButton
        className={`${styles.navButton} ${styles.navRight}`}
        onClick={next}
        aria-label="Next photo"
        disabled={!canNavigate}
      >
        <ChevronRight size={20} />
      </IconButton>

      <Box className={styles.trackWrapper}>
        <motion.div
          className={styles.track}
          style={{
            "--active-index": activeIndex,
            "--card-width": `${cardWidth}px`,
            "--card-gap": `${cardGap}px`
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -350) {
              next();
            } else if (info.offset.x > 60 || info.velocity.x > 350) {
              prev();
            }
          }}
        >
          {shuffledPhotos.map((item, index) => {
            const photo = item.photo;
            const offset = getCircularOffset(index, activeIndex, total);
            const distance = Math.abs(offset);
            const isActive = index === activeIndex;
            const isVisible = distance <= MAX_VISIBLE_OFFSET;
            const depthScale =
              distance === 0 ? 1.25 : distance === 1 ? 0.9 : distance === 2 ? 0.78 : distance === 3 ? 0.66 : 0.56;
            const opacity =
              distance === 0 ? 1 : distance === 1 ? 0.72 : distance === 2 ? 0.52 : distance === 3 ? 0.36 : 0.24;
            const xStep = cardWidth * 0.48 + cardGap * 1.1;
            const translateX = offset * xStep;
            const translateY = distance === 0 ? -6 : distance <= 2 ? 10 + distance * 10 : 30 + distance * 8;
            const rotate = offset * 2.1;
            const rotateY = offset === 0 ? 0 : offset > 0 ? -16 : 16;
            const blur = distance >= 4 ? 2.2 : distance === 3 ? 1.2 : 0;

            return (
              <motion.button
                type="button"
                key={photo.src}
                className={`${styles.card} ${isActive ? styles.active : ""}`.trim()}
                onClick={() => {
                  if (isActive) {
                    onPhotoClick(item.originalIndex);
                    return;
                  }
                  handleCardClick(index);
                }}
                animate={{
                  x: translateX,
                  y: translateY,
                  rotate,
                  rotateY,
                  scale: depthScale,
                  opacity,
                  filter: `blur(${blur}px)`
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  transformPerspective: 1100,
                  transformStyle: "preserve-3d",
                  zIndex: isActive ? 40 : 30 - distance,
                  visibility: isVisible ? "visible" : "hidden",
                  pointerEvents: isVisible ? "auto" : "none"
                }}
              >
                <img src={photo.src} alt={photo.title} loading="lazy" />
              </motion.button>
            );
          })}
        </motion.div>
      </Box>

      <Box className={styles.activeMeta}>
        <span className={styles.metaIndex}>{String(activeIndex + 1).padStart(2, "0")}</span>
        <span className={styles.metaDivider} />
        <span className={styles.metaTitle}>{shuffledPhotos[activeIndex]?.photo?.title ?? "Photography"}</span>
      </Box>
    </Box>
  );
}