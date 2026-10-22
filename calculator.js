(function () {
      /* Enhanced Cost Estimator
         Note: the line-item ranges below are calibrated to Northeast pricing
         (the higher end of the national range). Each region's multiplier is
         applied relative to this Northeast baseline, so Northeast = 1.0 and
         other regions scale down accordingly. */
      var costData = {
        northeast: {
          name: "Northeast",
          multiplier: 1.0,
          traditional: {
            "Basic services fee": [2400, 3800],
            "Embalming": [700, 1200],
            "Viewing & visitation": [500, 900],
            "Funeral ceremony": [500, 900],
            "Transfer of remains": [350, 600],
            "Hearse": [350, 550],
            "Casket (mid-range)": [2500, 5500],
            "Cemetery plot": [1500, 4500],
            "Opening & closing": [1200, 2500],
            "Vault or liner": [1000, 3000],
            "Flowers, programs, obituary": [500, 1500]
          },
          "cremation-service": {
            "Basic services fee": [2400, 3800],
            "Embalming (if viewing)": [700, 1200],
            "Viewing & visitation": [500, 900],
            "Memorial ceremony": [500, 900],
            "Transfer of remains": [350, 600],
            "Cremation fee": [300, 600],
            "Urn (mid-range)": [200, 800],
            "Flowers, programs, obituary": [400, 1200]
          },
          "direct-cremation": {
            "Basic services fee (reduced)": [800, 1500],
            "Transfer of remains": [300, 500],
            "Cremation fee": [300, 600],
            "Alternative container": [75, 200],
            "Certified death certificates": [50, 150]
          },
          "direct-burial": {
            "Basic services fee (reduced)": [800, 1500],
            "Transfer of remains": [300, 500],
            "Simple casket or container": [500, 1500],
            "Cemetery plot": [1500, 4500],
            "Opening & closing": [1200, 2500],
            "Certified death certificates": [50, 150]
          },
          "memorial-only": {
            "Facility use for memorial": [400, 800],
            "Staff coordination": [300, 600],
            "Flowers, programs, obituary": [300, 1000],
            "Audio/visual equipment": [100, 400]
          }
        },
        /* Multipliers are scaled relative to the Northeast baseline (1.0).
           These reflect typical regional cost spreads vs. the Northeast high. */
        southeast: { name: "Southeast", multiplier: 0.76 },
        midwest:   { name: "Midwest",   multiplier: 0.74 },
        south:     { name: "South",     multiplier: 0.70 },
        west:      { name: "West",      multiplier: 0.90 },
        mountain:  { name: "Mountain",  multiplier: 0.68 }
      };

      // Base costs (northeast) for all service types, used for regional scaling
      var baseLineItems = costData.northeast;

      function getLineItems(region, service) {
        var baseItems = baseLineItems[service];
        if (!baseItems) return null;
        var mult = costData[region].multiplier;
        var items = {};
        for (var key in baseItems) {
          items[key] = [
            Math.round(baseItems[key][0] * mult / 50) * 50,
            Math.round(baseItems[key][1] * mult / 50) * 50
          ];
        }
        return items;
      }

      function formatCurrency(num) {
        return "$" + num.toLocaleString();
      }

      var serviceLabels = {
        "traditional": "Traditional funeral with burial",
        "cremation-service": "Funeral service with cremation",
        "direct-cremation": "Direct cremation",
        "direct-burial": "Direct burial",
        "memorial-only": "Memorial service only"
      };

      var estBtn = document.getElementById("estButton");
      if (estBtn) {
        var regionSelect = document.getElementById("estRegion");
        var serviceSelect = document.getElementById("estService");
        var casketSelect = document.getElementById("estCasket");
        var resultDiv = document.getElementById("estResult");

        var casketCosts = {
          "budget":  { label: "Casket — Budget / simple",       low: 800,  high: 1500 },
          "mid":     { label: "Casket — Mid-range",             low: 2000, high: 4000 },
          "premium": { label: "Casket — Premium",               low: 5000, high: 10000 },
          "rental":  { label: "Casket — Rental",                low: 500,  high: 1000 },
          "none":    { label: "Cremation container (no casket)", low: 50,   high: 200 }
        };

        var extrasCosts = {
          "flowers":   { label: "Flowers & arrangements",  low: 300,  high: 800 },
          "obituary":  { label: "Obituary / death notice", low: 200,  high: 600 },
          "headstone": { label: "Headstone / marker",      low: 1000, high: 3000 },
          "transport": { label: "Long-distance transport",  low: 1000, high: 3000 },
          "reception": { label: "Reception / gathering",   low: 500,  high: 2000 }
        };

        estBtn.addEventListener("click", function () {
          var region = regionSelect.value;
          var service = serviceSelect.value;
          if (!region || !service) {
            alert("Please select both a region and a service type.");
            return;
          }
          var items = getLineItems(region, service);
          if (!items) return;

          var totalLow = 0, totalHigh = 0;
          var lineItemsHtml = "";
          for (var label in items) {
            var low = items[label][0];
            var high = items[label][1];
            totalLow += low;
            totalHigh += high;
            lineItemsHtml += '<div class="estimator-line">' +
              '<span class="estimator-line-label">' + label + '</span>' +
              '<span class="estimator-line-range">' + formatCurrency(low) + ' – ' + formatCurrency(high) + '</span>' +
              '</div>';
          }

          /* Casket preference */
          var casketVal = casketSelect.value;
          if (casketVal && casketCosts[casketVal]) {
            var cc = casketCosts[casketVal];
            var mult = costData[region].multiplier;
            var cLow = Math.round(cc.low * mult / 50) * 50;
            var cHigh = Math.round(cc.high * mult / 50) * 50;
            totalLow += cLow;
            totalHigh += cHigh;
            lineItemsHtml += '<div class="estimator-line">' +
              '<span class="estimator-line-label">' + cc.label + '</span>' +
              '<span class="estimator-line-range">' + formatCurrency(cLow) + ' – ' + formatCurrency(cHigh) + '</span>' +
              '</div>';
          }

          /* Additional services (extras) */
          var extrasGroup = document.getElementById("estExtras");
          var checkedExtras = extrasGroup.querySelectorAll('input[type="checkbox"]:checked');
          for (var i = 0; i < checkedExtras.length; i++) {
            var val = checkedExtras[i].value;
            if (extrasCosts[val]) {
              var ec = extrasCosts[val];
              var eMult = costData[region].multiplier;
              var eLow = Math.round(ec.low * eMult / 50) * 50;
              var eHigh = Math.round(ec.high * eMult / 50) * 50;
              totalLow += eLow;
              totalHigh += eHigh;
              lineItemsHtml += '<div class="estimator-line">' +
                '<span class="estimator-line-label">' + ec.label + '</span>' +
                '<span class="estimator-line-range">' + formatCurrency(eLow) + ' – ' + formatCurrency(eHigh) + '</span>' +
                '</div>';
            }
          }

          document.getElementById("estSummaryTitle").textContent =
            serviceLabels[service] + " — " + costData[region].name;
          document.getElementById("estTotal").textContent =
            formatCurrency(totalLow) + " – " + formatCurrency(totalHigh);
          document.getElementById("estSummaryNote").textContent =
            "Estimated range for " + costData[region].name.toLowerCase() + " region. Actual costs depend on the specific provider and your choices. Always request an itemized General Price List.";
          document.getElementById("estLineItems").innerHTML = lineItemsHtml;
          resultDiv.style.display = "block";
          resultDiv.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }

      /* Mobile nav toggle */
      var navToggle = document.querySelector(".mobile-nav-toggle");
      var siteNav = document.getElementById("site-nav");
      if (navToggle && siteNav) {
        navToggle.addEventListener("click", function () {
          var isOpen = siteNav.classList.toggle("nav-open");
          navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        siteNav.querySelectorAll(".nav-link").forEach(function (link) {
          link.addEventListener("click", function () {
            siteNav.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
          });
        });
      }

      /* Smooth scroll for anchor links */
      document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
          var targetId = this.getAttribute("href").slice(1);
          var target = document.getElementById(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });

      /* Navigation dropdown (Guides) */
      var dropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");
      dropdownToggles.forEach(function (toggle) {
        toggle.addEventListener("click", function (e) {
          e.stopPropagation();
          var parent = this.closest(".nav-dropdown");
          var isOpen = parent.classList.toggle("dropdown-open");
          this.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
      });

      document.addEventListener("click", function () {
        document.querySelectorAll(".nav-dropdown.dropdown-open").forEach(function (d) {
          d.classList.remove("dropdown-open");
          d.querySelector(".nav-dropdown-toggle").setAttribute("aria-expanded", "false");
        });
      });
    })();
