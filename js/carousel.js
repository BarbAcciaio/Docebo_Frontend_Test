class Carousel {
    minChunkSize = 5;
    maxChunkSize = 10;

    options = {};

    guid = null;
    carouselSelectors = {
        leftArrowContainer: 'leftArrow',
        leftArrowButton: 'leftArrowButton',
        rightArrowContainer: 'rightArrow',
        rightArrowButton: 'rightArrowButton'
    };

    constructor(options) {
        this.guid = Utility.createGuid();
        this.options = options;
        this.init();
    }

    domHandler = (() => {
        const self = this;

        const fetchCards = () => {
            const chunkSize = this.dataHandler.getChunkSize();
            self.options.fetchCards(chunkSize).then((cardArray) => {
                renderCard(cardArray);
            }).catch((ex) => {
                console.log(ex);
            });
        };

        const renderCard = (cardArray) => {

        }

        const init = () => {
            self.templatesHandler.setContainer(this.options.container);
        }
        return {
            init
        };
    })();

    templatesHandler = (() => {
        const self = this;

        const getCard = (params) => {

        };

        const getLeftArrow = () => `<a id="${this.carouselSelectors.leftArrowButton}" class="left-arrow-button"></a>`;
        // const getLeftArrow = () => `<span id="${this.carouselSelectors.leftArrowContainer}" class="left-arrow">
        //                                 <a id="${this.carouselSelectors.leftArrowButton}" class="left-arrow-button"></a>
        //                             </span>`;

        const getRightArrow = () => `<a id="${this.carouselSelectors.rightArrowButton}" class="right-arrow-button"></a>`;

        const setContainer = (containerId) => {
            try {
                let innerHTML = '';
                innerHTML += getLeftArrow();
                innerHTML += getRightArrow();
                const carouselContainer = document.querySelector(`#${containerId}`);
                carouselContainer.classList.add('carousel-container');
                carouselContainer.innerHTML = innerHTML;

            } catch (ex) {
                console.log(ex);
            }
        }
        return {
            getCard, setContainer
        };
    })();

    dataHandler = (() => {
        const self = this;
        const getChunkSize = () => {
            return Utility.getRandomInt(this.minChunkSize, this.maxChunkSize);
        }

        return {
            getChunkSize
        };
    })();

    init = () => {
        for (let elem in this.carouselSelectors) {
            this.carouselSelectors[elem] += '-' + this.guid;
        }
        this.domHandler.init();
    };
}