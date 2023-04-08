window.addEventListener('DOMContentLoaded', () => {
    function carousel({transitionBtn, transitionTouches, carouselSct, slidesSct, carouselInnerSct, nextBtnSct, prevBtnSct, navItemSct, navItemActiveSct, needNav, parentCarouselSct, mouseAndTouch, mouseMove, touchMove}) {
        const carousel = document.querySelector(carouselSct),
              slides = carousel.querySelectorAll(slidesSct),
              carouselInner = document.querySelector(carouselInnerSct),
              nextBtn = document.querySelector(nextBtnSct),
              prevBtn =  document.querySelector(prevBtnSct),
              parentCarousel = document.querySelector(parentCarouselSct),
              cloneFrst = slides[slides.length - 1].cloneNode(true),
              cloneLast = slides[0].cloneNode(true);
        
        slides[0].before(cloneFrst);
        slides[slides.length - 1].after(cloneLast);

        let activeSlide = 0, 
            activeSlidesPx = cloneFrst.offsetWidth, 
            isChangeSlideRunning = false;

        carousel.style.left = -activeSlidesPx + 'px'

        carouselInner.style.width = slides[0].offsetWidth + 'px';
        carouselInner.style.height = slides[0].offsetHeight + 'px';

        nextBtn.addEventListener('click', () => changeSlide(1, transitionBtn));
        prevBtn.addEventListener('click', () => changeSlide(-1, transitionBtn));

        if(needNav) {
            const navItemActive = navItemActiveSct.slice(1)
            const carouselNavItem = document.querySelectorAll(navItemSct);
            carouselNavItem[0].classList.add(navItemActive);
    
            carouselNavItem.forEach((navItem, i) => navItem.addEventListener('click', () => {
                activeSlide = i;
                changeSlide(0);
            }))
    
            function changeActiveNavItem(num) {
                carouselNavItem.forEach(item => item.classList.remove(navItemActive))
                carouselNavItem[num].classList.add(navItemActive);
            }
        }

        function changeSlide(num, transition) {
            if(isChangeSlideRunning) return;

            carousel.style.transition = transition + 'ms all'

            activeSlide += num;

            activeSlidesPx = cloneFrst.offsetWidth;
            slides.forEach((slide, i) => {
                if(i < activeSlide) {
                    activeSlidesPx += slide.offsetWidth;
                }
            })

            carousel.style.left = activeSlidesPx * -1 + 'px';

            if(activeSlide < 0) {
                carousel.style.left = 0 + 'px';

                frstLastSlide(slides.length - 1, transition);
                if(needNav) changeActiveNavItem(slides.length - 1);
                return;
            } else if(activeSlide > slides.length - 1) {
                frstLastSlide(0, transition);
                if(needNav) changeActiveNavItem(0);
                return;
            }

            carouselInner.style.width = slides[activeSlide].offsetWidth + 'px';
            if(needNav) changeActiveNavItem(activeSlide);
        }

        function frstLastSlide(numSlide, transition) {
            isChangeSlideRunning = true;

            activeSlide = numSlide;
            let newLeft = cloneFrst.offsetWidth;

            if(numSlide == slides.length - 1) {
                newLeft = 0;
                slides.forEach(slide => newLeft += slide.offsetWidth)
            }

            carouselInner.style.width = slides[numSlide].offsetWidth + 'px';

            setTimeout(() => {
                activeSlidesPx = newLeft;
                isChangeSlideRunning = false;

                carousel.style.transition = '0s all';
                carousel.style.left = activeSlidesPx * -1 + 'px';
            }, +transition);
        }

        if(mouseAndTouch) {
            let eTouchAndMouseStart, eTouchAndMouseMove, touchAndMouseSlide;

            slides.forEach((slide, i) => {
                if(touchMove) {
                    slide.addEventListener('touchstart', (e) => {
                        isMouse = false;
        
                        eTouchAndMouseStart = e.touches[0].clientX;
        
                        touchAndMouseSlide = i;
        
                        carousel.style.transition = '0s all';
        
                        slide.addEventListener('touchmove', touchMoveListener);
                        slide.addEventListener('touchend', touchEnd);
                    })
                }
    
                if(mouseMove) slide.addEventListener('mousedown', mouseStart);
            })

            let isMouse;
    
            function mouseStart(e) {
                isMouse = true;
                eTouchAndMouseStart = e.clientX;
    
                slides.forEach((slide, i) => {
                    if(slide === e.target.parentElement) touchAndMouseSlide = i;
                });
    
                slides[touchAndMouseSlide].removeEventListener('mousedown', mouseStart);
    
                carousel.style.cursor = 'grabbing';
                carousel.style.transition = '0s all';
    
                parentCarousel.addEventListener('mousemove', touchMoveListener);
                parentCarousel.addEventListener('mouseup', touchEnd);
            }
    
            function touchEnd(e) {
                if(isMouse) {
                    slides[touchAndMouseSlide].addEventListener('mousedown', mouseStart);
    
                    parentCarousel.removeEventListener('mouseup', touchEnd);
                    parentCarousel.removeEventListener('mousemove', touchMoveListener);
    
                    carousel.style.cursor = 'grab';
    
                    isMouse = false;
                } 
    
                if(eTouchAndMouseMove > slides[touchAndMouseSlide].offsetWidth / 2 - 100) changeSlide(-1, transitionTouches); 
                else if (eTouchAndMouseMove < slides[touchAndMouseSlide].offsetWidth / 2 - 100 && eTouchAndMouseMove > -slides[touchAndMouseSlide].offsetWidth / 2 + 100) changeSlide(0, transitionTouches);
                else if (eTouchAndMouseMove < -slides[touchAndMouseSlide].offsetWidth / 2 + 100) changeSlide(1, transitionTouches);
            }
    
            function touchMoveListener(e) {
                if (isMouse) eTouchAndMouseMove = e.clientX - eTouchAndMouseStart;
                else eTouchAndMouseMove = e.touches[0].clientX - eTouchAndMouseStart;
    
                carousel.style.left = -activeSlidesPx + eTouchAndMouseMove + 'px';
    
                if(touchAndMouseSlide === 0 && eTouchAndMouseMove >= slides[slides.length - 1].offsetWidth - 25
                    || touchAndMouseSlide === slides.length - 1 && eTouchAndMouseMove <= -slides[0].offsetWidth + 25
                    || slides[touchAndMouseSlide + 1] && eTouchAndMouseMove < 0 && eTouchAndMouseMove <= -slides[touchAndMouseSlide + 1].offsetWidth + 25
                    || slides[touchAndMouseSlide - 1] && eTouchAndMouseMove > 0 && eTouchAndMouseMove >= slides[touchAndMouseSlide - 1].offsetWidth - 25) {
    
                    if(isMouse) {
                        parentCarousel.removeEventListener('mousemove', touchMoveListener);
                        parentCarousel.removeEventListener('mouseup', touchEnd);
                    } else {
                        slides[touchAndMouseSlide].removeEventListener('touchmove', touchMoveListener);
                        slides[touchAndMouseSlide].removeEventListener('touchend', touchEnd);
                    }
                    touchEnd(slides[touchAndMouseSlide]);
                }
    
                if(isMouse && e.clientX <= (document.documentElement.clientWidth - slides[touchAndMouseSlide].offsetWidth - 10) / 2 
                    || isMouse && e.clientX >= (document.documentElement.clientWidth - slides[touchAndMouseSlide].offsetWidth) / 2 + slides[touchAndMouseSlide].offsetWidth - 10) {
                    parentCarousel.removeEventListener('mousemove', touchMoveListener);
                    parentCarousel.removeEventListener('mouseup', touchEnd);
    
                    touchEnd(slides[touchAndMouseSlide]);
                }
            }    
        }
    }

    carousel({
        transitionBtn: '1500',
        transitionTouches: '500',
        carouselSct: '.carousel__contents',
        slidesSct: '.carousel__slide',
        carouselInnerSct: '.carousel__inner',
        nextBtnSct: '.next-btn',
        prevBtnSct: '.prev-btn',
        navItemSct: '.carousel-nav__item',
        navItemActiveSct: '.carousel-nav__item_active',
        needNav: true,
        parentCarouselSct: '.carousel',
        mouseAndTouch: true,
        mouseMove: true,
        touchMove: true,
    })
})