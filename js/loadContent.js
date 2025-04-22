document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const section = params.get("section") || "0";
  const contentDiv = document.getElementById("content");

  fetch(`../data/${section}.json`)
    .then((res) => res.json())
    .then((data) => {
      // Page Title
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

          // === Plain string item (paragraph-only sections) ===
          if (typeof item === "string") {
            const p = document.createElement("p");
            p.textContent = item;
            card.appendChild(p);
            contentDiv.appendChild(card);
            return;
          }

          const row = document.createElement("div");
          row.className = "card-row";

          // === Logo (optional) ===
          if (item.logo) {
            const logoWrapper = document.createElement("div");
            logoWrapper.className = "card-logo-col";

            if (Array.isArray(item.logo)) {
              item.logo.forEach((src) => {
                const img = document.createElement("img");
                img.src = src;
                img.alt = item.company || item.heading || "Logo";
                img.className = "card-logo";
                logoWrapper.appendChild(img);
              });
            } else {
              const img = document.createElement("img");
              img.src = item.logo;
              img.alt = item.company || item.heading || "Logo";
              img.className = "card-logo";
              logoWrapper.appendChild(img);
            }

            row.appendChild(logoWrapper);
          }

          // === Content Column ===
          const contentWrapper = document.createElement("div");
          contentWrapper.className = "card-content-col";

          // Heading (company or generic)
          if (item.company || item.heading) {
            const h3 = document.createElement("h3");
            h3.textContent = item.company || item.heading;
            contentWrapper.appendChild(h3);
          }

          // Title (e.g. job role)
          if (item.title) {
            const role = document.createElement("p");
            role.className = "card-role";
            role.textContent = item.title;
            contentWrapper.appendChild(role);
          }

          // Dates
          if (item.dates) {
            const dates = document.createElement("p");
            dates.className = "card-dates";
            dates.textContent = item.dates;
            contentWrapper.appendChild(dates);
          }

          // Text block (supports both strings and arrays)
          const pBlock = document.createElement("div");

          if (Array.isArray(item.text)) {
            item.text.forEach((line) => {
              const p = document.createElement("p");
              p.textContent = line;
              pBlock.appendChild(p);
            });
          } else if (item.text) {
            const p = document.createElement("p");
            p.textContent = item.text;
            pBlock.appendChild(p);
          }

          contentWrapper.appendChild(pBlock);
          row.appendChild(contentWrapper);
          card.appendChild(row);
          contentDiv.appendChild(card);
        });
      }
    })
    .catch((err) => {
      contentDiv.innerHTML = "<p>Error loading content. Please try again later.</p>";
      console.error("JSON Load Error:", err);
    });
});
