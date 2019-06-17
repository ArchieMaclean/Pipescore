// User Interface (menu updates)

window.onload = function() {
const titles = [...document.querySelectorAll(".menu-title")];

titles.forEach(title => {
	title.addEventListener('click',()=>{
		const id=title.id.replace('-title','');
		const el=document.getElementById(id);
		titles.forEach(men=>men.classList.remove('viewing'));
		[...document.querySelectorAll('.menu')].forEach(men=>men.classList.remove('viewing'));
		title.classList.toggle('viewing');
		el.classList.toggle('viewing');
	});
});
}
