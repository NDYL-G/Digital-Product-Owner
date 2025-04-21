document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const section = params.get("section") || "0";
  const contentDiv = document.getElementById("content");

  fetch(`../data/${section}.json`)
    .then((res) => res.json())
    .then((data) => {
      // Page title
      const title = document.createElement("h1");
      title.textContent = data.title;
      contentDiv.appendChild(title);

      // Optional subtitle (e.g., job title string)
      if (data.subtitle) {
        const subtitle = document.createElement("h2");
        subtitle.textContent = data.subtitle;
        contentDiv.appendChild(subtitle);
      }

      // Content handling
      if (Array.isArray(data.content)) {
        data.content.forEach((item) => {
          const card = document.createElement("div");
          card.className = "card";

          // Optional logo support
          if (item.logo) {
            const img = document.createElement("img");
            img.src = item.logo;
            img.alt = item.heading || item.company || "Logo";
            img.className = "card-logo";
            card.appendChild(img);
          }

          // Paragraph-only string
          if (typeof item === "string") {
            const p = document.createElement("p");
            p.textContent = item;
            card.appendChild(p);
          }

          // Heading + paragraph (skills, achievements, hobbies, education)
          else if (item.heading && item.text && !item.company) {
            const h3 = document.createElement("h3");
            h3.textContent = item.heading;
            const p = document.createElement("p");
            p.textContent = item.text;
            card.appendChild(h3);
            card.appendChild(p);
          }

          // Work experience-style block
          else if (item.company) {
            const h3 = document.createElement("h3");
            h3.textContent = item.company;

            const meta = document.createElement("p");
            meta.style.fontWeight = "bold";
            meta.textContent = [
              item.title || "",
              item.dates ? `(${item.dates})` : ""
            ]
              .filter(Boolean)
              .join(" ");

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
