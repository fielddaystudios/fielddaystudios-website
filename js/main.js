/* ============================================================
 * Field Day Studios — Site Behavior
 * Mobile nav and the Formspree-backed contact form.
 * ============================================================ */

(function () {
  "use strict";

  var BOOKING_URL = "https://calendar.app.google/etYNPgW43TUqo76j8";

  /* ---------- Mobile nav ---------- */

  var nav = document.getElementById("site-nav");
  var navToggle = document.querySelector(".nav-toggle");

  function setNavOpen(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    // Close the menu when any nav link is chosen.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNavOpen(false);
    });
  }

  /* ---------- Stories (unpublished) ----------
   * The Stories section, its password gate, and the card toggles are
   * archived outside this repo until client approval. Their JS blocks
   * get re-inserted here when the section is restored.
   */

  /* ---------- Book a Call ---------- */

  var bookButton = document.querySelector("[data-book]");
  if (bookButton) {
    bookButton.addEventListener("click", function () {
      window.open(BOOKING_URL, "_blank", "noopener");
    });
  }

  /* ---------- Contact form ---------- */

  var contactForm = document.querySelector("[data-contact-form]");
  var contactSuccess = document.querySelector("[data-contact-success]");
  var contactError = document.querySelector("[data-contact-error]");
  var emailUsButton = document.querySelector("[data-toggle-contact]");

  // Mirrors the design reference's state model:
  // the form renders when (open && !submitted); the success card when submitted.
  var contactState = { open: false, submitted: false };

  function renderContact() {
    if (!contactForm) return;
    contactForm.hidden = !(contactState.open && !contactState.submitted);
    contactSuccess.hidden = !contactState.submitted;
  }

  function openContactForm() {
    contactState.open = true;
    contactState.submitted = false;
    renderContact();
  }

  function toggleContactForm() {
    contactState.open = !contactState.open;
    renderContact();
  }

  if (emailUsButton) {
    emailUsButton.addEventListener("click", toggleContactForm);
  }

  // "Get in Touch" CTAs scroll to #contact (via href) AND open the form.
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-open-contact]"),
    function (cta) {
      cta.addEventListener("click", openContactForm);
    }
  );

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactError.hidden = true;

      // Native `required` handles empty fields; this is a JS guard on top.
      var requiredFields = ["name", "company", "email", "message"];
      var missing = requiredFields.some(function (fieldName) {
        var field = contactForm.elements[fieldName];
        return !field || !field.value.trim();
      });
      if (missing) return;

      fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      })
        .then(function (res) {
          if (res.ok) {
            contactState.submitted = true;
            renderContact();
            contactForm.reset();
          } else {
            contactError.hidden = false;
          }
        })
        .catch(function () {
          contactError.hidden = false;
        });
    });
  }
})();
