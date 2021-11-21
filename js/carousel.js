class Carousel {
    options = {};

    component = null;

    guid = null;

    cardGuidList = null;

    loadingImage = '../gif/loading.gif';

    chunkSize = 4;

    pos = { left: 0, x: 0};

    idSelectors = {
        title: 'title',
        cardsContainer: 'cardsContainer',
        scrollableContainer: 'scrollableContainer',
        leftArrowButton: 'leftArrowButton',
        rightArrowButton: 'rightArrowButton',

    };

    classSelectors = {
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
                card.querySelector('p.card-duration').innerHTML = self.dataHandler.getDuration(cardOptions.duration);
                card.querySelector('p.card-type').innerHTML = cardOptions.type;
                if(cardOptions.cardinality === 'collection')
                    card.classList.add('stack');
            } catch (ex) {
                console.error(ex);
            }
        };

        const addCards = (cardNumber, right) => {
            try {
                let cardsHTML = '';
                for (let i = 0; i < cardNumber; i++) {
                    const cardObj = self.templatesHandler.getDefaultCard();
                    cardsHTML += cardObj.innerHTML;
                    self.cardGuidList.push(cardObj.guid);
                }
                const container = self.component.querySelector(`#${self.idSelectors.cardsContainer}`);

                if(right)
                    container.innerHTML = container.innerHTML + cardsHTML;
                else
                    container.innerHTML = cardsHTML + container.innerHTML;

                checkScroll(container);
            } catch (ex) {
                console.error(ex);
            }
        };

        const bindEvents = () => {
            try {
                self.component.querySelector(`#${self.idSelectors.leftArrowButton}`).addEventListener('click', leftArrowClick);
                self.component.querySelector(`#${self.idSelectors.rightArrowButton}`).addEventListener('click', rigthArrowClick);
            } catch (ex) {
                console.error(ex);
            }
        };

        const leftArrowClick = (e) => {
            const elem = self.component.querySelector(`#${self.idSelectors.scrollableContainer}`);
            const scrolling = self.dataHandler.getScrollWidth(self.component.clientWidth, false);
            if(elem.scrollLeft <= Math.abs(scrolling))
                e.target.classList.add('hide');

            self.component.querySelector(`#${self.idSelectors.rightArrowButton}`).classList.remove('hide');

            elem.scrollBy({
                top: 0,
                left: scrolling,
                behavior: 'smooth'
            });
        };

        const rigthArrowClick = (e) => {
            const elem = self.component.querySelector(`#${self.idSelectors.scrollableContainer}`);
            const scrolling = self.dataHandler.getScrollWidth(self.component.clientWidth, true);
            if(elem.offsetWidth + elem.scrollLeft + scrolling >= elem.scrollWidth)
                e.target.classList.add('hide');

            self.component.querySelector(`#${self.idSelectors.leftArrowButton}`).classList.remove('hide');
            elem.scrollBy({
                top: 0,
                left: scrolling,
                behavior: 'smooth'
            });
        };

        const render = () => {
            try {
                let innerHTML = '';
                let arrowsHTML = '';
                innerHTML += self.templatesHandler.getTitleContainer();
                arrowsHTML += self.templatesHandler.getLeftArrow();
                arrowsHTML += self.templatesHandler.getRightArrow();
                innerHTML += self.templatesHandler.getResizableContainer(arrowsHTML);
                this.component.classList.add('carousel');
                this.component.innerHTML = innerHTML;

                self.dataHandler.fetchCards();
            } catch (ex) {
                console.error(ex);
            }
        };

        const checkScroll = (container) => {
            try {
                self.component.querySelector(`#${self.idSelectors.leftArrowButton}`).classList.add('hide');
                if(self.component.clientWidth >= container.clientWidth){
                    self.component.querySelector(`#${self.idSelectors.rightArrowButton}`).classList.add('hide');
                }
            } catch (ex) {
                console.error(ex);
            }
        }

        const init = () => {
            render();
            bindEvents();
        };

        return {
            init,
            updateCard,
            addCards
        };
    })();

    templatesHandler = (() => {
        const self = this;

        const getResizableContainer = (arrowsHTML) => `<div class="carousel-container">
                                                           ${arrowsHTML}
                                                           <div id="${self.idSelectors.scrollableContainer}" class="scrollable-container">
                                                               <div id="${self.idSelectors.cardsContainer}" class="cards-container"></div>
                                                           </div>
                                                       </div>
                                             </div>`;
        const getTitleContainer = () => `<span class="material-icons font-48">photo_camera</span>
                                         <span class="title font-48"><b>${self.options.title}</b></span>
                                         <h4 class="subtitle">${self.options.subTitle}</h4>`;
        const getLeftArrow = () => `<a id="${this.idSelectors.leftArrowButton}" class="arrow-button left-arrow-button material-icons">
                                        arrow_back_ios
                                    </a>`;

        const getRightArrow = () => `<a id="${this.idSelectors.rightArrowButton}" class="arrow-button right-arrow-button material-icons">
                                         arrow_forward_ios
                                     </a>`;

        const getDefaultCard = () => {
            const guid = `card-${Utility.createGuid()}`;
            const innerHTML = `<div id="${guid}" class="carousel-card">
                                   <img src="${this.loadingImage}" alt="Title" class="card-img">
                                   <p class="card-type"></p>
                                   <p class="card-duration"></p>
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
            getCardTitle,
            getTitleContainer
        };
    })();

    dataHandler = (() => {
        const self = this;

        const getScrollWidth = (containerWidth, isForward) => {
            const cardWidth = self.component.querySelector(`.${self.classSelectors.card}`).clientWidth;
            const mutiplier = isForward ? 1 : -1;
            const nCards = Math.floor(containerWidth / cardWidth);
            return mutiplier * cardWidth * nCards;
        }

        const handleChunk = (cardArray) => {
            try {
                for(const index in cardArray)
                    self.domHandler.updateCard(self.cardGuidList.shift(), cardArray[index]);
            } catch (ex) {
                console.error(ex);
            }
        }

        const fetchCards = () => {
            try {
                const chunkData = self.options.fetchCards(self.chunkSize);
                const cardNumber = chunkData.chunkNumber * self.chunkSize;
                self.domHandler.addCards(cardNumber, true);
                for (const index in chunkData.chunkList) {
                    chunkData.chunkList[index].then((cardArray) => {
                        handleChunk(cardArray);
                    }).catch((ex) => {
                        console.error(ex);
                    });
                }
            } catch (ex) {
                console.error(ex);
            }
        };

        const getDuration = (totalSeconds) => {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
            const seconds = Math.floor(totalSeconds - (hours * 3600) - (minutes * 60))
            return `${hours > 0 ? hours : '00'}:${minutes > 0 ? minutes : '00'}:${seconds > 0 ? seconds : '00'}`;
        };

        return {
            getScrollWidth,
            fetchCards,
            getDuration
        };
    })();

    init = () => {
        for (let elem in this.idSelectors) {
            this.idSelectors[elem] += '-' + this.guid;
        }
        this.domHandler.init();
    };
}