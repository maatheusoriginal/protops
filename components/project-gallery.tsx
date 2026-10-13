"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

type ProjectGalleryProps = {
  images: string[];
  projectName: string;
  labels: {
    open: string;
    close: string;
    previous: string;
    next: string;
    image: string;
  };
};

export function ProjectGallery({ images, projectName, labels }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") setActiveIndex((current) => current === null ? null : (current - 1 + images.length) % images.length);
      if (event.key === "ArrowRight") setActiveIndex((current) => current === null ? null : (current + 1) % images.length);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length]);

  const previous = () => setActiveIndex((current) => current === null ? null : (current - 1 + images.length) % images.length);
  const next = () => setActiveIndex((current) => current === null ? null : (current + 1) % images.length);

  return (
    <>
      <div className="project-gallery-grid">
        {images.map((image, index) => (
          <button
            type="button"
            className={`project-gallery-item project-gallery-item-${index + 1}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`${labels.open}: ${projectName}, ${labels.image} ${index + 1}`}
            key={image}
          >
            <img src={image} alt={`${projectName} — ${labels.image} ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} />
            <span><Expand aria-hidden="true" /> {index === 0 ? labels.open : String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${projectName} — ${labels.image} ${activeIndex + 1}`}>
          <button type="button" className="project-lightbox-close" onClick={() => setActiveIndex(null)} aria-label={labels.close}><X aria-hidden="true" /></button>
          <button type="button" className="project-lightbox-nav project-lightbox-prev" onClick={previous} aria-label={labels.previous}><ChevronLeft aria-hidden="true" /></button>
          <figure>
            <img src={images[activeIndex]} alt={`${projectName} — ${labels.image} ${activeIndex + 1}`} />
            <figcaption><span>{projectName}</span><span>{activeIndex + 1} / {images.length}</span></figcaption>
          </figure>
          <button type="button" className="project-lightbox-nav project-lightbox-next" onClick={next} aria-label={labels.next}><ChevronRight aria-hidden="true" /></button>
        </div>
      )}
    </>
  );
}
