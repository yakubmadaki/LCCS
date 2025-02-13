const menuButton = document.querySelector('.menu');
const sidebar = document.querySelector('.sidebar');
const main = document.querySelector('.main');

menuButton.addEventListener('click', () => {
sidebar.classList.toggle('collapsed')
main.classList.toggle('collapsed');
});