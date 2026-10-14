"use strict";

/* =========================================================
   LOCALBOOST AI — SHARED FRONTEND SCRIPT
========================================================= */

/* -------------------------
   Mobile navigation
------------------------- */

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

/* -------------------------
   Home-page slider
------------------------- */

const slides = document.querySelectorAll(".slide");
const previousSlideButton = document.getElementById("previousSlide");
const nextSlideButton = document.getElementById("nextSlide");
let currentSlide = 0;

function showSlide(index) {
  if (!slides.length) return;

  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

if (slides.length && previousSlideButton && nextSlideButton) {
  previousSlideButton.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });

  nextSlideButton.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });
}

/* -------------------------
   Scroll reveal
------------------------- */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

/* -------------------------
   Home-page typewriter
------------------------- */

const typewriterText = document.getElementById("typewriterText");

if (typewriterText) {
  const fullText = typewriterText.textContent.trim();
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    typewriterText.textContent = fullText;
    typewriterText.classList.add("typewriter-done");
  } else {
    typewriterText.textContent = "";
    let characterIndex = 0;

    function typeNextCharacter() {
      if (characterIndex < fullText.length) {
        typewriterText.textContent += fullText.charAt(characterIndex);
        characterIndex += 1;
        window.setTimeout(typeNextCharacter, 45);
      } else {
        typewriterText.classList.add("typewriter-done");
      }
    }

    window.setTimeout(typeNextCharacter, 400);
  }
}

/* -------------------------
   Home-page in-place style picker and chat transition
------------------------- */

const homeStyleButtons = Array.from(
  document.querySelectorAll("[data-home-style]")
);
const homePromptForm = document.getElementById("homePromptForm");
const homePrompt = document.getElementById("homePrompt");
const stylePicker = document.getElementById("stylePicker");
const homeChat = document.getElementById("homeChat");
const homeBackButton = document.getElementById("homeBack");
const homeChatTitle = document.getElementById("chat-title");
const homeChatMessages = document.getElementById("homeChatMessages");
const homeChatForm = document.getElementById("homeChatForm");
const homeChatInput = document.getElementById("homeChatInput");

if (
  homeStyleButtons.length &&
  homePromptForm &&
  homePrompt &&
  stylePicker &&
  homeChat &&
  homeBackButton &&
  homeChatTitle &&
  homeChatMessages &&
  homeChatForm &&
  homeChatInput
) {
  let selectedHomeStyle =
    homeStyleButtons.find((button) => button.getAttribute("aria-pressed") === "true") ||
    homeStyleButtons[0];

  function getSelectedStyleName() {
    return selectedHomeStyle.querySelector("strong").textContent.trim();
  }

  function appendHomeMessage(message, isUser) {
    const messageElement = document.createElement("p");
    messageElement.className = isUser
      ? "jarvis-message is-user"
      : "jarvis-message";
    messageElement.textContent = message;
    homeChatMessages.append(messageElement);
  }

  homeStyleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      homeStyleButtons.forEach((option) => {
        const isSelected = option === button;
        option.classList.toggle("is-selected", isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
      });
      selectedHomeStyle = button;
    });
  });

  document.querySelectorAll("[data-prompt]").forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      homePrompt.value = suggestion.dataset.prompt;
      homePrompt.focus();
    });
  });

  homePromptForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const prompt = homePrompt.value.trim();
    const styleName = getSelectedStyleName();

    homeChatTitle.textContent = `${styleName} interface selected.`;
    homeChatMessages.replaceChildren();
    appendHomeMessage(
      prompt || `Mujhe ${styleName} interface dikhayein.`,
      true
    );
    appendHomeMessage(
      `Aapka ${styleName} preview isi page par hai. Yeh demo hai; live AI responses abhi connected nahi hain.`,
      false
    );

    stylePicker.hidden = true;
    stylePicker.classList.remove("is-active");
    homeChat.hidden = false;
    homeChat.classList.remove("is-active");
    window.requestAnimationFrame(() => homeChat.classList.add("is-active"));
    homeChatInput.value = "";
    homeChatInput.focus({ preventScroll: true });
  });

  homeChatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = homeChatInput.value.trim();

    if (!message) return;

    appendHomeMessage(message, true);
    appendHomeMessage(
      "Yeh in-page demo hai, isliye abhi live AI response generate nahi hota.",
      false
    );
    homeChatInput.value = "";
    homeChatInput.focus();
    homeChatMessages.scrollTop = homeChatMessages.scrollHeight;
  });

  homeBackButton.addEventListener("click", () => {
    homeChat.hidden = true;
    homeChat.classList.remove("is-active");
    stylePicker.hidden = false;
    stylePicker.classList.remove("is-active");
    window.requestAnimationFrame(() => stylePicker.classList.add("is-active"));
    selectedHomeStyle.focus({ preventScroll: true });
  });
}

/* -------------------------
   URL preselection
   - ?category=gym selects Gym
   - ?plan=starter selects Starter
------------------------- */

const urlParams = new URLSearchParams(window.location.search);

const categorySelect = document.getElementById("category");

if (categorySelect && urlParams.get("category") === "gym") {
  categorySelect.value = "Gym / Fitness / Yoga";
}

const requestedPlanHidden = document.getElementById("requestedPlanHidden");
const requestedPlanSelect = document.getElementById("requestedPlan");
const planFromUrl = urlParams.get("plan");
const allowedPlans = ["free", "starter", "growth"];

if (planFromUrl && allowedPlans.includes(planFromUrl)) {
  if (requestedPlanHidden) {
    requestedPlanHidden.value = planFromUrl;
  }

  if (requestedPlanSelect) {
    requestedPlanSelect.value = planFromUrl;
  }
}

/* =========================================================
   GENERATOR MULTI-STEP FORM
   Requires [data-form-step="1"], [data-form-step="2"],
   [data-form-step="3"] in generator.html.
========================================================= */

const generatorForm = document.getElementById("generatorForm");
const formSteps = Array.from(
  document.querySelectorAll("[data-form-step]")
);
const progressSteps = Array.from(
  document.querySelectorAll("[data-progress-step]")
);
const progressTrackFill = document.getElementById("progressTrackFill");
const progressTrackFillTwo = document.getElementById("progressTrackFillTwo");
const submitButton = document.getElementById("submitButton");
const formResponse = document.getElementById("formResponse");

let currentFormStep = 1;

function updateFormProgress(stepNumber) {
  progressSteps.forEach((item) => {
    const itemNumber = Number(item.dataset.progressStep);

    item.classList.toggle("active", itemNumber === stepNumber);
    item.classList.toggle("completed", itemNumber < stepNumber);
  });

  if (progressTrackFill) {
    progressTrackFill.style.width = stepNumber >= 2 ? "100%" : "0%";
  }

  if (progressTrackFillTwo) {
    progressTrackFillTwo.style.width = stepNumber >= 3 ? "100%" : "0%";
  }
}

function getFormStep(stepNumber) {
  return document.querySelector(`[data-form-step="${stepNumber}"]`);
}

function showFormStep(stepNumber, direction = "next") {
  const currentElement = getFormStep(currentFormStep);
  const nextElement = getFormStep(stepNumber);

  if (!nextElement) return;

  if (currentElement && currentElement !== nextElement) {
    currentElement.hidden = true;
    currentElement.classList.remove(
      "active",
      "leaving-next",
      "leaving-back"
    );
  }

  nextElement.hidden = false;
  nextElement.classList.remove("leaving-next", "leaving-back");
  nextElement.classList.add("active");

  currentFormStep = stepNumber;
  updateFormProgress(stepNumber);

  const firstField = nextElement.querySelector(
    'input:not([type="hidden"]), select, textarea'
  );

  if (firstField) {
    window.setTimeout(() => {
      firstField.focus({ preventScroll: true });
    }, 180);
  }
}

function validateVisibleStep() {
  const currentElement = getFormStep(currentFormStep);

  if (!currentElement) return true;

  const fields = currentElement.querySelectorAll(
    "input, select, textarea"
  );

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus();
      return false;
    }
  }

  return true;
}

document.querySelectorAll(".step-next").forEach((button) => {
  button.addEventListener("click", () => {
    if (!validateVisibleStep()) return;
    if (currentFormStep >= formSteps.length) return;

    const currentElement = getFormStep(currentFormStep);

    if (currentElement) {
      currentElement.classList.add("leaving-next");
    }

    const nextStep = currentFormStep + 1;

    window.setTimeout(() => {
      showFormStep(nextStep, "next");
    }, 180);
  });
});

document.querySelectorAll(".step-back").forEach((button) => {
  button.addEventListener("click", () => {
    if (currentFormStep <= 1) return;

    const currentElement = getFormStep(currentFormStep);

    if (currentElement) {
      currentElement.classList.add("leaving-back");
    }

    const previousStep = currentFormStep - 1;

    window.setTimeout(() => {
      showFormStep(previousStep, "back");
    }, 180);
  });
});

function setSubmitState(state, label) {
  if (!submitButton) return;

  const labelElement = submitButton.querySelector(".submit-button-label");

  submitButton.classList.remove("is-loading", "is-success", "is-error");

  if (state) {
    submitButton.classList.add(state);
  }

  if (labelElement && label) {
    labelElement.textContent = label;
  }

  submitButton.disabled = state === "is-loading" || state === "is-success";
}

function showFormResponse(message, isError = false) {
  if (!formResponse) return;

  formResponse.hidden = false;
  formResponse.textContent = message;
  formResponse.classList.toggle("error", isError);
}

if (generatorForm) {
  updateFormProgress(1);

  generatorForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateVisibleStep()) return;

    if (!generatorForm.checkValidity()) {
      const invalidField = generatorForm.querySelector(":invalid");
      const invalidStep = invalidField
        ? invalidField.closest("[data-form-step]")
        : null;

      if (invalidField && invalidStep) {
        const invalidStepNumber = Number(invalidStep.dataset.formStep);

        showFormStep(invalidStepNumber, "back");

        window.setTimeout(() => {
          invalidField.reportValidity();
          invalidField.focus();
        }, 200);
      } else {
        generatorForm.reportValidity();
      }

      return;
    }

    if (formResponse) {
      formResponse.hidden = true;
      formResponse.classList.remove("error");
      formResponse.textContent = "";
    }

    setSubmitState("is-loading", "Sending request…");

    try {
      const response = await fetch(generatorForm.action, {
        method: "POST",
        body: new FormData(generatorForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Formspree submission failed.");
      }

     setSubmitState("is-success", "Request received ✓");

window.setTimeout(function () {
  window.location.href = "thank-you.html";
}, 500);

      generatorForm.reset();

      // Keep the Gym category selected if the visitor came from the Gym page.
      if (categorySelect && urlParams.get("category") === "gym") {
        categorySelect.value = "Gym / Fitness / Yoga";
      }

      // Keep the selected plan after clearing the rest of the form.
      if (requestedPlanHidden && planFromUrl && allowedPlans.includes(planFromUrl)) {
        requestedPlanHidden.value = planFromUrl;
      }

      currentFormStep = 1;

      formSteps.forEach((step, index) => {
        step.hidden = index !== 0;
        step.classList.toggle("active", index === 0);
        step.classList.remove("leaving-next", "leaving-back");
      });

      updateFormProgress(1);
    } catch (error) {
      setSubmitState("is-error", "Could not send — try again");
      showFormResponse(
        "We could not confirm your submission. Check your internet connection and try again.",
        true
      );

      window.setTimeout(() => {
        setSubmitState("", "Submit plan request →");
      }, 2200);
    }
  });
}


 