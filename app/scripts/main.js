	var SearchResults = function() {

		var component = {}


		component.init = function() {
			component.elements();
			component.setupClickEvents();
		};

		component.elements = function() {
			component.accordionHeader = document.querySelectorAll('.searchResults_cardAccordionHeader');
			component.sortingButtons = document.querySelectorAll('.searchResults_facets_sortingButton');
			component.cardContainer = document.querySelector('.searchResults_cardContainer');
		};

		component.setupClickEvents = function() {
			Array.from(component.accordionHeader).forEach(function(el) {
				el.addEventListener('click', component.openAccordions);
			})

			Array.from(component.sortingButtons).forEach(function(el) {
				el.addEventListener('click', component.sortResults);
			});
		};

		component.openAccordions = function(e) {
			e.preventDefault();
			var currentTarget = e.currentTarget.parentElement;
			var accordionContent = currentTarget.querySelector('.searchResults_cardAccordionContent');
			var hasClass = currentTarget.classList.contains('searchResults_cardAccordion-open');

			currentTarget.classList.toggle('searchResults_cardAccordion-open');

			if(!hasClass) {
				accordionContent.setAttribute('aria-hidden', 'false');
				e.currentTarget.setAttribute('aria-expanded', 'true');
			} else {
				accordionContent.setAttribute('aria-hidden', 'true');
				e.currentTarget.setAttribute('aria-expanded', 'false');
			}
		}

		component.sortResults = function(e) {
			e.preventDefault();

			var currentTarget = e.currentTarget;
			var whichSort = currentTarget.getAttribute('data-sort');

			console.log(whichSort);

			component.sortAlphabet(whichSort)
		}

		component.sortAlphabet = function(whichSort) {
			component.cards = document.querySelectorAll('.searchResults_card');
			var whichSortDataAttr = 'data-' + whichSort;
			var sortingArr = [];
			Array.from(component.cards).forEach(function(cards) {
				var dataAttr = cards.getAttribute(whichSortDataAttr);
				var isNumber = /\d/.test(dataAttr);
				var newNumbers = isNumber ? Number(dataAttr) : dataAttr;	
				sortingArr.push(newNumbers);
			});

			if (whichSort == 'price' || whichSort == 'star') {
				sortingArr.sort(function(a, b){return a-b});
			} else {
			 	sortingArr.sort();
			}

			var orderedAttr = [];
			Array.from(sortingArr).forEach(function(sorting){
				orderedAttr.push(sorting);
			})

			component.renderNewOrder(orderedAttr, whichSortDataAttr);
		};

		component.renderNewOrder = function(orderedAttr, whichSortDataAttr) {
			var reformDataAttr = whichSortDataAttr + '=';
			var htmlElements = [];
			Array.from(orderedAttr).forEach(function(element) {
				var orderEl = document.querySelector('['+ reformDataAttr + '"'+ element + '"'+ ']').outerHTML;
				htmlElements.push(orderEl);
			});

			component.cardContainer.innerHTML = htmlElements;
			component.init();
		};

		return component;
	};

var newSearch = new SearchResults();
newSearch.init();

