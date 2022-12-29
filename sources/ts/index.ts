const body = document.getElementById("body") as HTMLBodyElement;

const swappTheme = function (): void {
  if (getTheme() == "dark") setTheme("light");
  else setTheme("dark");
};

const getTheme = function () {
  return body.getAttribute("theme") || "light";
};

const setTheme = function (theme: string): void {
  body.setAttribute("theme", theme);
  localStorage.setItem("theme", theme);
};

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "t" && e.altKey) {
    swappTheme();
  }
});
