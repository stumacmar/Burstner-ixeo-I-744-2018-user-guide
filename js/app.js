/**
 * Bürstner Ixeo I 744 Interactive Manual - Main Application
 *
 * Zero-build, icon-only, mobile-first interactive owner's manual.
 *
 * Features:
 * - Hash routing: #<system-id>, #checklist/<id>, #emergency
 * - Persistent search with highlighted matches and keyboard navigation
 * - Interactive checklists with progress saved on the device
 * - Light/dark theme with saved preference
 * - Breadcrumbs, previous/next pagination, focus management
 */

(function () {
    'use strict';

    var THEME_KEY = 'ixeo-theme';
    var CHECK_KEY_PREFIX = 'ixeo-check-';

    var App = {
        orderedSystems: [],
        homeScrollY: 0,
        lastRouteId: null,
        searchEntries: [],
        activeResult: -1,

        /* ------------------------------------------------------------------ *
         * Init
         * ------------------------------------------------------------------ */
        init: function () {
            this.buildOrderedSystems();
            this.buildSearchEntries();
            this.renderQuickGuides();
            this.renderCategoryNav();
            this.renderSystemGrid();
            this.setupSearch();
            this.setupTheme();
            this.setupGlobalEvents();
            this.route();
        },

        /** Flatten systems in category display order (used for prev/next). */
        buildOrderedSystems: function () {
            var byCategory = {};
            SYSTEMS.forEach(function (system) {
                var cat = system.category || 'Other';
                (byCategory[cat] = byCategory[cat] || []).push(system);
            });
            var sorted = Object.keys(byCategory).sort(function (a, b) {
                return (CATEGORIES[a] ? CATEGORIES[a].order : 999) -
                       (CATEGORIES[b] ? CATEGORIES[b].order : 999);
            });
            var ordered = [];
            sorted.forEach(function (cat) {
                ordered = ordered.concat(byCategory[cat]);
            });
            this.orderedSystems = ordered;
        },

        /* ------------------------------------------------------------------ *
         * Routing
         * ------------------------------------------------------------------ */
        route: function () {
            var hash = decodeURIComponent(window.location.hash.slice(1));

            if (!hash) {
                this.showHome();
                return;
            }
            if (hash === 'emergency') {
                this.showDetail(this.buildEmergencyHTML(), 'emergency');
                return;
            }
            if (hash.indexOf('checklist/') === 0) {
                var checklistId = hash.slice('checklist/'.length);
                var checklist = this.findById(CHECKLISTS, checklistId);
                if (checklist) {
                    this.showDetail(this.buildChecklistHTML(checklist), hash);
                    this.bindChecklist(checklist);
                    return;
                }
            }
            var system = this.findById(SYSTEMS, hash);
            if (system) {
                this.showDetail(this.buildSystemHTML(system), hash);
                return;
            }
            this.showHome();
        },

        findById: function (list, id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) { return list[i]; }
            }
            return null;
        },

        showHome: function () {
            var detail = document.getElementById('system-detail');
            var home = document.getElementById('home-view');
            detail.classList.add('hidden');
            detail.setAttribute('hidden', '');
            detail.innerHTML = '';
            home.classList.remove('hidden');
            home.removeAttribute('hidden');

            // Refresh quick-guide progress badges (may have changed)
            this.renderQuickGuides();

            // Restore scroll position, and return focus to the card the
            // visitor came from so keyboard users keep their place.
            var lastId = this.lastRouteId;
            window.scrollTo(0, this.homeScrollY || 0);
            if (lastId) {
                var card = document.querySelector('[data-route="' + lastId + '"]');
                if (card) { card.focus({ preventScroll: true }); }
                this.lastRouteId = null;
            }
            document.title = 'Bürstner Ixeo I 744 – Interactive Manual';
        },

        showDetail: function (html, routeId) {
            var home = document.getElementById('home-view');
            var detail = document.getElementById('system-detail');

            if (!home.classList.contains('hidden')) {
                this.homeScrollY = window.scrollY || 0;
            }
            this.lastRouteId = routeId;

            home.classList.add('hidden');
            home.setAttribute('hidden', '');
            detail.innerHTML = html;
            detail.classList.remove('hidden');
            detail.removeAttribute('hidden');
            window.scrollTo(0, 0);

            var title = detail.querySelector('.detail-title');
            if (title) {
                title.setAttribute('tabindex', '-1');
                title.focus({ preventScroll: true });
                document.title = title.textContent + ' – Ixeo I 744 Manual';
            }

            var backBtn = detail.querySelector('.back-button');
            if (backBtn) {
                backBtn.addEventListener('click', function () {
                    App.goHome();
                });
            }
        },

        goHome: function () {
            if (window.location.hash) {
                // Replace the hash without leaving a dangling '#'
                history.pushState(null, '', window.location.pathname + window.location.search);
            }
            this.route();
        },

        /* ------------------------------------------------------------------ *
         * Home view rendering
         * ------------------------------------------------------------------ */
        renderQuickGuides: function () {
            var grid = document.getElementById('quick-guides-grid');
            if (!grid) { return; }

            var html = '<a class="quick-card quick-card-emergency" href="#emergency" data-route="emergency">' +
                '<span class="quick-icon" aria-hidden="true">⚠️</span>' +
                '<span class="quick-body"><span class="quick-title">Emergency</span>' +
                '<span class="quick-summary">Gas leak, fire, breakdown — what to do</span></span>' +
                '<span class="quick-chevron" aria-hidden="true">›</span></a>';

            html += CHECKLISTS.map(function (cl) {
                var progress = App.getCheckedCount(cl);
                var progressText = progress > 0
                    ? progress + ' of ' + cl.items.length + ' done'
                    : cl.items.length + ' checks';
                return '<a class="quick-card" href="#checklist/' + App.escAttr(cl.id) + '"' +
                    ' data-route="checklist/' + App.escAttr(cl.id) + '">' +
                    '<span class="quick-icon" aria-hidden="true">' + cl.icon + '</span>' +
                    '<span class="quick-body"><span class="quick-title">' + App.esc(cl.title) + '</span>' +
                    '<span class="quick-summary">' + App.esc(cl.summary) +
                    ' · <span class="quick-progress">' + App.esc(progressText) + '</span></span></span>' +
                    '<span class="quick-chevron" aria-hidden="true">›</span></a>';
            }).join('');

            grid.innerHTML = html;
        },

        renderCategoryNav: function () {
            var nav = document.getElementById('category-nav');
            if (!nav) { return; }
            var cats = Object.keys(CATEGORIES).sort(function (a, b) {
                return CATEGORIES[a].order - CATEGORIES[b].order;
            });
            nav.innerHTML = cats.map(function (cat) {
                return '<a class="category-chip" href="#cat-' + App.escAttr(App.slug(cat)) + '">' +
                    '<span aria-hidden="true">' + CATEGORIES[cat].icon + '</span> ' + App.esc(cat) + '</a>';
            }).join('');

            // Smooth-scroll to category sections without touching the hash
            nav.addEventListener('click', function (e) {
                var chip = e.target.closest('.category-chip');
                if (!chip) { return; }
                e.preventDefault();
                var target = document.getElementById(chip.getAttribute('href').slice(1));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    var heading = target.querySelector('.category-title');
                    if (heading) {
                        heading.setAttribute('tabindex', '-1');
                        heading.focus({ preventScroll: true });
                    }
                }
            });
        },

        renderSystemGrid: function () {
            var grid = document.getElementById('system-grid');
            if (!grid) { return; }

            var byCategory = {};
            SYSTEMS.forEach(function (system) {
                var cat = system.category || 'Other';
                (byCategory[cat] = byCategory[cat] || []).push(system);
            });
            var sorted = Object.keys(byCategory).sort(function (a, b) {
                return (CATEGORIES[a] ? CATEGORIES[a].order : 999) -
                       (CATEGORIES[b] ? CATEGORIES[b].order : 999);
            });

            grid.innerHTML = sorted.map(function (cat) {
                var conf = CATEGORIES[cat] || { icon: '📋' };
                return '<section class="category-group" id="cat-' + App.escAttr(App.slug(cat)) + '"' +
                    ' aria-label="' + App.escAttr(cat) + '">' +
                    '<h3 class="category-title"><span class="category-icon" aria-hidden="true">' + conf.icon + '</span>' +
                    App.esc(cat) + '<span class="category-count">' + byCategory[cat].length + '</span></h3>' +
                    '<div class="system-buttons">' +
                    byCategory[cat].map(App.createSystemCard).join('') +
                    '</div></section>';
            }).join('');
        },

        createSystemCard: function (system) {
            return '<a class="system-card" href="#' + App.escAttr(system.id) + '"' +
                ' data-route="' + App.escAttr(system.id) + '">' +
                '<span class="card-icon" aria-hidden="true">' + system.icon + '</span>' +
                '<span class="card-label">' + App.esc(system.title) + '</span>' +
                (system.summary ? '<span class="card-summary">' + App.esc(system.summary) + '</span>' : '') +
                '</a>';
        },

        /* ------------------------------------------------------------------ *
         * Detail views
         * ------------------------------------------------------------------ */
        detailHeader: function (crumbLabel, crumbTitle) {
            return '<nav class="detail-breadcrumb" aria-label="Breadcrumb">' +
                '<button class="back-button" type="button">' +
                '<span class="back-icon" aria-hidden="true">←</span> All systems</button>' +
                '<ol class="crumbs"><li>' + App.esc(crumbLabel) + '</li>' +
                '<li aria-current="page">' + App.esc(crumbTitle) + '</li></ol></nav>';
        },

        buildSystemHTML: function (system) {
            var bullets = system.bullets && system.bullets.length
                ? '<section class="detail-section info-section" aria-labelledby="sec-info">' +
                  '<h3 class="section-title" id="sec-info"><span class="section-icon" aria-hidden="true">ℹ️</span> Key Information</h3>' +
                  '<ul class="bullet-list">' +
                  system.bullets.map(function (b) { return '<li>' + App.esc(b) + '</li>'; }).join('') +
                  '</ul></section>'
                : '';

            var steps = system.steps && system.steps.length
                ? '<section class="detail-section steps-section" aria-labelledby="sec-steps">' +
                  '<h3 class="section-title" id="sec-steps"><span class="section-icon" aria-hidden="true">📝</span> How To Use</h3>' +
                  '<ol class="steps-list">' +
                  system.steps.map(function (step, i) {
                      return '<li class="step-item"><span class="step-number" aria-hidden="true">' + (i + 1) +
                          '</span><span class="step-text">' + App.esc(step) + '</span></li>';
                  }).join('') +
                  '</ol></section>'
                : '';

            var safety = system.safety && system.safety.length
                ? '<section class="detail-section safety-section" aria-labelledby="sec-safety">' +
                  '<h3 class="section-title" id="sec-safety"><span class="section-icon" aria-hidden="true">⚠️</span> Safety Notes</h3>' +
                  '<ul class="safety-list">' +
                  system.safety.map(function (s) { return '<li>' + App.esc(s) + '</li>'; }).join('') +
                  '</ul></section>'
                : '';

            return this.detailHeader(system.category || 'General', system.title) +
                '<article class="detail-content">' +
                '<header class="detail-hero">' +
                '<span class="hero-icon" aria-hidden="true">' + system.icon + '</span>' +
                '<h2 class="detail-title">' + App.esc(system.title) + '</h2>' +
                (system.summary ? '<p class="detail-summary">' + App.esc(system.summary) + '</p>' : '') +
                '</header>' +
                bullets + steps + safety +
                this.buildPagerHTML(system) +
                '</article>';
        },

        buildPagerHTML: function (system) {
            var idx = this.orderedSystems.indexOf(system);
            if (idx === -1) { return ''; }
            var prev = this.orderedSystems[idx - 1];
            var next = this.orderedSystems[idx + 1];
            var html = '<nav class="pager" aria-label="More systems">';
            html += prev
                ? '<a class="pager-link pager-prev" href="#' + App.escAttr(prev.id) + '">' +
                  '<span class="pager-label">‹ Previous</span><span class="pager-title">' +
                  prev.icon + ' ' + App.esc(prev.title) + '</span></a>'
                : '<span class="pager-spacer"></span>';
            html += next
                ? '<a class="pager-link pager-next" href="#' + App.escAttr(next.id) + '">' +
                  '<span class="pager-label">Next ›</span><span class="pager-title">' +
                  next.icon + ' ' + App.esc(next.title) + '</span></a>'
                : '<span class="pager-spacer"></span>';
            return html + '</nav>';
        },

        buildChecklistHTML: function (checklist) {
            var checked = this.getCheckedSet(checklist.id);
            var items = checklist.items.map(function (item, i) {
                var isChecked = checked.indexOf(i) !== -1;
                return '<li class="check-item' + (isChecked ? ' is-checked' : '') + '">' +
                    '<label><input type="checkbox" data-index="' + i + '"' + (isChecked ? ' checked' : '') + '>' +
                    '<span class="check-text">' + App.esc(item) + '</span></label></li>';
            }).join('');

            return this.detailHeader('Quick Guides', checklist.title) +
                '<article class="detail-content">' +
                '<header class="detail-hero">' +
                '<span class="hero-icon" aria-hidden="true">' + checklist.icon + '</span>' +
                '<h2 class="detail-title">' + App.esc(checklist.title) + '</h2>' +
                '<p class="detail-summary">' + App.esc(checklist.intro) + '</p>' +
                '</header>' +
                '<section class="detail-section checklist-section" aria-label="Checklist">' +
                '<div class="checklist-toolbar">' +
                '<p class="checklist-progress" role="status">' + this.progressText(checklist) + '</p>' +
                '<button type="button" class="reset-button">Reset</button>' +
                '</div>' +
                '<ul class="check-list">' + items + '</ul>' +
                '<p class="checklist-note">Ticks are saved on this device — use Reset before your next trip.</p>' +
                '</section>' +
                '</article>';
        },

        bindChecklist: function (checklist) {
            var detail = document.getElementById('system-detail');
            var list = detail.querySelector('.check-list');
            var progress = detail.querySelector('.checklist-progress');
            var reset = detail.querySelector('.reset-button');

            if (list) {
                list.addEventListener('change', function (e) {
                    var box = e.target;
                    if (box.type !== 'checkbox') { return; }
                    box.closest('.check-item').classList.toggle('is-checked', box.checked);
                    var checked = [];
                    list.querySelectorAll('input[type="checkbox"]').forEach(function (cb, i) {
                        if (cb.checked) { checked.push(i); }
                    });
                    App.saveCheckedSet(checklist.id, checked);
                    if (progress) { progress.textContent = App.progressText(checklist); }
                });
            }
            if (reset) {
                reset.addEventListener('click', function () {
                    App.saveCheckedSet(checklist.id, []);
                    if (list) {
                        list.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
                            cb.checked = false;
                            cb.closest('.check-item').classList.remove('is-checked');
                        });
                    }
                    if (progress) { progress.textContent = App.progressText(checklist); }
                });
            }
        },

        progressText: function (checklist) {
            var done = this.getCheckedCount(checklist);
            return done === checklist.items.length
                ? 'All ' + checklist.items.length + ' checks done ✓'
                : done + ' of ' + checklist.items.length + ' checks done';
        },

        getCheckedSet: function (id) {
            try {
                var raw = localStorage.getItem(CHECK_KEY_PREFIX + id);
                var parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) { return []; }
        },

        saveCheckedSet: function (id, indices) {
            try {
                localStorage.setItem(CHECK_KEY_PREFIX + id, JSON.stringify(indices));
            } catch (e) { /* storage unavailable */ }
        },

        getCheckedCount: function (checklist) {
            return this.getCheckedSet(checklist.id).filter(function (i) {
                return i >= 0 && i < checklist.items.length;
            }).length;
        },

        buildEmergencyHTML: function () {
            var cards = EMERGENCY.map(function (item) {
                return '<section class="detail-section emergency-card" aria-label="' + App.escAttr(item.title) + '">' +
                    '<h3 class="section-title"><span class="section-icon" aria-hidden="true">' + item.icon + '</span> ' +
                    App.esc(item.title) + '</h3>' +
                    '<ol class="steps-list">' +
                    item.steps.map(function (step, i) {
                        return '<li class="step-item"><span class="step-number" aria-hidden="true">' + (i + 1) +
                            '</span><span class="step-text">' + App.esc(step) + '</span></li>';
                    }).join('') +
                    '</ol></section>';
            }).join('');

            return this.detailHeader('Quick Guides', 'Emergency') +
                '<article class="detail-content">' +
                '<header class="detail-hero detail-hero-emergency">' +
                '<span class="hero-icon" aria-hidden="true">⚠️</span>' +
                '<h2 class="detail-title">Emergency Procedures</h2>' +
                '<p class="detail-summary">If life is at risk, call <strong>999</strong> (UK) or <strong>112</strong> (Europe) first.</p>' +
                '</header>' +
                cards +
                '</article>';
        },

        /* ------------------------------------------------------------------ *
         * Search
         * ------------------------------------------------------------------ */
        buildSearchEntries: function () {
            var entries = [];
            SYSTEMS.forEach(function (s) {
                entries.push({
                    route: '#' + s.id,
                    title: s.title,
                    icon: s.icon,
                    type: s.category || 'System',
                    keywords: (s.keywords || []).join(' '),
                    texts: (s.bullets || []).concat(s.steps || [], s.safety || [])
                });
            });
            CHECKLISTS.forEach(function (cl) {
                entries.push({
                    route: '#checklist/' + cl.id,
                    title: cl.title,
                    icon: cl.icon,
                    type: 'Checklist',
                    keywords: (cl.keywords || []).join(' '),
                    texts: [cl.intro].concat(cl.items)
                });
            });
            EMERGENCY.forEach(function (em) {
                entries.push({
                    route: '#emergency',
                    title: em.title,
                    icon: em.icon,
                    type: 'Emergency',
                    keywords: 'emergency urgent help',
                    texts: em.steps
                });
            });
            this.searchEntries = entries;
        },

        setupSearch: function () {
            var input = document.getElementById('search-input');
            var results = document.getElementById('search-results');
            if (!input || !results) { return; }

            input.addEventListener('input', function () {
                App.runSearch(input.value);
            });

            input.addEventListener('keydown', function (e) {
                var items = results.querySelectorAll('.search-result-item[data-route]');
                if (e.key === 'Escape') {
                    App.closeSearch(true);
                } else if (e.key === 'ArrowDown' && items.length) {
                    e.preventDefault();
                    App.setActiveResult(Math.min(App.activeResult + 1, items.length - 1));
                } else if (e.key === 'ArrowUp' && items.length) {
                    e.preventDefault();
                    App.setActiveResult(Math.max(App.activeResult - 1, 0));
                } else if (e.key === 'Enter') {
                    var target = (App.activeResult >= 0 && items[App.activeResult]) || items[0];
                    if (target) {
                        e.preventDefault();
                        App.openResult(target.getAttribute('data-route'));
                    }
                }
            });

            results.addEventListener('click', function (e) {
                var item = e.target.closest('.search-result-item[data-route]');
                if (item) { App.openResult(item.getAttribute('data-route')); }
            });

            document.addEventListener('click', function (e) {
                if (!e.target.closest('.search-row')) { App.closeSearch(false); }
            });
        },

        runSearch: function (query) {
            var term = query.trim().toLowerCase();
            var results = document.getElementById('search-results');
            var status = document.getElementById('search-status');
            if (term.length < 2) {
                this.closeSearch(false);
                return;
            }

            var matches = [];
            this.searchEntries.forEach(function (entry) {
                var score = 0;
                var snippetSource = '';
                if (entry.title.toLowerCase().indexOf(term) !== -1) { score += 10; }
                if (entry.type.toLowerCase().indexOf(term) !== -1) { score += 5; }
                if (entry.keywords.toLowerCase().indexOf(term) !== -1) { score += 6; }
                for (var i = 0; i < entry.texts.length; i++) {
                    if (entry.texts[i].toLowerCase().indexOf(term) !== -1) {
                        score += 2;
                        if (!snippetSource) { snippetSource = entry.texts[i]; }
                    }
                }
                if (score > 0) {
                    matches.push({ entry: entry, score: score, snippet: snippetSource });
                }
            });
            matches.sort(function (a, b) { return b.score - a.score; });
            matches = matches.slice(0, 8);

            this.activeResult = -1;
            if (!matches.length) {
                results.innerHTML = '<div class="search-result-item no-results">' +
                    '<span class="result-title">No results for “' + App.esc(query.trim()) + '”</span>' +
                    '<span class="result-snippet">Try “gas”, “water”, “bed” or “heating”.</span></div>';
            } else {
                results.innerHTML = matches.map(function (m, i) {
                    var snippet = m.snippet ? App.makeSnippet(m.snippet, term) : '';
                    return '<div class="search-result-item" id="search-option-' + i + '"' +
                        ' role="option" aria-selected="false"' +
                        ' data-route="' + App.escAttr(m.entry.route) + '">' +
                        '<span class="result-icon" aria-hidden="true">' + m.entry.icon + '</span>' +
                        '<span class="result-main"><span class="result-title">' +
                        App.highlight(m.entry.title, term) + '</span>' +
                        (snippet ? '<span class="result-snippet">' + snippet + '</span>' : '') +
                        '</span>' +
                        '<span class="result-type">' + App.esc(m.entry.type) + '</span></div>';
                }).join('');
            }

            results.classList.remove('hidden');
            document.getElementById('search-input').setAttribute('aria-expanded', 'true');
            if (status) {
                status.textContent = matches.length
                    ? matches.length + ' result' + (matches.length === 1 ? '' : 's') + ' available'
                    : 'No results';
            }
        },

        setActiveResult: function (index) {
            var results = document.getElementById('search-results');
            var input = document.getElementById('search-input');
            var items = results.querySelectorAll('.search-result-item[data-route]');
            this.activeResult = index;
            items.forEach(function (item, i) {
                var active = i === index;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            if (items[index]) {
                input.setAttribute('aria-activedescendant', items[index].id);
                items[index].scrollIntoView({ block: 'nearest' });
            }
        },

        openResult: function (route) {
            this.closeSearch(true);
            document.getElementById('search-input').value = '';
            if (window.location.hash === route) {
                this.route();
            } else {
                window.location.hash = route;
            }
        },

        closeSearch: function (clearFocus) {
            var results = document.getElementById('search-results');
            var input = document.getElementById('search-input');
            if (results) { results.classList.add('hidden'); }
            if (input) {
                input.setAttribute('aria-expanded', 'false');
                input.removeAttribute('aria-activedescendant');
                if (clearFocus) { input.blur(); }
            }
            this.activeResult = -1;
        },

        /** Trim long text to a window around the first match. */
        makeSnippet: function (text, term) {
            var lower = text.toLowerCase();
            var pos = lower.indexOf(term);
            var radius = 44;
            var start = Math.max(0, pos - radius);
            var end = Math.min(text.length, pos + term.length + radius);
            var slice = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
            return this.highlight(slice, term);
        },

        /** Escape text, then wrap case-insensitive matches in <mark>. */
        highlight: function (text, term) {
            var escaped = App.esc(text);
            var escapedTerm = App.esc(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            try {
                return escaped.replace(new RegExp('(' + escapedTerm + ')', 'gi'), '<mark>$1</mark>');
            } catch (e) {
                return escaped;
            }
        },

        /* ------------------------------------------------------------------ *
         * Theme
         * ------------------------------------------------------------------ */
        setupTheme: function () {
            var btn = document.getElementById('theme-toggle');
            if (!btn) { return; }
            this.reflectTheme();
            btn.addEventListener('click', function () {
                var current = document.documentElement.getAttribute('data-theme');
                var next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
                App.reflectTheme();
            });
        },

        reflectTheme: function () {
            var theme = document.documentElement.getAttribute('data-theme');
            var btn = document.getElementById('theme-toggle');
            var icon = btn.querySelector('.theme-icon');
            var dark = theme === 'dark';
            icon.textContent = dark ? '☀️' : '🌙';
            btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
            var meta = document.querySelector('meta[name="theme-color"]');
            if (meta) { meta.setAttribute('content', dark ? '#0f1722' : '#16304e'); }
        },

        /* ------------------------------------------------------------------ *
         * Global events
         * ------------------------------------------------------------------ */
        setupGlobalEvents: function () {
            window.addEventListener('hashchange', function () { App.route(); });
            window.addEventListener('popstate', function () { App.route(); });

            document.addEventListener('keydown', function (e) {
                var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
                if (e.key === '/' && !typing) {
                    e.preventDefault();
                    var input = document.getElementById('search-input');
                    input.focus();
                    input.select();
                } else if (e.key === 'Escape' && !typing) {
                    var detail = document.getElementById('system-detail');
                    if (detail && !detail.classList.contains('hidden')) {
                        App.goHome();
                    }
                }
            });
        },

        /* ------------------------------------------------------------------ *
         * Utilities
         * ------------------------------------------------------------------ */
        slug: function (text) {
            return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        },

        esc: function (text) {
            if (text === null || text === undefined) { return ''; }
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        },

        escAttr: function (text) {
            if (text === null || text === undefined) { return ''; }
            return String(text).replace(/[&<>"']/g, function (ch) {
                return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
            });
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        App.init();
    });

    // Expose for debugging in the browser console
    window.IxeoManual = App;
})();
