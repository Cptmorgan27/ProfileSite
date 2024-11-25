/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}


	// Main Sections: Two

			// Get the video modal
			var modal = document.getElementById("videoModal");

			// Get the <span> element that closes the modal
			var span = document.getElementsByClassName("close")[0];
	  
			// Get the video player and source elements
			var videoPlayer = document.getElementById("videoPlayer");
			var videoSource = document.getElementById("videoSource");
	  
			// When the user clicks on an <a> tag with data-video-src, open the modal and play the video
			document.querySelectorAll("a[data-video-src]").forEach((anchor) => {
			  anchor.addEventListener("click", function (event) {
				event.preventDefault(); // Prevent the default link behavior
				var videoSrc = this.getAttribute("data-video-src");
				videoSource.src = videoSrc;
				videoPlayer.load();
				modal.style.display = "block";
			  });
			});
	  
			// When the user clicks on <span> (x), close the modal
			span.onclick = function () {
			  modal.style.display = "none";
			  videoPlayer.pause();
			};
	  
			// When the user clicks anywhere outside of the modal, close it
			window.onclick = function (event) {
			  if (event.target == modal) {
				modal.style.display = "none";
				videoPlayer.pause();
			  }
			};

})(jQuery);