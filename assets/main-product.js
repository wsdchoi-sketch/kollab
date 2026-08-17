(function () {
	const initProductAccordion = () => {
		$(".about__accordion-toggle").click(function () {
			if (!$(this).hasClass("active")) {
				$(this).addClass("active");
				$(this)
					.siblings(".about__accordion-description")
					.eq($(this).index())
					.stop()
					.slideDown(300);
			} else {
				$(this).removeClass("active");
				$(this).siblings(".about__accordion-description").stop().slideUp(300);
			}
		});
	};

	const initZoomImage = () => {
		const imagesWrapper = document.querySelector(
			".product-media-modal__content"
		);
		const images = imagesWrapper.querySelectorAll(".js-image-zoom");

		images.forEach((el) => {
			el.addEventListener("click", (e) => {
				imagesWrapper.classList.toggle("zoom");
			});
		});
	};
	const revealPopup = (section = document) => {
		const stickyBar = section.querySelector(".product__popup") || document.querySelector(".product__popup");
		const secondSection =
			section.querySelector(".product-section + section") ||
			section.querySelector(".product-section + .shopify-section") ||
			document.querySelector(".product-section + section") ||
			document.querySelector(".product-section + .shopify-section");
		const footer = document.querySelector("footer");

		// Skip if elements are missing
		if (!stickyBar || !secondSection || !footer) {
			console.warn("Required elements not found, skipping revealPopup");
			return;
		}

		const getOffset = (element) => {
			const rect = element.getBoundingClientRect();
			return rect.top + window.scrollY;
		};

		const secondSectionMid = getOffset(secondSection);
		const footerTop = getOffset(footer);

		const handleScroll = () => {
			const scrollPosition = window.scrollY + window.innerHeight;
			const activeOffset = window.scrollY > secondSectionMid && scrollPosition < footerTop;
			stickyBar.classList[activeOffset ? "add" : "remove"]("active");
		};

		// Initial check in case the user starts in the middle of the page
		handleScroll();

		// Listen to scroll
		window.addEventListener("scroll", handleScroll);
		};

		// Run on DOMContentLoaded
		document.addEventListener("DOMContentLoaded", () => {
		revealPopup();
		});

		// Run on Shopify section load (dynamic sections)
		document.addEventListener("shopify:section:load", (event) => {
		revealPopup(event.target);
	});

	document.addEventListener("scroll", () => revealPopup());

	document.addEventListener("shopify:section:load", function () {
		initProductAccordion();
		initZoomImage();
		revealPopup();
	});

	initProductAccordion();
	initZoomImage();
	revealPopup();
})();

class FloatedForm extends HTMLElement {
	constructor() {
		super();
		this.renderForm();
	}

	renderForm() {
		fetch(this.getAttribute("data-product-url"))
			.then((response) => response.text())
			.then((responseText) => {
				const responseHTML = new DOMParser().parseFromString(
					responseText,
					"text/html"
				);
				this.productElement = responseHTML.querySelector(
					'div[id^="ProductInfo-"]'
				);

				this.preventDuplicatedIDs();
				this.removeDOMElements();
				this.setInnerHTML(this, this.productElement.innerHTML);

				if (window.Shopify && Shopify.PaymentButton) {
					Shopify.PaymentButton.init();
				}

				if (window.ProductModel) window.ProductModel.loadShopifyXR();

				this.showMoreFields();
			})
			.finally(() => {
				const popupForm = document.querySelector(".product__popup");

				if (popupForm) {
					const radiosBlocks = popupForm.querySelectorAll("variant-radios");

					radiosBlocks.forEach((radiosBlock) => {
						const fieldsets = radiosBlock.querySelectorAll(
							".product-form__input--radios"
						);

						fieldsets.forEach((fieldset) => {
							fieldset.classList.remove("product-form__input--radios");
							fieldset.classList.add(
								"product-form__input--dropdown",
								"product-form__controls--dropdown"
							);

							const legend = fieldset.querySelector("legend");
							const groupName = legend ? legend.textContent.trim() : "";

							const dropdownSelect = document.createElement("div");
							dropdownSelect.className = "select dropdown-select";
							dropdownSelect.innerHTML = `
								<div class="select-label" tabindex="0" role="button" aria-haspopup="listbox" aria-expanded="false">
									${groupName}: <span></span>
								</div>
								<ul class="product-form__controls-group" role="listbox" style="display:none;"></ul>
								<svg
									width="22"
									height="22"
									viewBox="0 0 22 22"
									fill="none"
									class="icon icon-arrow-small"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M11 14.1166L5.5 8.61659L6.78333 7.33325L11 11.5499L15.2167 7.33325L16.5 8.61659L11 14.1166Z" fill="currentColor"/>
								</svg>

								${
									document.querySelector(".icon-arrow-small")
										? document.querySelector(".icon-arrow-small").outerHTML
										: ""
								}
							`;

							const optionsList = dropdownSelect.querySelector("ul");
							const selectLabel = dropdownSelect.querySelector(".select-label");
							const selectedSpan = selectLabel.querySelector("span");

							const options = fieldset.querySelectorAll('input[type="radio"]');

							options.forEach((input) => {
								const label = fieldset.querySelector(
									`label[for="${input.id}"]`
								);

								if (!label) return;

								label
									.querySelectorAll(".visually-hidden")
									.forEach((span) => span.remove());

								label.childNodes.forEach((node) => {
									if (
										node.nodeType === 3 &&
										node.textContent.includes("Variant sold out or unavailable")
									) {
										node.remove();
									}
								});

								const li = document.createElement("li");
								li.setAttribute("role", "option");

								li.appendChild(input);
								li.appendChild(label);
								optionsList.appendChild(li);
							});

							if (legend) legend.remove();

							fieldset.appendChild(dropdownSelect);

							const updateSelected = () => {
								const checkedRadio = optionsList.querySelector(
									'input[type="radio"]:checked'
								);
								if (checkedRadio) {
									const label = optionsList.querySelector(
										`label[for="${checkedRadio.id}"]`
									);
									selectedSpan.textContent = label
										? label.textContent.trim()
										: checkedRadio.value;
									selectedSpan.setAttribute("title", selectedSpan.textContent);
								} else {
									selectedSpan.textContent = "Select";
									selectedSpan.removeAttribute("title");
								}
							};
							updateSelected();

							selectLabel.addEventListener("click", (e) => {
								const isExpanded =
									selectLabel.getAttribute("aria-expanded") === "true";
								if (isExpanded) {
									optionsList.style.display = "none";
									selectLabel.setAttribute("aria-expanded", "false");
								} else {
									optionsList.style.display = "block";
									selectLabel.setAttribute("aria-expanded", "true");
									e.stopPropagation();
								}
							});

							optionsList.addEventListener("click", (e) => {
								const li = e.target.closest("li");
								if (!li) return;

								const input = li.querySelector('input[type="radio"]');
								if (input) {
									input.checked = true;
									input.dispatchEvent(new Event("change", { bubbles: true }));
								}
							});

							optionsList.addEventListener("change", (e) => {
								if (e.target && e.target.matches('input[type="radio"]')) {
									updateSelected();
									optionsList.style.display = "none";
									selectLabel.setAttribute("aria-expanded", "false");
									document.activeElement.blur();
								}
							});

							document.addEventListener("click", (e) => {
								if (!dropdownSelect.contains(e.target)) {
									optionsList.style.display = "none";
									selectLabel.setAttribute("aria-expanded", "false");
								}
							});

							selectLabel.addEventListener("keydown", (e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									selectLabel.click();
								}
							});
						});
					});
				}
				this.showMoreFields();
				const selectDropDown = () => {
					$(".product__popup .product-form__controls--dropdown").each(
						function () {
							const elListItem = $(this).find(".dropdown-select ul li");
							const elItem = $(this).find(".dropdown-select ul");
							const selectedText = $(this).find(
								".dropdown-select .select-label"
							);

							selectedText.on("click", function (e) {
								elItem.toggleClass("active");
								if (elItem.hasClass("active")) {
									e.stopPropagation();
									$(document).click(function () {
										elItem.removeClass("active");
									});
								}
							});

							elListItem.on("click", function () {
								selectedText
									.find("span")
									.text($(this).text())
									.attr("title", $(this).text());
								elItem.removeClass("active");
								document.activeElement.blur();
							});
						}
					);
				};

				selectDropDown();
			});
	}

	setInnerHTML(element, html) {
		element.innerHTML = html;

		// Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
		element.querySelectorAll("script").forEach((oldScriptTag) => {
			const newScriptTag = document.createElement("script");
			Array.from(oldScriptTag.attributes).forEach((attribute) => {
				newScriptTag.setAttribute(attribute.name, attribute.value);
			});
			newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
			oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
		});
	}

	preventDuplicatedIDs() {
		const sectionId = this.productElement.dataset.section;
		this.productElement.innerHTML = this.productElement.innerHTML.replaceAll(
			sectionId,
			`floated-${sectionId}`
		);

		if (this.productElement.querySelectorAll("variant-selects")) {
			this.productElement
				.querySelectorAll("variant-selects")
				.forEach((radio) => {
					radio.dataset.originalSection = sectionId;
				});
		}

		if (this.productElement.querySelectorAll("variant-radios")) {
			this.productElement
				.querySelectorAll("variant-radios")
				.forEach((radio) => {
					radio.dataset.originalSection = sectionId;
				});
		}
	}

	removeDOMElements() {
		const text = this.productElement.querySelector(".product__text");
		if (text) text.remove();

		this.productElement
			.querySelectorAll(".product-about")
			.forEach((el) => el.remove());

		this.productElement
			.querySelectorAll(".custom-liquid")
			.forEach((el) => el.remove());

		const tags = this.productElement.querySelector(".product__tags");
		if (tags) tags.remove();

		const title = this.productElement.querySelector(".product__title__wrapper");
		if (title) title.remove();

		const badges = this.productElement.querySelector(".product__custom-badges");
		if (badges) badges.remove();

		const price = this.productElement.querySelector(".price-wrapper");
		if (price) price.remove();

		const description = this.productElement.querySelector(
			".main-product-description-block"
		);
		if (description) description.remove();

		const sku = this.productElement.querySelector(".product__sku");
		if (sku) sku.remove();

		const inventory = this.productElement.querySelector(
			".inventory product__inventory"
		);
		if (inventory) inventory.remove();

		const pickupAvailability = this.productElement.querySelector(
			"pickup-availability"
		);
		if (pickupAvailability) pickupAvailability.remove();

		const customLiquid = this.productElement.querySelector(".custom-liquid");
		if (customLiquid) customLiquid.remove();

		const complementary = this.productElement.querySelector(
			"product-recommendations--single"
		);
		if (complementary) complementary.remove();

		const shareButtons = this.productElement.querySelector(".share-buttons");
		if (shareButtons) shareButtons.remove();

		const productModal = this.productElement.querySelectorAll(".product-popup");
		productModal.forEach((advantage) => {
			advantage.remove();
		});

		const productForm = this.productElement.querySelector("floated-form");
		if (productForm) productForm.remove();
	}

	showMoreFields() {
		$(".js-show-more").click(function (e) {
			e.preventDefault();
			$(this).siblings("input").removeClass("hidden");
			$(this).siblings("label").removeClass("hidden");
			$(this).remove();
		});
	}
}

customElements.define("floated-form", FloatedForm);


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.product-about').forEach(function (about) {
    const description = about.querySelector('.product-about__accordion-description');

    if (description && description.textContent.trim() === '') {
      description.textContent = 'No details available';
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Select .product-about-5
  const target = document.querySelector('.product-about-5');
  if (!target) return;

  // Add optional class to the container
  target.classList.add('highlight'); // optional, you can skip this

  // Add "active" to the accordion title
  const title = target.querySelector('.product-about__accordion-title');
  if (title) {
    title.classList.add('active');
  }

  // Display the accordion description
  const description = target.querySelector('.product-about__accordion-description');
  if (description) {
    description.style.display = 'block';
  }
});