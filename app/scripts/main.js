	const SearchResults = function() {

		const component = {}

		component.init = function() {
			component.elements();
			component.setupClickEvents();
		};

		component.elements = function() {
			component.element = document.querySelector('.searchResults');
			component.accordionHeader = component.element.querySelectorAll('.searchResults_cardAccordionHeader');
			component.sortingButtons = component.element.querySelectorAll('.searchResults_facets_sortingButton');
			component.cardContainer = component.element.querySelector('.searchResults_cardContainer');
		};

		component.setupClickEvents = function() {
			component.accordionHeader.forEach(function(el) {
				el.addEventListener('click', component.openAccordions);
			})

			component.sortingButtons.forEach(function(el) {
				el.addEventListener('click', component.sortResults);
			});

			component.setupFilter();
		};

		component.setupFilter = function() {
			component.selectedFilters = [];
			component.filterCheckBoxes = component.element.querySelectorAll('input[type=checkbox].searchResults_leftrail_filterGroupCheckBox');
			component.filterCheckBoxes.forEach(function(el) {
				el.addEventListener('change', component.filterResults);
			});
		};

		component.openAccordions = function(e) {
			e.preventDefault();
			const currentTarget = e.currentTarget.parentElement;
			const accordionContent = currentTarget.querySelector('.searchResults_cardAccordionContent');
			const hasClass = currentTarget.classList.contains('searchResults_cardAccordion-open');

			currentTarget.classList.toggle('searchResults_cardAccordion-open');

			if(!hasClass) {
				accordionContent.setAttribute('aria-hidden', 'false');
				e.currentTarget.setAttribute('aria-expanded', 'true');
			} else {
				accordionContent.setAttribute('aria-hidden', 'true');
				e.currentTarget.setAttribute('aria-expanded', 'false');
			}
		};

		component.sortResults = function(e) {
			e.preventDefault();

			const currentTarget = e.currentTarget;
			const whichSort = currentTarget.getAttribute('data-sort');
			const sortingButtonActive = component.element.querySelector('.searchResults_facets_sortingButton-active');
			currentTarget.classList.add('searchResults_facets_sortingButton-active');

			if (currentTarget !== sortingButtonActive) {
				sortingButtonActive.classList.remove('searchResults_facets_sortingButton-active');
			}

			component.sortAlphabet(whichSort);
		};

		component.cards = function() {
			return component.element.querySelectorAll('.searchResults_card');
		};

		component.sortAlphabet = function(whichSort) {
			
			const whichSortDataAttr = whichSort;
			let sortingArr = [];
			let isNumber = false;
			component.cards().forEach(function(cards) {
				const dataAttr = cards.dataset[whichSortDataAttr];
				isNumber = /\d/.test(dataAttr);
				const newNumbers = isNumber ? Number(dataAttr) : dataAttr;	
				sortingArr.push(newNumbers);
			});

			if (isNumber) {
				sortingArr.sort(function(a, b){return a-b});
			} else {
				sortingArr.sort();
			}

			const orderedAttr = [];
			sortingArr.forEach(function(sorting){
				orderedAttr.push(sorting);
			})

			component.renderNewOrder(orderedAttr, whichSortDataAttr);
		};

		component.renderNewOrder = function(orderedAttr, whichSortDataAttr) {
			const reformDataAttr = `data-${whichSortDataAttr}`;
			let htmlElements = '';
			Array.from(orderedAttr).forEach(function(element) {
				const orderEl = component.element.querySelector(`[${reformDataAttr}="${element}"]`).outerHTML;
				htmlElements+=orderEl;
			});

			component.cardContainer.innerHTML = htmlElements;
			component.init();
		};

		component.filterResults = function() {
			const name = this.name;
			const value = this.value;

			if (this.checked) {
				component.selectedFilters.push([name, value]);
			} else {
				component.selectedFilters.pop([name, value]);
			}

			component.cards().forEach(function(el) {
				if (component.selectedFilters.length > 0) {
					el.style.display = 'none';
				} else {
					el.style.display = 'block';
				}
			});

			component.selectedFilters.forEach(function(element) {
				const nameAttr = `[data-${element[0]}="${element[1]}"]`;
				const filterEl = component.element.querySelector(nameAttr);
				filterEl.style.display = 'block';
			});
		};

		return component;
	};

	const newSearch = new SearchResults();
	newSearch.init();

