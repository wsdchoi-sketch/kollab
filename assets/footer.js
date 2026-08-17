(function () {

	const footer = () => {

		/* Footer accordion */
		const footerDetails = document.querySelectorAll(
			'.footer .accordion details'
		);

		footerDetails.forEach((targetDetail) => {
			targetDetail.addEventListener('click', () => {
				footerDetails.forEach((detail) => {
					if (detail !== targetDetail) {
						detail.removeAttribute('open');
					}
				});
			});
		});

		/* Move Instagram feed */
		const feed = document.querySelector('#vitals-instagram-feed');
		const target = document.querySelector('.footer-block #contact_form');

		if (feed && target) {
			target.after(feed);
		}

	};

	document.addEventListener('shopify:section:load', footer);

	footer();

})();