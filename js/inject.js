document.addEventListener("DOMContentLoaded", () => {
  const pageIsRoot = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
  const basePath = pageIsRoot ? "includes" : "../includes";

  const inject = (id, file) => {
    fetch(`${basePath}/${file}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${file} not found`);
        return res.text();
      })
      .then((html) => {
        // adjust link paths dynamically
        const adjustedHtml = html.replace(/href="(?!http)(.*?)"/g, (match, p1) => {
          const adjustedPath = pageIsRoot ? p1 : `../${p1}`;
          return `href="${adjustedPath}"`;
        }).replace(/src="(?!http)(.*?)"/g, (match, p1) => {
          const adjustedPath = pageIsRoot ? p1 : `../${p1}`;
          return `src="${adjustedPath}"`;
        });

        document.getElementById(id).innerHTML = adjustedHtml;
      })
      .catch((err) => {
        console.error(`Failed to load ${file}:`, err);
      });
  };

  inject("header", "header.html");
  inject("footer", "footer.html");
});
