/**
 * Carousel class
 */
class Carousel {
    /**
     * Configuration object
     */
    options = {};

    /**
     * Carousel HTML element
     */
    component = null;

    /**
     * Component GUID - Used to make the component unique
     */
    guid = null;

    /**
     * Utility array containing card Ids
     */
    cardGuidList = null;

    /**
     * Image showed during loading
     */
    loadingImage = '../gif/loading.gif';

    // Size of each chunk requested at the API
    chunkSize = 4;

    /**
     * Id selectors of elements inside carousel
     */
    idSelectors = {
        title: 'title',
        cardsContainer: 'cardsContainer',
        scrollableContainer: 'scrollableContainer',
        leftArrowButton: 'leftArrowButton',
        rightArrowButton: 'rightArrowButton',
    };

    /**
     * Class selectors of elements inside carousel
     */
    classSelectors = {
        card: 'carousel-card'
    };

    /**
     * Class constructor
     * @param {object} options carousel rendering options
     */
    constructor(options) {
        this.guid = Utility.createGuid();
        this.cardGuidList = new Array();
        this.options = options;
        this.component = document.querySelector(`#${options.container}`);
        this.init();
    }

    /**
     * Section containing all methods to handle DOM
     */
    domHandler = (() => {
        const self = this;

        /**
         * Updates a single card
         * @param {string} cardId card's id to select wanted card
         * @param {object} cardOptions card's options
         */
        const updateCard = (cardId, cardOptions) => {
            try {
                const card = self.component.querySelector(`#${cardId}`);

                card.querySelector('img').src = cardOptions.image;
                card.querySelector('div.card-title').innerHTML = self.templatesHandler.getCardTitle(cardOptions.title);
                card.querySelector('p.card-duration').innerHTML = self.dataHandler.getDuration(cardOptions.duration);
                card.querySelector('p.card-type').innerHTML = cardOptions.type;
                if (cardOptions.cardinality === 'collection')
                    card.classList.add('stack');
            } catch (ex) {
                console.error(ex);
            }
        };

        /**
         * Add cards to the right container
         * @param {number} cardNumber number of cards to render
         * @param {boolean} right side where cards must be rendered respect preExisting cards
         */
        const addCards = (cardNumber, right) => {
            try {
                let cardsHTML = '';
                for (let i = 0; i < cardNumber; i++) {
                    const cardObj = self.templatesHandler.getDefaultCard();
                    cardsHTML += cardObj.innerHTML;
                    self.cardGuidList.push(cardObj.guid);
                }
                const container = self.component.querySelector(`#${self.idSelectors.cardsContainer}`);

                if (right)
                    container.innerHTML = container.innerHTML + cardsHTML;
                else
                    container.innerHTML = cardsHTML + container.innerHTML;

                checkScroll(container);
            } catch (ex) {
                console.error(ex);
            }
        };

        /**
         * Binds events to handling methods
         */
        const bindEvents = () => {
            try {
                self.component.querySelector(`#${self.idSelectors.leftArrowButton}`).addEventListener('click', leftArrowClick);
                self.component.querySelector(`#${self.idSelectors.rightArrowButton}`).addEventListener('click', rigthArrowClick);
                const scrollableContainer = self.component.querySelector(`#${self.idSelectors.scrollableContainer}`)
                scrollableContainer.addEventListener('mousedown', mouseDownHandler);
                // scrollableContainer.addEventListener('mouseleave', mouseLeaveHandler);
                // scrollableContainer.addEventListener('mouseup', mouseUpHandler);
                // scrollableContainer.addEventListener('mousemove', mouseMoveHandler);
            } catch (ex) {
                console.error(ex);
            }
        };

        let isDown = false;
        let startX, scrollLeft;
        const mouseDownHandler = (e) => {
            e.currentTarget.addEventListener('mousemove', mouseMoveHandler);
            e.currentTarget.addEventListener('mouseleave', mouseLeaveHandler);
            e.currentTarget.addEventListener('mouseup', mouseUpHandler);

            isDown = true;
            startX = e.pageX - e.currentTarget.offsetLeft;
            scrollLeft = e.currentTarget.scrollLeft;
            
        };

        const mouseLeaveHandler = (e) => {
            isDown = false;
            e.currentTarget.removeEventListener('mousemove', mouseMoveHandler);
            e.currentTarget.removeEventListener('mouseleave', mouseLeaveHandler);
            e.currentTarget.removeEventListener('mouseup', mouseUpHandler);

            checkScroll(e.currentTarget);
        };

        const mouseUpHandler = (e) => {
            isDown = false;
            e.currentTarget.removeEventListener('mousemove', mouseMoveHandler);
            e.currentTarget.removeEventListener('mouseleave', mouseLeaveHandler);
            e.currentTarget.removeEventListener('mouseup', mouseUpHandler);

            checkScroll(e.currentTarget);
        };

        const mouseMoveHandler = (e) => {
            if (!isDown)
                return;
            e.preventDefault();
            const x = e.pageX - e.currentTarget.offsetLeft;
            const walk = (x - startX); // to scroll-fast do * 3
            e.currentTarget.scrollLeft = scrollLeft - walk;
        }

        /**
         * Click handler for left arrow button
         * @param {MouseEvent} e 
         */
        const leftArrowClick = (e) => {
            const elem = self.component.querySelector(`#${self.idSelectors.scrollableContainer}`);
            const scrolling = self.dataHandler.getScrollWidth(self.component.clientWidth, false);
            if (elem.scrollLeft <= Math.abs(scrolling))
                e.target.classList.add('hide');

            self.component.querySelector(`#${self.idSelectors.rightArrowButton}`).classList.remove('hide');

            elem.scrollBy({
                top: 0,
                left: scrolling,
                behavior: 'smooth'
            });
        };

        /**
         * Click handler for right arrow button
         * @param {MouseEvent} e
         */
        const rigthArrowClick = (e) => {
            const elem = self.component.querySelector(`#${self.idSelectors.scrollableContainer}`);
            const scrolling = self.dataHandler.getScrollWidth(self.component.clientWidth, true);
            if (elem.clientWidth + elem.scrollLeft + scrolling >= elem.scrollWidth)
                e.target.classList.add('hide');

            self.component.querySelector(`#${self.idSelectors.leftArrowButton}`).classList.remove('hide');
            elem.scrollBy({
                top: 0,
                left: scrolling,
                behavior: 'smooth'
            });
        };

        /**
         * Renders the carousel component inside the container
         */
        const render = () => {
            try {
                let innerHTML = '';
                let arrowsHTML = '';
                innerHTML += self.templatesHandler.getTitleContainer();
                arrowsHTML += self.templatesHandler.getLeftArrow();
                arrowsHTML += self.templatesHandler.getRightArrow();
                innerHTML += self.templatesHandler.getCarouselContainer(arrowsHTML);
                this.component.classList.add('carousel');
                this.component.innerHTML = innerHTML;

                self.dataHandler.fetchCards();
            } catch (ex) {
                console.error(ex);
            }
        };

        /**
         * Check if side buttons must be showed
         * @param {HTMLElement} container 
         * @param {boolean} startup
         */
        const checkScroll = (container) => {
            try {
                if(container.scrollLeft === 0)
                    self.component.querySelector(`#${self.idSelectors.leftArrowButton}`).classList.add('hide');
                else
                    self.component.querySelector(`#${self.idSelectors.leftArrowButton}`).classList.remove('hide');

                if(container.scrollLeft + self.component.clientWidth > container.scrollWidth)
                    self.component.querySelector(`#${self.idSelectors.rightArrowButton}`).classList.add('hide');
                else
                    self.component.querySelector(`#${self.idSelectors.rightArrowButton}`).classList.remove('hide');
            } catch (ex) {
                console.error(ex);
            }
        }

        /**
         * Stats rendering process;
         */
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

    /**
     * Section containing all templates needed
     */
    templatesHandler = (() => {
        const self = this;

        /**
         * @param {string} arrowsHTML html template of the arrow buttons
         * @returns {string} html template of the component
         */
        const getCarouselContainer = (arrowsHTML) => `<div class="carousel-container">
                                                           ${arrowsHTML}
                                                           <div id="${self.idSelectors.scrollableContainer}" class="scrollable-container">
                                                               <div id="${self.idSelectors.cardsContainer}" class="cards-container"></div>
                                                           </div>
                                                       </div>
                                             </div>`;

        /**
         * @returns {string} html template of the carousel title
         */
        const getTitleContainer = () => `<span class="material-icons font-48">photo_camera</span>
                                         <span class="title font-48"><b>${self.options.title}</b></span>
                                         <h4 class="subtitle">${self.options.subTitle}</h4>`;
        /**
         * @returns {string} html template for the left arrow button
         */
        const getLeftArrow = () => `<a id="${this.idSelectors.leftArrowButton}" class="arrow-button left-arrow-button material-icons">
                                        arrow_back_ios
                                    </a>`;

        /**
         * @returns {string} html template for the right arrow button
         */
        const getRightArrow = () => `<a id="${this.idSelectors.rightArrowButton}" class="arrow-button right-arrow-button material-icons">
                                         arrow_forward_ios
                                     </a>`;

        /**
         * @returns {string} html template of the default card during loading
         */
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

        /**
         * @param {string} text 
         * @returns {string} html template of the card title
         */
        const getCardTitle = (text) => `<h4><b>${text}</b></h4>`;

        return {
            getDefaultCard,
            getCarouselContainer,
            getLeftArrow,
            getRightArrow,
            getCardTitle,
            getTitleContainer
        };
    })();

    /**
     * Section containing all methods to handle data and logic
     */
    dataHandler = (() => {
        const self = this;

        /**
         * @param {number} containerWidth width of the container to be scrolled
         * @param {boolean} isForward direction of scrolling
         * @returns {number} of pixel to be scrolled
         */
        const getScrollWidth = (containerWidth, isForward) => {
            const cardWidth = self.component.querySelector(`.${self.classSelectors.card}`).clientWidth;
            const mutiplier = isForward ? 1 : -1;
            const nCards = Math.floor(containerWidth / cardWidth);
            return mutiplier * cardWidth * nCards;
        }

        /**
         * Handle single chunk returned from the API
         * @param {[object]} cardArray Array of card options inside the chunk
         */
        const handleChunk = (cardArray) => {
            try {
                for (const index in cardArray)
                    self.domHandler.updateCard(self.cardGuidList.shift(), cardArray[index]);
            } catch (ex) {
                console.error(ex);
            }
        }

        /**
         * Calls the API to get data - sets the promise callback
         */
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

        /**
         * @param {number} totalSeconds 
         * @returns {string} string representing the requested duration in a human readable way
         */
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

    /**
     * Method that stars carousel rendering process
     */
    init = () => {
        for (let elem in this.idSelectors) {
            this.idSelectors[elem] += '-' + this.guid;
        }
        this.domHandler.init();
    };
}