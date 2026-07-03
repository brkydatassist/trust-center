/* ============================================================
   Datassist Trust Center — App
   İçerik config/{locale}.json dosyalarından yüklenir.
   Yeni section eklemek için: ilgili json'a bir obje ekleyip
   burada renderers[type] fonksiyonunu tanımlamanız yeterli.
   ============================================================ */
(function () {
  "use strict";

  var SITE = null;
  var DATA = null;
  var locale = null;

  /* ---------- SVG ikon seti ---------- */
  var ICONS = {
    server: '<path d="M4 4h16v6H4zM4 14h16v6H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="7.5" cy="7" r="1" fill="currentColor"/><circle cx="7.5" cy="17" r="1" fill="currentColor"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    activity: '<path d="M3 12h4l3 8 4-16 3 8h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2 5.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M20 5v6h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    users: '<circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 6.5a3 3 0 0 1 0 5.5M21 20c0-2.4-1.4-4.3-4-4.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/>',
    "map-pin": '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/>',
    "file-check": '<path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 14l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
    "shield-check": '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.shield) + '</svg>';
  }

  /* ---------- Yardımcılar ---------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function $(sel) { return document.querySelector(sel); }

  /* ---------- Section render fonksiyonları ---------- */
  var renderers = {
    certifications: function (s) {
      var grid = el("div", "cert-grid");
      s.items.forEach(function (it) {
        grid.appendChild(el("article", "cert-card",
          '<span class="cert-status">' + esc(it.status) + '</span>' +
          '<span class="cert-badge">' + esc(it.code) + '</span>' +
          '<h3>' + esc(it.name) + '</h3>' +
          '<p>' + esc(it.description) + '</p>'
        ));
      });
      return wrap(s, grid);
    },

    controls: function (s) {
      var grid = el("div", "controls-grid");
      var detailLabel = s.detailLabel || "Detay";
      var countLabel = s.countLabel || "";
      s.groups.forEach(function (g) {
        var card = el("article", "control-card");
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.innerHTML =
          '<div class="control-icon">' + icon(g.icon) + "</div>" +
          "<h3>" + esc(g.title) + "</h3>" +
          (g.summary ? '<p class="control-summary">' + esc(g.summary) + "</p>" : "") +
          '<div class="control-foot">' +
          '<span class="control-count">' + g.controls.length + " " + esc(countLabel) + "</span>" +
          '<span class="control-detail">' + esc(detailLabel) +
          ' <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
          "</div>";
        var open = function () { openPostureModal(g); };
        card.addEventListener("click", open);
        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
        });
        grid.appendChild(card);
      });
      return wrap(s, grid);
    },

    privacy: function (s) {
      var grid = el("div", "privacy-grid");
      s.cards.forEach(function (c) {
        grid.appendChild(el("article", "privacy-card",
          '<div class="privacy-icon">' + icon(c.icon) + "</div>" +
          "<h3>" + esc(c.title) + "</h3>" +
          "<p>" + esc(c.text) + "</p>"
        ));
      });
      return wrap(s, grid);
    },

    documents: function (s) {
      var container = el("div");
      if (s.requestNote) container.appendChild(el("div", "doc-note", "&#9432; " + esc(s.requestNote)));
      var list = el("div", "doc-list");
      s.items.forEach(function (d) {
        var row = el("div", "doc-row");
        var accessLabel = s.labels[d.access] || d.access;
        var btnLabel = d.access === "public" ? s.labels.downloadBtn : s.labels.requestBtn;
        var btnHtml = d.access === "public"
          // Herkese açık: form yok, doğrudan indirme
          ? '<a class="doc-btn" href="' + esc(d.url || "#") + '" download>' + esc(btnLabel) + "</a>"
          : '<button class="doc-btn" type="button">' + esc(btnLabel) + "</button>";
        row.innerHTML =
          '<span class="doc-file">' + esc(d.type) + "</span>" +
          '<span class="doc-name">' + esc(d.name) + "</span>" +
          '<span class="doc-access ' + esc(d.access) + '">' + esc(accessLabel) + "</span>" +
          btnHtml;
        if (d.access !== "public") {
          row.querySelector(".doc-btn").addEventListener("click", function () {
            openModal(d, s.agreement);
          });
        }
        list.appendChild(row);
      });
      container.appendChild(list);
      return wrap(s, container);
    },

    subprocessors: function (s) {
      var thead = "<tr>" + s.columns.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr>";
      var tbody = s.rows.map(function (r) {
        return "<tr>" + r.map(function (cell) { return "<td>" + esc(cell) + "</td>"; }).join("") + "</tr>";
      }).join("");
      var wrapEl = el("div", "table-wrap",
        '<table class="sub-table"><thead>' + thead + "</thead><tbody>" + tbody + "</tbody></table>");
      return wrap(s, wrapEl);
    },

    faq: function (s) {
      var list = el("div", "faq-list");
      s.items.forEach(function (f) {
        var item = el("div", "faq-item");
        item.innerHTML =
          '<button class="faq-q" aria-expanded="false"><span>' + esc(f.q) + "</span>" +
          '<svg class="faq-icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
          '<div class="faq-a"><div class="faq-a-inner">' + esc(f.a) + "</div></div>";
        var btn = item.querySelector(".faq-q");
        var ans = item.querySelector(".faq-a");
        btn.addEventListener("click", function () {
          var open = item.classList.toggle("open");
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0";
        });
        list.appendChild(item);
      });
      return wrap(s, list);
    },

    cta: function (s) {
      var band = el("div", "cta-band");
      band.setAttribute("data-reveal", "");
      band.innerHTML =
        "<h2>" + esc(s.title) + "</h2>" +
        "<p>" + esc(s.description) + "</p>" +
        '<div class="cta-actions">' +
        '<a class="btn btn-primary" href="' + esc(s.primaryCta.href) + '">' + esc(s.primaryCta.label) + "</a>" +
        '<a class="btn btn-ghost" href="' + esc(s.secondaryCta.href) + '">' + esc(s.secondaryCta.label) + "</a>" +
        "</div>";
      var sec = el("section", "section");
      sec.id = s.id;
      var c = el("div", "container");
      c.appendChild(band);
      sec.appendChild(c);
      return sec;
    }
  };

  /* Ortak section sarmalayıcı (başlık + içerik) */
  var altToggle = false;
  function wrap(s, contentEl, alt) {
    var sec = el("section", "section" + (alt ? " alt" : ""));
    sec.id = s.id;
    var c = el("div", "container");
    var head = el("div", "section-head");
    head.setAttribute("data-reveal", "");
    head.innerHTML =
      (s.eyebrow ? '<span class="eyebrow">' + esc(s.eyebrow) + "</span>" : "") +
      "<h2>" + esc(s.title) + "</h2>" +
      (s.description ? "<p>" + esc(s.description) + "</p>" : "");
    c.appendChild(head);
    contentEl.setAttribute("data-reveal", "");
    c.appendChild(contentEl);
    sec.appendChild(c);
    return sec;
  }

  /* ---------- Sayfa render ---------- */
  function render() {
    document.documentElement.lang = locale;
    document.title = DATA.meta.title;
    var descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute("content", DATA.meta.description);

    // brand accent
    document.querySelectorAll('[data-i18n="brand.accent"]').forEach(function (n) {
      n.textContent = SITE.brand.logoAccent;
    });

    // Üst menü
    var nav = $("#mainNav");
    nav.innerHTML = "";
    DATA.nav.items.forEach(function (it) {
      var a = el("a", null, esc(it.label));
      a.href = "#" + it.id;
      nav.appendChild(a);
    });

    // Header CTA
    var cta = $("#headerCta");
    cta.textContent = DATA.nav.cta.label;
    cta.href = "#" + DATA.nav.cta.target;

    // Lang toggle
    var lt = $("#langToggle");
    lt.textContent = DATA.meta.switchTo;

    // Hero
    var he = $("#heroEyebrow");
    he.textContent = DATA.hero.eyebrow || "";
    he.style.display = DATA.hero.eyebrow ? "" : "none";
    $("#heroTitle").textContent = DATA.hero.title;
    $("#heroSub").textContent = DATA.hero.subtitle;
    var heroCta = $("#heroCta");
    heroCta.innerHTML =
      '<a class="btn btn-primary" href="#' + esc(DATA.hero.primaryCta.target) + '">' + esc(DATA.hero.primaryCta.label) + "</a>" +
      '<a class="btn btn-ghost" href="#' + esc(DATA.hero.secondaryCta.target) + '">' + esc(DATA.hero.secondaryCta.label) + "</a>";
    $("#heroUpdated").textContent = DATA.hero.updated || "";

    // Uyumluluk rozet kartı
    var comp = DATA.hero.compliance || { badges: [] };
    $("#heroCardTitle").textContent = comp.title || "";
    $("#heroCardNote").textContent = comp.note || "";
    var badges = $("#heroBadges");
    badges.innerHTML = "";
    var shieldSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    (comp.badges || []).forEach(function (b) {
      // b string olabilir veya { label, img } — img varsa sertifika görseli, yoksa ikon
      var label = typeof b === "string" ? b : (b.label || "");
      var img = (b && typeof b === "object") ? b.img : null;
      var visual = img
        ? '<img class="badge-img" src="' + esc(img) + '" alt="' + esc(label) + '" />'
        : shieldSvg;
      badges.appendChild(el("span", "hero-badge" + (img ? " has-img" : ""), visual + "<span>" + esc(label) + "</span>"));
    });

    // Sections
    var host = $("#sections");
    host.innerHTML = "";
    DATA.sections.forEach(function (s, i) {
      var fn = renderers[s.type];
      if (!fn) { console.warn("Bilinmeyen section tipi:", s.type); return; }
      var secEl = fn(s);
      if (i % 2 === 0) secEl.classList.add("alt"); // arka planı otomatik alternasyon (surface/beyaz)
      host.appendChild(secEl);
    });

    // Footer
    $("#footerTagline").textContent = DATA.footer.tagline;
    $("#footerCopyright").textContent = DATA.footer.copyright;
    var fl = $("#footerLinks");
    fl.innerHTML = "";
    DATA.footer.links.forEach(function (l) {
      var a = el("a", null, esc(l.label));
      a.href = l.href;
      fl.appendChild(a);
    });

    setupFaqLang();
    observeReveal();
  }

  /* FAQ dil değişiminde açık kalanları resetle */
  function setupFaqLang() {}

  /* ---------- Güvenlik Duruşu (Security Posture) detay modalı ---------- */
  var postureModal = null;
  function ensurePostureModal() {
    if (postureModal) return postureModal;
    postureModal = el("div", "modal posture-modal");
    postureModal.setAttribute("role", "dialog");
    postureModal.setAttribute("aria-modal", "true");
    postureModal.setAttribute("aria-hidden", "true");
    postureModal.innerHTML =
      '<div class="modal-overlay" data-close></div>' +
      '<div class="modal-box modal-box-lg" role="document">' +
      '<button class="modal-close" data-close aria-label="Kapat">&times;</button>' +
      '<div class="posture-head"><span class="posture-icon"></span><h3></h3></div>' +
      '<p class="posture-summary"></p>' +
      '<div class="posture-list"></div>' +
      "</div>";
    document.body.appendChild(postureModal);
    postureModal.querySelectorAll("[data-close]").forEach(function (b) {
      b.addEventListener("click", closePostureModal);
    });
    return postureModal;
  }
  function openPostureModal(g) {
    var m = ensurePostureModal();
    m.querySelector(".posture-icon").innerHTML = icon(g.icon);
    m.querySelector(".posture-head h3").textContent = g.title;
    m.querySelector(".posture-summary").textContent = g.summary || "";
    var list = m.querySelector(".posture-list");
    list.innerHTML = "";
    g.controls.forEach(function (c) {
      list.appendChild(el("div", "posture-item",
        '<div class="posture-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" fill="currentColor"/></svg></div>' +
        '<div class="posture-item-body"><strong>' + esc(c.name) + "</strong>" +
        (c.desc ? "<span>" + esc(c.desc) + "</span>" : "") + "</div>"));
    });
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
  }
  function closePostureModal() {
    if (!postureModal) return;
    postureModal.classList.remove("open");
    postureModal.setAttribute("aria-hidden", "true");
  }

  /* ---------- Belge Talep Modalı ---------- */
  var currentDoc = null;        // o an talep edilen belge
  var currentAgreement = null;  // NDA sözleşmesi { title, url }

  function docLabels() {
    var s = (DATA && DATA.sections || []).filter(function (x) { return x.type === "documents"; })[0];
    return (s && s.labels) || {};
  }

  function openModal(doc, agreement) {
    currentDoc = doc;
    currentAgreement = agreement || null;
    var m = $("#requestModal");
    $("#modalDoc").textContent = doc.name || "";
    $("#modalSuccess").hidden = true;
    var form = $("#requestForm");
    form.reset();
    form.style.display = "";

    // NDA belgesinde onay satırı görünür
    var isNda = doc.access === "nda";
    var consentRow = $("#consentRow");
    consentRow.hidden = !isNda;
    if (isNda) {
      var L = docLabels();
      $("#consentText").innerHTML =
        esc(L.consentPrefix || "") +
        '<a href="#" class="agreement-link" id="agreementLink">' + esc(L.consentLink || "") + "</a>" +
        esc(L.consentSuffix || "");
      var link = $("#agreementLink");
      if (link) link.addEventListener("click", function (e) { e.preventDefault(); openAgreement(); });
    }
    updateSubmitState();
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    var m = $("#requestModal");
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
  }

  /* Zorunlu alanlar (+ NDA'da onay) tamamlanmadan "Talep Gönder" pasif */
  function updateSubmitState() {
    var f = $("#requestForm");
    var nm = f.querySelector('[name="name"]');
    var em = f.querySelector('[name="email"]');
    var co = f.querySelector('[name="company"]');
    var ok = !!(nm.value.trim() && co.value.trim() && em.value.trim() && em.checkValidity());
    if (currentDoc && currentDoc.access === "nda") ok = ok && $("#consentCheck").checked;
    $("#modalSubmit").disabled = !ok;
  }

  /* ---------- NDA Sözleşme Önizleme ---------- */
  function openAgreement() {
    if (!currentAgreement) return;
    var m = $("#agreementModal");
    $("#agreementTitle").textContent = currentAgreement.title || "";
    $("#agreementFrame").src = currentAgreement.url;
    var dl = $("#agreementDownload");
    dl.href = currentAgreement.url;
    dl.textContent = docLabels().agreementDownload || "İndir";
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
  }
  function closeAgreement() {
    var m = $("#agreementModal");
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
    $("#agreementFrame").src = "about:blank";
  }

  function setupModalStatic() {
    document.querySelectorAll("#requestModal [data-close]").forEach(function (b) {
      b.addEventListener("click", closeModal);
    });
    document.querySelectorAll("#agreementModal [data-close-agreement]").forEach(function (b) {
      b.addEventListener("click", closeAgreement);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeAgreement(); closeModal(); closePostureModal(); }
    });
    var form = $("#requestForm");
    form.addEventListener("input", updateSubmitState);
    $("#consentCheck").addEventListener("change", updateSubmitState);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Canlıda talep belirlenmiş e-posta adresine mailto ile iletilir
      var to = (SITE.brand && SITE.brand.email) || "";
      var nm = form.querySelector('[name="name"]').value.trim();
      var em = form.querySelector('[name="email"]').value.trim();
      var co = form.querySelector('[name="company"]').value.trim();
      var subject = (locale === "tr" ? "Belge Talebi: " : "Document Request: ") + (currentDoc ? currentDoc.name : "");
      var L = locale === "tr"
        ? { doc: "Belge", name: "Ad Soyad", email: "E-posta", company: "Şirket", nda: "Gizlilik sözleşmesi kabul edildi." }
        : { doc: "Document", name: "Full Name", email: "Email", company: "Company", nda: "Non-disclosure agreement accepted." };
      var body = [
        L.doc + ": " + (currentDoc ? currentDoc.name : ""),
        L.name + ": " + nm,
        L.email + ": " + em,
        L.company + ": " + co
      ];
      if (currentDoc && currentDoc.access === "nda") body.push(L.nda);
      window.location.href = "mailto:" + encodeURIComponent(to) +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body.join("\n"));
      this.style.display = "none";
      $("#modalSuccess").hidden = false;
    });
  }

  function applyModalLabels() {
    var t = locale === "tr"
      ? { title: "Belge Talebi", name: "Ad Soyad", email: "E-posta", company: "Şirket", submit: "Talep Gönder", success: "Talebiniz alındı. En kısa sürede size dönüş yapacağız." }
      : { title: "Document Request", name: "Full Name", email: "Email", company: "Company", submit: "Send Request", success: "Your request has been received. We will get back to you shortly." };
    $("#modalTitle").textContent = t.title;
    $("#lblName").textContent = t.name;
    $("#lblEmail").textContent = t.email;
    $("#lblCompany").textContent = t.company;
    $("#modalSubmit").textContent = t.submit;
    $("#modalSuccess").textContent = t.success;
  }

  /* ---------- Reveal on scroll ---------- */
  var observer = null;
  function observeReveal() {
    if (observer) observer.disconnect();
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach(function (n) { n.classList.add("in"); });
      return;
    }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); observer.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(function (n) { observer.observe(n); });
  }

  /* ---------- Dil yükleme ---------- */
  function loadLocale(loc) {
    return fetch("config/" + loc + ".json").then(function (r) {
      if (!r.ok) throw new Error("locale load failed: " + loc);
      return r.json();
    });
  }
  function setLocale(loc) {
    loadLocale(loc).then(function (data) {
      DATA = data;
      locale = loc;
      try { localStorage.setItem("tc_locale", loc); } catch (e) {}
      applyModalLabels();
      render();
    }).catch(function (err) { console.error(err); });
  }

  /* ---------- Header & burger davranışı ---------- */
  function setupHeader() {
    var header = $("#siteHeader");
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    });
    var burger = $("#navBurger");
    var nav = $("#mainNav");
    if (burger && nav) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
      });
    }
    $("#langToggle").addEventListener("click", function () {
      setLocale(locale === "tr" ? "en" : "tr");
    });
  }

  /* ---------- Başlat ---------- */
  function init() {
    setupHeader();
    setupModalStatic();
    fetch("config/site.json")
      .then(function (r) { return r.json(); })
      .then(function (site) {
        SITE = site;
        applyTheme(site.theme);
        var saved = null;
        try { saved = localStorage.getItem("tc_locale"); } catch (e) {}
        var start = saved && site.locales.indexOf(saved) !== -1 ? saved : site.defaultLocale;
        setLocale(start);
      })
      .catch(function (err) {
        console.error("site.json yüklenemedi:", err);
        document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">Config yüklenemedi. Sayfayı bir HTTP sunucusu üzerinden açtığınızdan emin olun (ör. <code>python3 -m http.server</code>).</p>';
      });
  }

  function applyTheme(theme) {
    if (!theme || !theme.colors) return;
    var root = document.documentElement.style;
    var map = { navy: "--navy", navyDeep: "--navy-deep", navySoft: "--navy-soft", blue: "--blue",
      orange: "--orange", orangeDark: "--orange-dark", ink: "--ink", muted: "--muted", line: "--line",
      surface: "--surface", white: "--white", green: "--green" };
    Object.keys(map).forEach(function (k) { if (theme.colors[k]) root.setProperty(map[k], theme.colors[k]); });
    if (theme.font) root.setProperty("--font", theme.font);
    if (theme.radius) root.setProperty("--radius", theme.radius);
    if (theme.maxWidth) root.setProperty("--max", theme.maxWidth);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
