const monuments = document.querySelector("#monuments-list");
const form = document.querySelector("#add-monument");
function render(doc) {
	let li = document.createElement("li");
	let name = document.createElement("span");
	let city = document.createElement("span");
	let cross = document.createElement("div");
	cross.innerText = "x";

	li.setAttribute("data-id", doc.id);
	name.textContent = doc.data().name;
	city.textContent = doc.data().city;
	li.appendChild(name);
	li.appendChild(city);
	li.appendChild(cross);
	monuments.appendChild(li);

	cross.addEventListener("click", (e) => {
		e.stopPropagation();
		const id = e.target.parentElement.getAttribute("data-id");
		db.collection("monuments").doc(id).delete();
	});
}
// db.collection("monuments")
// 	.orderBy("name")
// 	.get()
// 	.then((snapshot) => {
// 		snapshot.docs.forEach((doc) => {
// 			render(doc);
// 		});
// 	});

//create
form.addEventListener("submit", (e) => {
	e.preventDefault();
	db.collection("monuments").add({
		name: form.name.value,
		city: form.city.value,
	});
	form.name.value = "";
	form.city.value = "";
});
//real time listener

db.collection("monuments")
	.orderBy("city")
	.onSnapshot((snapshot) => {
		let changes = snapshot.docChanges();
		changes.forEach((change) => {
			if (change.type == "added") {
				render(change.doc);
			} else if (change.type == "removed") {
				let li = monuments.querySelector("[data-id=" + change.doc.id + "]");
				monuments.removeChild(li);
			}
		});
	});
//update on console
//db.collection("monuments").doc('id')
//.update({name:<new name>})
