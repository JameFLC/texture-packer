"use strict";
const swappTheme = function () {
    const body = document.getElementById("body");
    if (getTheme() == "dark")
        setTheme("light");
    else
        setTheme("dark");
};
const getTheme = function () {
    const body = document.getElementById("body");
    return body.getAttribute("theme") || "light";
};
const setTheme = function (theme) {
    const body = document.getElementById("body");
    body.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
};
// Swapp theme when pressing alt+t
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "t" && e.altKey) {
        swappTheme();
    }
});
