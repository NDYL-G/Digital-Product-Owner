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

      // Optional subtitle (e.g. professional headline)
      if (data.subtitle) {
        const subtitle = document.createElement("h2");
        subtitle.textContent = data.subtitle;
        contentDiv.appendChild(subtitle);
      }

      // Smart rendering based on structure
      if (Array.isArray(data.content)) {
        data.content.forEach((item) => {
          const card = document.createElement("div");
          card.className = "card";

          // Text-only (like a paragraph or hobby)
          if (typeof item === "string") {
            const p = document.createElement("p");
            p.textContent = item;
            card.appendChild(p);
          }

          // Skill-style: heading + text
          else if (item.heading && item.text && !item.company) {
            const h3 = document.createElement("h3");
            h3.textContent = item.heading;
            const p = document.createElement("p");
            p.textContent = item.text;
            card.appendChild(h3);
            card.appendChild(p);
          }

          // Work Experience-style
          else if (item.company) {
            const h3 = document.createElement("h3");
            h3.textContent = item.company;
            const meta = document.createElement("p");
            meta.style.fontWeight = "bold";
            meta.textContent = `${item.title || ""}${item.title && item.dates ? " | " : ""}${item.dates || ""}`;
            const p = document.createElement("p");
            p.textContent = item.text;
            card.appendChild(h3);
            if (meta.textContent.trim()) card.appendChild(meta);
            card.appendChild(p);
          }

          contentDiv.appendChild(card);
        });
      }
    })
    .catch((err) => {
      contentDiv.innerHTML = "<p>Error loading content. Please try again later.</p>";
      console.error("JSON Load Error:", err);
    });
});
