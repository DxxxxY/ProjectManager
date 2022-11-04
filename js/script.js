let form = document.getElementsByTagName("form")[0]
let addButton = document.getElementById("Add");
let inputs = document.querySelectorAll(".entry>input, .entry>textarea, select");
alert(inputs.length);
inputs.forEach(input => {
    console.log(input)
    input.addEventListener("change", formValidation);
})

function formValidation() {
    if (!form.valid) {
        addButton.disabled = true;
        addButton.style.backgroundColor = "grey";
    }
}
//______________________________________________

//sample project array
const projects = [{
    proj_id: 1,
    owner: "John",
    title: "Project 1",
    category: "Category 1",
    hours: 10,
    rate: 100,
    status: "In Progress",
    description: "Simple description",
}]

const writeLocal = () => {
    //set (overwrite)
    localStorage.setItem("data", JSON.stringify(projects))

    console.log("written", projects)
}

const appendLocal = () => {
    const local = JSON.parse(localStorage.getItem("data"))

    //write only new projects
    let toWrite = local.filter(project => !projects.find(proj => proj.proj_id === project.proj_id))
    toWrite.push(...projects)

    localStorage.setItem("data", JSON.stringify(toWrite))

    console.log("appended", toWrite)
}

const clearLocal = () => {
    //clear
    localStorage.clear()

    console.log("cleared")
}

const loadLocal = () => {
    const local = JSON.parse(localStorage.getItem("data"))
    if (!local) return updateTable()

    //load only new projects
    let toLoad = local.filter(project => !projects.find(proj => proj.proj_id === project.proj_id))
    projects.push(...toLoad)

    console.log("loaded", projects)

    updateTable()
}

const updateTable = () => {
    //get table
    const table = document.querySelector("tbody")

    //set table to have projects rows
    table.innerHTML = projects.map(project => {
        return `<tr>
                    <td>${project.proj_id}</td>
                    <td>${project.owner}</td>
                    <td>${project.title}</td>
                    <td>${project.category}</td>
                    <td>${project.hours}</td>
                    <td>${project.rate}</td>
                    <td>${project.status}</td>
                    <td>${project.description}</td>
                    <td><img class="edit" src="images/edit.png" alt="edit" /></td>
                    <td><img class="trash" src="images/trash.png" alt="trash" /></td>
                </tr>`
    }).join("")
}

const write = document.querySelector("#write")
const append = document.querySelector("#append")
const clear = document.querySelector("#clear")
const load = document.querySelector("#load")

write.addEventListener("click", writeLocal)
append.addEventListener("click", appendLocal)
clear.addEventListener("click", clearLocal)
load.addEventListener("click", loadLocal)