class Carousel {
    options = {};

    component = null;

    guid = null;

    cardGuidList = null;

    loadingImage = '../gif/loading.gif';

    chunkSize = 4;

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
                const containerHTML = container.innerHTML;

                if(right)
                    container.innerHTML = container.innerHTML + cardsHTML;
                else
                    container.innerHTML = cardsHTML + container.innerHTML;
            } catch (ex) {
                console.error(ex);
            }
        };

        const bindEvents = () => {
            try {
                const leftArrow = self.component.querySelector(`#${self.idSelectors.leftArrowButton}`);
                const rightArrow = self.component.querySelector(`#${self.idSelectors.rightArrowButton}`);
                leftArrow.addEventListener('click', leftArrowClick);
                rightArrow.addEventListener('click', rigthArrowClick);
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
        const getTitleContainer = () => `<h2 class="title"><b>${self.options.title}</b></h2>
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
            getCardTitle,
            getTitleContainer
        };
    })();

    dataHandler = (() => {
        const self = this;

        const getScrollWidth = (elemWidth, isForward) => {
            const mutiplier = isForward ? 1 : -1;
            return mutiplier * Math.floor(elemWidth / 2);
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
                self.domHandler.addCards(chunkData.chunkNumber * self.chunkSize, true);
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

        return {
            getScrollWidth,
            fetchCards
        };
    })();

    init = () => {
        for (let elem in this.idSelectors) {
            this.idSelectors[elem] += '-' + this.guid;
        }
        this.domHandler.init();
    };
}