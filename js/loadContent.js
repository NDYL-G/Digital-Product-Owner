document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const section = params.get("section") || "0";
  const contentDiv = document.getElementById("content");

  fetch(`../data/${section}.json`)
    .then((res) => res.json())
    .then((data) => {
      // Title
      const title = document.createElement("h1");
      title.textContent = data.title;
      contentDiv.appendChild(title);

      // Optional subtitle
      if (data.subtitle) {
        const subtitle = document.createElement("h2");
        subtitle.textContent = data.subtitle;
        contentDiv.appendChild(subtitle);
      }

      if (Array.isArray(data.content)) {
        data.content.forEach((item) => {
          const card = document.createElement("div");
          card.className = "card";

          // Structured layout for experience sections
          if (item.company) {
            const row = document.createElement("div");
            row.className = "card-row";

            // Logo column
            if (item.logo) {
              const logoWrapper = document.createElement("div");
              logoWrapper.className = "card-logo-col";

              const img = document.createElement("img");
              img.src = Array.isArray(item.logo) ? item.logo[0] : item.logo;
              img.alt = item.company || "Logo";
              img.className = "card-logo";

              logoWrapper.appendChild(img);
              row.appendChild(logoWrapper);
            }

            // Content column
            const contentWrapper = document.createElement("div");
            contentWrapper.className = "card-content-col";

            const h3 = document.createElement("h3");
            h3.textContent = item.company;
            contentWrapper.appendChild(h3);

            if (item.title) {
              const role = document.createElement("p");
              role.className = "card-role";
              role.textContent = item.title;
              contentWrapper.appendChild(role);
            }

            if (item.dates) {
              const dates = document.createElement("p");
              dates.className = "card-dates";
              dates.textContent = item.dates;
              contentWrapper.appendChild(dates);
            }

            const pBlock = document.createElement("div");
            if (Array.isArray(item.text)) {
              item.text.forEach((line) => {
                const p = document.createElement("p");
                p.textContent = line;
                pBlock.appendChild(p);
              });
            } else {
              const p = document.createElement("p");
              p.textContent = item.text;
              pBlock.appendChild(p);
            }

            contentWrapper.appendChild(pBlock);
            row.appendChild(contentWrapper);
            card.appendChild(row);
            contentDiv.appendChild(card);
            return;
          }

          // Standard card with heading and text
          if (item.heading && item.text) {
            if (item.logo) {
              if (Array.isArray(item.logo)) {
                const logoRow = document.createElement("div");
                logoRow.className = "card-logos";
                item.logo.forEach((src) => {
                  const img = document.createElement("img");
                  img.src = src;
                  img.alt = item.heading || "Logo";
                  img.className = "card-logo";
                  logoRow.appendChild(img);
                });
                card.appendChild(logoRow);
              } else {
                const img = document.createElement("img");
                img.src = item.logo;
                img.alt = item.heading || "Logo";
                img.className = "card-logo";
                card.appendChild(img);
              }
            }

            const h3 = document.createElement("h3");
            h3.textContent = item.heading;
            card.appendChild(h3);

            const p = document.createElement("p");
            p.textContent = item.text;
            card.appendChild(p);

            contentDiv.appendChild(card);
            return;
          }

          // Fallback: treat as plain paragraph
          if (typeof item === "string") {
            const p = document.createElement("p");
            p.textContent = item;
            card.appendChild(p);
            contentDiv.appendChild(card);
          }
        });
      }
    })
    .catch((err) => {
      contentDiv.innerHTML = "<p>Error loading content. Please try again later.</p>";
      console.error("JSON Load Error:", err);
    });
});
