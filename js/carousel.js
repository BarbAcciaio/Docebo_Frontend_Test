class Carousel {
    minChunkSize = 5;
    maxChunkSize = 10;

    options = {};

    component = null;

    guid = null;

    loadingImage = '../gif/loading.gif';

    carouselSelectors = {
        resizableContainer: 'resizableContainer',
        leftArrowButton: 'leftArrowButton',
        rightArrowButton: 'rightArrowButton'
    };

    constructor(options) {
        this.guid = Utility.createGuid();
        this.options = options;
        this.component = document.querySelector(`#${options.container}`);
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
            const chunkSize = this.dataHandler.getChunkSize();        
            self.templatesHandler.setContainer(chunkSize);
        }
        return {
            init
        };
    })();

    templatesHandler = (() => {
        const self = this;

        const getResizableContainer = (innerHTML) => `<div class="resizable-container">${innerHTML}</div>`;

        const getLeftArrow = () => `<a id="${this.carouselSelectors.leftArrowButton}" class="arrow-button left-arrow-button material-icons"> arrow_back_ios</a>`;

        const getRightArrow = () => `<a id="${this.carouselSelectors.rightArrowButton}" class="arrow-button right-arrow-button material-icons md-light">arrow_forward_ios</a>`;

        const getCard = () => `<div class="carousel-card">
                                   <div class="img-container">
                                       <img src="${this.loadingImage}" alt="Title" class="card-img">
                                   </div>
                                   <div class="card-title">
                                       <h4><b>John Doe</b></h4>
                                     <p>Architect & Engineer</p>
                                   </div>
                               </div>`

        const setContainer = (chunkSize) => {
            try {
                let innerHTML = '';
                innerHTML += getLeftArrow();
                innerHTML += getRightArrow();
                for(let i = 0; i < chunkSize; innerHTML += getCard(), i++);
                // innerHTML += getCard();
                innerHTML = getResizableContainer(innerHTML);
                this.component.classList.add('carousel-container');
                this.component.innerHTML = innerHTML;

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