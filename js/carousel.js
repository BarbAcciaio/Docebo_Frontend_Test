class Carousel {
    minChunkSize = 5;
    maxChunkSize = 10;

    options = {};

    component = null;

    guid = null;

    loadingImage = '../gif/loading.gif';

    carouselIdSelectors = {
        resizableContainer: 'resizableContainer',
        leftArrowButton: 'leftArrowButton',
        rightArrowButton: 'rightArrowButton',

    };

    carouselClassSelectors = {
        card: 'carousel-card'
    };

    constructor(options) {
        this.guid = Utility.createGuid();
        this.options = options;
        this.component = document.querySelector(`#${options.container}`);
        this.init();
    }

    domHandler = (() => {
        const self = this;

        const fetchCards = (cardElements) => {
            const chunkSize = this.dataHandler.getChunkSize();
            self.options.fetchCards(chunkSize).then((cardArray, cardElements) => {
                updateCard(cardArray);
            }).catch((ex) => {
                console.log(ex);
            });
        };

        const updateCard = (cardArray, cardElements) => {
            try {
                for(let i = 0; i < cardArray; i++){
                    cardElements[i].querySelector('img').src = cardArray[i].image;
                }
            } catch (ex) {
                console.error(ex);
            }
        }

        const bindEvents = () => {
            try {
                self.component.querySelector(`#${self.carouselIdSelectors.leftArrowButton}`).addEventListener('click', leftArrowClick);
                self.component.querySelector(`#${self.carouselIdSelectors.rightArrowButton}`).addEventListener('click', rigthArrowClick);
            } catch (ex) {
                console.error(ex);
            }
        };

        const leftArrowClick = (e) => {
            const elem = self.component.querySelector(`#${self.carouselIdSelectors.resizableContainer}`);
            elem.scrollBy({
                top: 0,
                left: self.dataHandler.getScrollWidth(elem.clientWidth, false),
                behavior: 'smooth'
            });
        };

        const rigthArrowClick = (e) => {
            const elem = self.component.querySelector(`#${self.carouselIdSelectors.resizableContainer}`);
            elem.scrollBy({
                top: 0,
                left: self.dataHandler.getScrollWidth(elem.clientWidth, true),
                behavior: 'smooth'
            });
        };

        const init = () => {
            const chunkSize = this.dataHandler.getChunkSize();
            self.templatesHandler.setContainer(chunkSize);
            bindEvents();
        }
        return {
            init
        };
    })();

    templatesHandler = (() => {
        const self = this;

        const getResizableContainer = (innerHTML) => `<div id="${self.carouselIdSelectors.resizableContainer}" class="resizable-container">
                                                          <div class="cards-container">${innerHTML}</div>
                                                      </div>`;

        const getLeftArrow = () => `<a id="${this.carouselIdSelectors.leftArrowButton}" class="arrow-button left-arrow-button material-icons">
                                        arrow_back_ios
                                    </a>`;

        const getRightArrow = () => `<a id="${this.carouselIdSelectors.rightArrowButton}" class="arrow-button right-arrow-button material-icons">
                                         arrow_forward_ios
                                     </a>`;

        const getCard = () => {
            const guid = Utility.createGuid();
            const idList = new Array();
            const innerHTML = `<div class="carousel-card">
                                   <div class="img-container">
                                       <img id="${guid}" src="${this.loadingImage}" alt="Title" class="card-img">
                                   </div>
                                   <div class="card-title">
                                       <h4><b>John Doe</b></h4>
                                     <p>Architect & Engineer</p>
                                   </div>
                               </div>`;
        }

        const setContainer = (chunkSize) => {
            try {
                let innerHTML = '';
                innerHTML += getLeftArrow();
                innerHTML += getRightArrow();
                let cardsHTML = '';
                for (let i = 0; i < chunkSize; cardsHTML += getCard(), i++);
                cardsHTML = getResizableContainer(cardsHTML);
                innerHTML += cardsHTML;
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
            // return Utility.getRandomInt(this.minChunkSize, this.maxChunkSize);
            return 20;
        }

        const getScrollWidth = (elemWidth, isForward) => {
            const mutiplier = isForward ? 1 : -1;
            return mutiplier * Math.floor(elemWidth / 2);
        }

        return {
            getChunkSize,
            getScrollWidth
        };
    })();

    init = () => {
        for (let elem in this.carouselIdSelectors) {
            this.carouselIdSelectors[elem] += '-' + this.guid;
        }
        this.domHandler.init();
    };
}