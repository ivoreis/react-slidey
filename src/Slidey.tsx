import React from 'react';
import './Slidey.css';
import styles from './Slidey.css.json';

export type Effect =
  | 'Left'
  | 'Right'
  | 'BounceLeft'
  | 'BounceRight'
  | 'Fade'
  | 'Top'
  | 'Bottom';

interface SlideyProps {
  showIndex: boolean;
  showArrows: boolean;
  autoplay: boolean;
  enableKeyboard: boolean;
  useDotIndex: boolean;
  slideInterval: number;
  defaultIndex: number;
  effect: Effect;
  children: React.ReactNode[];
}

interface ArrowProps {
  decreaseCount: () => void;
  increaseCount: () => void;
}

interface DotProps {
  activeClass: string;
  key: string;
  gotoSlide: () => void;
}

const Arrows = (props: ArrowProps) => {
  return (
    <div>
      <span
        onClick={props.decreaseCount}
        className={`${styles.btnArrow} ${styles.btnArrowLeft}`}
      />
      <span
        onClick={props.increaseCount}
        className={`${styles.btnArrow} ${styles.btnArrowRight}`}
      />
    </div>
  );
};

const Dot = (props: DotProps) => {
  return (
    <span
      onClick={props.gotoSlide}
      className={`${styles.dot} ${props.activeClass}`}
    />
  );
};

const Slidey = (props: SlideyProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(props.defaultIndex);
  const [effect, setEffect] = React.useState(props.effect);
  const [intervalId, setIntervalId] = React.useState(null);

  const {
    enableKeyboard,
    slideInterval,
    showIndex,
    useDotIndex,
    showArrows,
    autoplay,
  } = props;

  const slides = props.children;

  const autoSlideshow = () => {
    setCurrentSlide(prevState => (prevState + 1) % slides.length);
  };

  const runSlideShow = () =>
    setIntervalId(setInterval(autoSlideshow, slideInterval));

  const restartSlideshow = () => {
    clearInterval(intervalId);
    runSlideShow();
  };

  const gotoSlide = (nextSlide: number) => () => {
    intervalId && clearInterval(intervalId);
    currentSlide < nextSlide && effect === 'Left' && setEffect('Right');
    currentSlide < nextSlide &&
      effect === 'BounceLeft' &&
      setEffect('BounceRight');
    currentSlide > nextSlide && effect === 'Right' && setEffect('Left');
    currentSlide > nextSlide &&
      effect === 'BounceRight' &&
      setEffect('BounceLeft');
    currentSlide !== nextSlide && setCurrentSlide(nextSlide);
  };

  const increaseCount = () => {
    intervalId && clearInterval(intervalId);
    effect === 'Left' && setEffect('Right');
    effect === 'BounceLeft' && setEffect('BounceRight');
    setCurrentSlide(prevState => (prevState + 1) % slides.length);
  };

  const decreaseCount = () => {
    intervalId && clearInterval(intervalId);
    effect === 'Right' && setEffect('Left');
    effect === 'BounceRight' && setEffect('BounceLeft');
    setCurrentSlide(
      prevState => (prevState - 1 + slides.length) % slides.length
    );
  };

  const handleKeyboard = (e: any) => {
    e.keyCode === 37 && decreaseCount();
    e.keyCode === 39 && increaseCount();
  };

  React.useEffect(() => {
    autoplay && runSlideShow();
    enableKeyboard && document.addEventListener('keydown', handleKeyboard);

    return () => {
      enableKeyboard && document.removeEventListener('keydown', handleKeyboard);
      intervalId && clearInterval(intervalId);
    };
  }, []);

  let slideShowIndex: React.ReactNode;

  const slideShowSlides = slides.map((slide, i) => {
    const showing = currentSlide === i ? styles[`showing${effect}`] : '';
    return (
      <li className={`${styles.slide} ${showing}`} key={i}>
        {slide}
      </li>
    );
  });

  if (useDotIndex) {
    slideShowIndex = (
      <div className={`${styles.showIndex} ${styles.isDot}`}>
        {slides.map((_, i) => {
          const activeClass = currentSlide === i ? styles.isActive : '';
          return (
            <Dot
              gotoSlide={gotoSlide(i)}
              activeClass={activeClass}
              key={`dot${i}`}
            />
          );
        })}
      </div>
    );
  } else {
    slideShowIndex = (
      <div className={`${styles.showIndex} ${styles.isText}`}>
        <p>{`${currentSlide + 1} / ${slides.length}`}</p>
      </div>
    );
  }

  return (
    <div className={styles.slideyContainer}>
      <ul className={styles.slides}>{slideShowSlides}</ul>
      {showArrows && (
        <Arrows decreaseCount={decreaseCount} increaseCount={increaseCount} />
      )}
      {showIndex && slideShowIndex}
    </div>
  );
};

Slidey.defaultProps = {
  showIndex: true,
  useDotIndex: true,
  showArrows: false,
  autoplay: true,
  enableKeyboard: true,
  slideInterval: 3000,
  defaultIndex: 0,
  effect: 'Fade',
};

export default Slidey;
