"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const sideSectionLinks = [...document.querySelectorAll('.side-quick-link[data-section]')];

  // 行動版導覽：同步更新視覺狀態與輔助科技可讀狀態。
  function setMenu(open) {
    if (!navToggle || !navMenu) return;

    navToggle.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);

    const srLabel = navToggle.querySelector(".sr-only");
    if (srLabel) srLabel.textContent = open ? "關閉導覽選單" : "開啟導覽選單";
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) setMenu(false);
    });
  }

  function updateHeader() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // 以目前可見區塊提示使用者所在位置。
  const observedSections = [...document.querySelectorAll("main section[id]")];

  if ("IntersectionObserver" in window && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", active);

            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });

          sideSectionLinks.forEach((link) => {
            const active = link.dataset.section === entry.target.id;
            link.classList.toggle("active", active);

            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-35% 0px -55%", threshold: 0 }
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  document.querySelectorAll(".case-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const detailId = button.getAttribute("aria-controls");
      const detail = detailId ? document.getElementById(detailId) : null;
      const label = button.querySelector(".case-toggle-label");
      const icon = button.querySelector(".case-toggle-icon");

      if (!detail) return;

      const expanded = button.getAttribute("aria-expanded") === "true";
      const nextExpanded = !expanded;

      button.setAttribute("aria-expanded", String(nextExpanded));
      detail.classList.toggle("open", nextExpanded);

      if (label) label.textContent = nextExpanded ? "收起完整教案" : "查看完整教案";
      if (icon) icon.textContent = nextExpanded ? "−" : "＋";
    });
  });

  const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const submitButton = contactForm?.querySelector(".submit-button");

/*
 * 將下方網址改成 Apps Script 部署後的 /exec 網址。
 */
const CONTACT_API_URL =
  "https://script.google.com/macros/s/AKfycbzOVB2aeG3mhlvq_Qnwx-U-3CJL1PwR_YBou_G5HzpZih3NUIMZSYl-OwZzL0WWYSAY/exec";

if (contactForm && formStatus && submitButton) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    formStatus.textContent = "";

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const originalButtonContent = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML =
      '傳送中 <span aria-hidden="true">…</span>';

    formStatus.textContent = "正在傳送訊息，請稍候。";

    try {
      const formData = new FormData(contactForm);
      const requestBody = new URLSearchParams(formData);

      /*
       * Apps Script 與網站屬於不同網域，
       * 使用 no-cors 避免瀏覽器阻擋跨網域請求。
       */
      await fetch(CONTACT_API_URL, {
        method: "POST",
        mode: "no-cors",
        body: requestBody
      });

      contactForm.reset();

      formStatus.textContent =
        "訊息已成功送出，我會盡快與你聯絡。";
    } catch (error) {
      console.error("聯絡表單傳送失敗：", error);

      formStatus.textContent =
        "訊息傳送失敗，請稍後再試。";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonContent;
    }
  });
}

  const backToTop = document.getElementById("back-to-top");

  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("show", window.scrollY > 480);
  }

  if (backToTop) {
    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
