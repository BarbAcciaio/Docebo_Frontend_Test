class Carousel {
    minChunkSize = 5;
    maxChunkSize = 10;

    options = {};

    guid = null;
    carouselSelectors = {
        leftArrowButton: 'leftArrowButton',
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

        const getLeftArrow = () => `<a id="${this.carouselSelectors.leftArrowButton}" class="arrow-button left-arrow-button"></a>`;

        const getRightArrow = () => `<a id="${this.carouselSelectors.rightArrowButton}" class="arrow-button right-arrow-button"></a>`;

        const getCard = () => `<div class="carousel-card">
                                   <div class="img-container">
                                       <img src="https://thispersondoesnotexist.com/image" alt="Title" class="card-img">
                                   </div>
                                   <div class="card-title">
                                       <h4><b>John Doe</b></h4>
                                     <p>Architect & Engineer</p>
                                   </div>
                               </div>`

        const setContainer = (containerId) => {
            try {
                let innerHTML = '';
                innerHTML += getLeftArrow();
                innerHTML += getRightArrow();
                innerHTML += getCard();
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