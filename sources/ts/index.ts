const swappTheme = function (): void {
  const body = document.getElementById("body") as HTMLBodyElement;
  if (getTheme() == "dark") setTheme("light");
  else setTheme("dark");
};

const getTheme = function () {
  const body = document.getElementById("body") as HTMLBodyElement;
  return body.getAttribute("theme") || "light";
};

const setTheme = function (theme: string): void {
  const body = document.getElementById("body") as HTMLBodyElement;
  body.setAttribute("theme", theme);
  localStorage.setItem("theme", theme);
};

// Swapp theme when pressing alt+t
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "t" && e.altKey) {
    swappTheme();
  }
});
