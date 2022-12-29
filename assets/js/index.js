"use strict";
const body = document.getElementById("body");
const swappTheme = function () {
    if (getTheme() == "dark")
        setTheme("light");
    else
        setTheme("dark");
};
const getTheme = function () {
    return body.getAttribute("theme") || "light";
};
const setTheme = function (theme) {
    body.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
};
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "t" && e.altKey) {
        swappTheme();
    }
});
