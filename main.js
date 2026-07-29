"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];

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

  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (form && formStatus) {
    const validationMessages = {
      name: "請輸入至少 2 個字的姓名。",
      email: "請輸入有效的 Email 格式。",
      subject: "請輸入至少 3 個字的聯絡主旨。",
      message: "請輸入至少 10 個字的留言內容。"
    };

    function validateField(field) {
      const wrapper = field.closest(".field");
      const error = wrapper?.querySelector(".error");
      const value = field.value.trim();
      let valid = field.checkValidity();

      if (field.type === "email" && value) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      if (wrapper) wrapper.classList.toggle("invalid", !valid);
      field.setAttribute("aria-invalid", String(!valid));
      if (error) error.textContent = valid ? "" : validationMessages[field.name] ?? "請檢查此欄位。";

      return valid;
    }

    const fields = [...form.querySelectorAll("input, textarea")];

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".field")?.classList.contains("invalid")) validateField(field);
        formStatus.textContent = "";
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const results = fields.map(validateField);
      if (results.includes(false)) {
        formStatus.textContent = "請先完成標示的必填欄位。";
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      formStatus.textContent = "表單驗證完成！目前為示範模式，訊息尚未實際送出。";
      form.reset();
      fields.forEach((field) => field.setAttribute("aria-invalid", "false"));
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
