window.addEventListener('DOMContentLoaded', () => {
    function carousel({transitionBtn, carouselSct, slidesSct, carouselInnerSct, nextBtnSct, prevBtnSct, navItemSct, navItemActiveSct, needNav}) {
        const carousel = document.querySelector(carouselSct),
              slides = carousel.querySelectorAll(slidesSct),
              carouselInner = document.querySelector(carouselInnerSct),
              nextBtn = document.querySelector(nextBtnSct),
              prevBtn =  document.querySelector(prevBtnSct),
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

        nextBtn.addEventListener('click', () => changeSlide(1));
        prevBtn.addEventListener('click', () => changeSlide(-1));

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

        function changeSlide(num) {
            if(isChangeSlideRunning) return;

            carousel.style.transition = transitionBtn + 'ms all'

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

                frstLastSlide(slides.length - 1);
                if(needNav) changeActiveNavItem(slides.length - 1);
                return;
            } else if(activeSlide > slides.length - 1) {
                frstLastSlide(0);
                if(needNav) changeActiveNavItem(0);
                return;
            }

            carouselInner.style.width = slides[activeSlide].offsetWidth + 'px';
            if(needNav) changeActiveNavItem(activeSlide);
        }

        function frstLastSlide(numSlide) {
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
            }, +transitionBtn);
        }
    }

    carousel({
        transitionBtn: '1000',
        carouselSct: '.carousel__contents',
        slidesSct: '.carousel__slide',
        carouselInnerSct: '.carousel__inner',
        nextBtnSct: '.next-btn',
        prevBtnSct: '.prev-btn',
        navItemSct: '.carousel-nav__item',
        navItemActiveSct: '.carousel-nav__item_active',
        needNav: true,
    })
})