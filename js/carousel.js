class Carousel {
    minChunkSize = 5;
    maxChunkSize = 10;

    options = {};

    component = null;

    guid = null;

    cardGuidList = null;

    loadingImage = '../gif/loading.gif';

    carouselIdSelectors = {
        resizableContainer: 'resizableContainer',
        cardsContainer: 'cardsContainer',
        leftArrowButton: 'leftArrowButton',
        rightArrowButton: 'rightArrowButton',

    };

    carouselClassSelectors = {
        card: 'carousel-card'
    };

    constructor(options) {
        this.guid = Utility.createGuid();
        this.cardGuidList = new Array();
        this.options = options;
        this.component = document.querySelector(`#${options.container}`);
        this.init();
    }

    domHandler = (() => {
        const self = this;

        const updateCard = (cardId, cardOptions) => {
            try {
                const card = self.component.querySelector(`#${cardId}`);

                card.querySelector('img').src = cardOptions.image;
                card.querySelector('div.card-title').innerHTML = self.templatesHandler.getCardTitle(cardOptions.title);
            } catch (ex) {
                console.error(ex);
            }
        }

        const addCards = (chunkSize, right) => {
            try {
                for (let i = 0; i < chunkSize; i++){
                    const cardObj = self.templatesHandler.getDefaultCard();
                    cardsHTML += cardObj.innerHTML;
                    this.cardGuidList.push(cardObj.guid);
                    currentCardGuidList.push(cardObj.guid);
                }

            } catch (ex) {
                log.error(ex);
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
            const elem = self.component.querySelector(`#${self.carouselIdSelectors.cardsContainer}`);
            // if(elem.offsetWidth + elem.scrollLeft >= elem.scrollWidth){

            // }
            elem.scrollBy({
                top: 0,
                left: self.dataHandler.getScrollWidth(elem.clientWidth, false),
                behavior: 'smooth'
            });
        };

        const rigthArrowClick = (e) => {
            const elem = self.component.querySelector(`#${self.carouselIdSelectors.cardsContainer}`);
            // if(elem.scrollLeft)
            elem.scrollBy({
                top: 0,
                left: self.dataHandler.getScrollWidth(elem.clientWidth, true),
                behavior: 'smooth'
            });
        };

        const render = () => {
            try {
                const chunkSize = self.dataHandler.getChunkSize();
                let innerHTML = '';
                const currentCardGuidList = new Array();
                innerHTML += self.templatesHandler.getLeftArrow();
                innerHTML += self.templatesHandler.getRightArrow();
                let cardsHTML = '';
                for (let i = 0; i < chunkSize; i++){
                    const cardObj = self.templatesHandler.getDefaultCard();
                    cardsHTML += cardObj.innerHTML;
                    this.cardGuidList.push(cardObj.guid);
                    currentCardGuidList.push(cardObj.guid);
                }
                cardsHTML = self.templatesHandler.getResizableContainer(cardsHTML);
                innerHTML += cardsHTML;
                this.component.classList.add('carousel-container');
                this.component.innerHTML = innerHTML;

                self.dataHandler.fetchCards(chunkSize, currentCardGuidList);
            } catch (ex) {
                console.error(ex);
            }
        };

        const init = () => {
            render();
            bindEvents();
        }

        const removeOldestCard = () =>{
            try {
                self.component.querySelector(`#${self.cardGuidList[0]}`).remove();
            } catch (ex) {
                console.error(ex);
            }
        }
        return {
            init,
            updateCard
        };
    })();

    templatesHandler = (() => {
        const self = this;

        const getResizableContainer = (innerHTML) => `<div id="${self.carouselIdSelectors.cardsContainer}" class="cards-container">${innerHTML}</div>`;

        const getLeftArrow = () => `<a id="${this.carouselIdSelectors.leftArrowButton}" class="arrow-button left-arrow-button material-icons">
                                        arrow_back_ios
                                    </a>`;

        const getRightArrow = () => `<a id="${this.carouselIdSelectors.rightArrowButton}" class="arrow-button right-arrow-button material-icons">
                                         arrow_forward_ios
                                     </a>`;

        const getDefaultCard = () => {
            const guid =`card-${Utility.createGuid()}`;
            const innerHTML = `<div id="${guid}" class="carousel-card">
                                   <div class="img-container">
                                       <img id="" src="${this.loadingImage}" alt="Title" class="card-img">
                                   </div>
                                   <div class="card-title">
                                       <div class="default-card-row-1"></div>
                                       <div class="default-card-row-2"></div>
                                   </div>
                               </div>`;

            return { innerHTML, guid };
        }

        const getCardTitle = (text) => `<h4><b>${text}</b></h4>`;

        return {
            getDefaultCard, 
            getResizableContainer,
            getLeftArrow,
            getRightArrow,
            getCardTitle
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

        const fetchCards = (chunkSize, cardGuidList) => {
            try {
                self.options.fetchCards(chunkSize).then((cardArray) => {
                    for(let i = 0; i < chunkSize; i++){
                        self.domHandler.updateCard(cardGuidList[i], cardArray[i]);
                    }
                }).catch((ex) => {
                    console.log(ex);
                });    
            } catch (ex) {
                console.error(ex);
            }
        };

        return {
            getChunkSize,
            getScrollWidth,
            fetchCards
        };
    })();

    init = () => {
        for (let elem in this.carouselIdSelectors) {
            this.carouselIdSelectors[elem] += '-' + this.guid;
        }
        this.domHandler.init();
    };
}