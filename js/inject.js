document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const isRoot = path.endsWith("/") || path.endsWith("index.html");
  const base = isRoot ? "includes" : "../includes";

  const inject = (id, file) => {
    fetch(`${base}/${file}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${file} not found`);
        return res.text();
      })
      .then((html) => {
        document.getElementById(id).innerHTML = html;
      })
      .catch((err) => {
        console.error(`Injection failed for ${file}:`, err);
      });
  };

  inject("header", "header.html");
  inject("footer", "footer.html");
});
