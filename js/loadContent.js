document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const section = params.get("section") || "0";
  const target = document.getElementById("content");

  fetch(`../data/${section}.json`)
    .then(response => response.json())
    .then(data => {
      const title = document.createElement("h1");
      title.textContent = data.title;
      target.appendChild(title);

      if (data.subtitle) {
        const subtitle = document.createElement("h2");
        subtitle.textContent = data.subtitle;
        target.appendChild(subtitle);
      }

      data.content.forEach(text => {
        const p = document.createElement("p");
        if (text.startsWith("---")) {
          const hr = document.createElement("hr");
          target.appendChild(hr);
        } else {
          p.textContent = text;
          target.appendChild(p);
        }
      });
    })
    .catch(error => {
      target.innerHTML = "<p>Error loading content. Please try again later.</p>";
      console.error("Failed to load JSON:", error);
    });
});
