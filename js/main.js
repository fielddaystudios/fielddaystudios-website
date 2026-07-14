/* ============================================================
 * Field Day Studios — Site Behavior
 * Mobile nav (with focus trap), story card toggles, and the
 * Formspree-backed contact form.
 * ============================================================ */

(function () {
  "use strict";

  // Report a Google Analytics event if the GA tag loaded (never breaks
  // the site if it didn't, e.g. when an ad blocker removes gtag).
  function track(eventName, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
  }

  /* ---------- Mobile nav ---------- */

  var nav = document.getElementById("site-nav");
  var navToggle = document.querySelector(".nav-toggle");

  function setNavOpen(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  function getNavFocusables() {
    return Array.prototype.slice.call(
      nav.querySelectorAll("a[href], button:not([disabled])")
    );
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      var opening = !nav.classList.contains("is-open");
      setNavOpen(opening);
      if (opening) {
        var focusables = getNavFocusables();
        if (focusables[0]) focusables[0].focus();
      }
    });

    // Close the menu when any nav link is chosen.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNavOpen(false);
    });

    // While the mobile menu is open: trap Tab inside it; Escape closes
    // the menu and returns focus to the toggle button.
    nav.addEventListener("keydown", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setNavOpen(false);
        navToggle.focus();
        return;
      }
      if (e.key !== "Tab") return;
      var focusables = getNavFocusables();
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------- Story card toggles (one open at a time) ---------- */

  var storyToggles = Array.prototype.slice.call(
    document.querySelectorAll("[data-story-toggle]")
  );

  function setStoryOpen(toggle, open) {
    var story = toggle.closest(".story");
    var full = story.querySelector("[data-story-full]");
    var label = toggle.querySelector("[data-story-label]");
    var sign = toggle.querySelector("[data-story-sign]");

    toggle.setAttribute("aria-expanded", String(open));
    full.hidden = !open;
    label.textContent = open ? "Hide story" : "Read the full story";
    sign.textContent = open ? "\u2212" : "+";
  }

  storyToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      storyToggles.forEach(function (other) {
        setStoryOpen(other, other === toggle ? !isOpen : false);
      });
      if (!isOpen) {
        var sector = toggle.closest(".story").querySelector(".story__sector");
        track("story_open", { story: sector ? sector.textContent : "unknown" });
      }
    });
  });

  /* "Book a Call" is a plain anchor (target=_blank) — no JS needed for
     navigation; scripted window.open gets popup-blocked on iOS Safari.
     The click listener below only reports the analytics event. */

  var bookLink = document.querySelector("[data-book]");
  if (bookLink) {
    bookLink.addEventListener("click", function () {
      track("book_call_click");
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
            track("contact_form_submit");
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
