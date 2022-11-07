let fieldset = document.getElementsByTagName("fieldset")[0]
let reset = document.getElementById('resetbutton');
let form = document.getElementsByTagName('form')[0];
let addButton = document.getElementById("Add");
let inputs = document.querySelectorAll(".entry>input, .entry>textarea, select");

reset.addEventListener("click", resetform, true);

//input event loop
inputs.forEach(input => {
    let img = document.createElement('img')
    img.setAttribute('class', "wrong")
    img.setAttribute('id', input.id + "-img")
    img.setAttribute('src', "images/wrong.png")
    div = document.createElement('div')
    div.appendChild(img)
    input.parentElement.appendChild(div)

    if (input.id == "shortdescription") {
        input.parentElement.insertBefore(div, input);
    }
    input.addEventListener("input", formValidation);
    formValidation(input);
})

//handler
function formValidation(e) {
    if (e.target != null) { e = e.target; }
    if (document.getElementById('em-' + e.id) != null) {
        document.getElementById('em-' + e.id).remove();
    }
    let img = document.getElementById(e.id + "-img");
    if (e.validity.valid) {
        img.class = "correct";
        img.src = "images/right.png";
    } else if (!e.validity.valid) {
        img.class = 'wrong';
        img.src = "images/wrong.png";
        errorMsg = document.createElement('p');
        errorMsg.setAttribute('id', 'em-' + e.id);
        errorMsg.setAttribute('class', 'inputerror');
        errorMsg.textContent = "↑ Incorrect format for " + e.id + " ↑";
        e.parentElement.parentElement.append(errorMsg);
    }
    formvalid();
}

//reset button handler
function resetform(e) {
    form.reset();
    inputs.forEach(element => {
        formValidation(element);
    });
}

//check if form inputs all valid
function formvalid() {
    valid = true
    inputs.forEach(element => {
        if (!element.validity.valid) {
            valid = false;
        }
    });
    if (valid) {
        addButton.disabled = false;
        addButton.style.backgroundColor = "";
    } else {
        addButton.disabled = true;
        addButton.style.backgroundColor = "grey";
    }
}
//______________________________________________

const add = document.querySelector("#Add")
add.addEventListener("click", e => {
    const project = Object.fromEntries(Array.from(inputs).map(input => [input.id, input.value]))
    projects.push(project)
    updateTable(projects)
    console.log(project)
})

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
    if (!local) return updateTable(projects)

    //load only new projects
    let toLoad = local.filter(project => !projects.find(proj => proj.proj_id === project.proj_id))
    projects.push(...toLoad)

    console.log("loaded", projects)

    updateTable(projects)
}

const updateTable = projects => {
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

const getProjects = query => {
    //return all if query is empty
    if (!query) return projects

    //return projects from projects array that one of their properties contains query
    return projects.filter(project => {
        for (const property in project) {
            if (project[property].toString().toLowerCase().includes(query.toLowerCase())) return true
        }
    })
}

const write = document.querySelector("#write")
const append = document.querySelector("#append")
const clear = document.querySelector("#clear")
const load = document.querySelector("#load")

const query = document.querySelector("#query")

write.addEventListener("click", writeLocal)
append.addEventListener("click", appendLocal)
clear.addEventListener("click", clearLocal)
load.addEventListener("click", loadLocal)

query.addEventListener("input", () => {
    updateTable(getProjects(query.value))
})