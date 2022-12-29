const swappTheme = function (): void {
  const body = document.getElementById("body") as HTMLBodyElement;
  if (getTheme() == "dark") setTheme("light");
  else setTheme("dark");
  updatePageTheme();
};

const updatePageTheme = function () {
  // Update
  const body = document.getElementById("body") as HTMLBodyElement;
  body.setAttribute("theme", getTheme());
};

const getTheme = function (): string {
  // Het the stored theme or the prefered default theme
  return localStorage.getItem("theme") || (isDarkClient() ? "dark" : "light");
};

const isDarkClient = function (): boolean {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

const setTheme = function (theme: string): void {
  localStorage.setItem("theme", theme);
};

// Swapp theme when pressing alt+t
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "t" && e.altKey) {
    swappTheme();
  }
});

window.onload = function () {
  const theme = getTheme();
  setTheme(theme);
  updatePageTheme();
  setTimeout(function () {
    const noTransition = document.getElementsByClassName("no-transitions")[0];
    noTransition.classList.remove("no-transitions");
  }, 10);
};
