window.addEventListener('DOMContentLoaded', () => {
    function carousel({transitionBtn}) {
        const carousel = document.querySelector('.carousel__contents'),
              slides = carousel.querySelectorAll('.carousel__slide'),
              carouselInner = document.querySelector('.carousel__inner'),
              nextBtn = document.querySelector('.next-btn'),
              prevBtn =  document.querySelector('.prev-btn');
              cloneFrst = slides[slides.length - 1].cloneNode(true),
              cloneLast = slides[0].cloneNode(true);
        
        slides[0].before(cloneFrst);
        slides[slides.length - 1].after(cloneLast);

        let activeSlide = 0, 
            activeSlidesPx = cloneFrst.offsetWidth, 
            isChangeSlideRunning = false;

        carousel.style.left = -activeSlidesPx + 'px'

        changeSizeCarouselInner(0);

        nextBtn.addEventListener('click', () => changeSlide(1))
        prevBtn.addEventListener('click', () => changeSlide(-1))

        function changeSizeCarouselInner(num) {
            carouselInner.style.width = slides[num].offsetWidth + 'px';
            carouselInner.style.height = slides[num].offsetHeight + 'px';
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
                return;
            } else if(activeSlide > slides.length - 1) {
                frstLastSlide(0);
                return;
            }

            changeSizeCarouselInner(activeSlide);
        }

        function frstLastSlide(numSlide) {
            isChangeSlideRunning = true;

            activeSlide = numSlide;
            let newLeft = cloneFrst.offsetWidth;

            if(numSlide == slides.length - 1) {
                newLeft = 0;
                slides.forEach(slide => newLeft += slide.offsetWidth)
            }

            changeSizeCarouselInner(numSlide);

            setTimeout(() => {
                activeSlidesPx = newLeft;
                isChangeSlideRunning = false;

                carousel.style.transition = '0s all';
                carousel.style.left = activeSlidesPx * -1 + 'px';
            }, +transitionBtn);
        }
    }

    carousel({
        transitionBtn: '1000'
    })
})