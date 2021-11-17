class Carousel {
    minChunkSize = 5;
    maxChunkSize = 10;

    options = {};

    constructor(options) {
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

        const setContainer = (containerId) => {
            try {
                const carouselContainer = document.querySelector(`#${containerId}`);
                carouselContainer.classList.add('carousel-container');
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
        this.domHandler.init();
    };
}