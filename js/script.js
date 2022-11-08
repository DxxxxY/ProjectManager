let fieldset = document.getElementsByTagName("fieldset")[0]
let reset = document.getElementById('resetbutton');
let form = document.getElementsByTagName('form')[0];
let addButton = document.getElementById("Add");
let inputs = document.querySelectorAll(".entry>input, .entry>textarea, .entry>select");

reset.addEventListener("click", resetform, true);

const regex = {
    proj_id: /^[A-Za-z0-9 ]+$/,
    owner: /^[A-Za-z ]+$/,
    title: /^[A-Za-z0-9 ]+$/,
    category: /^[A-Za-z ]+$/,
    hours: /^[0-9]+$/,
    rate: /^[0-9]+$/,
    status: /^[A-Za-z ]+$/,
    shortdescription: /^[A-Za-z0-9 ]+$/,
}

//init project array
const projects = []

//input event loop
inputs.forEach(input => {
    let img = document.createElement('img')
    img.setAttribute('class', "wrong")
    img.setAttribute('id', input.id + "-img")
    img.setAttribute('src', "images/wrong.png")
    div = document.createElement('div')
    div.className = "imgwrap"
    div.appendChild(img)
    input.parentElement.appendChild(div)

    if (input.id == "shortdescription") {
        input.parentElement.children[0].appendChild(div);
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
    if (isInputValid(e)) {
        img.class = "correct";
        img.src = "images/right.png";
    } else {
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
    inputs.forEach(input => {
        if (!isInputValid(input)) {
            valid = false;
        }
    });

    //check for duplicate project id
    if (projects.find(p => p.proj_id === document.getElementById("proj_id").value)) {
        valid = false;
        document.getElementById("proj_id-img").src = "images/wrong.png";
        document.getElementById("proj_id-img").class = "wrong";

        //add error message
        if (document.getElementById('em-proj_id') == null) {
            errorMsg = document.createElement('p');
            errorMsg.setAttribute('id', 'em-proj_id');
            errorMsg.setAttribute('class', 'inputerror');
            errorMsg.textContent = "↑ Duplicate project id ↑";
            document.getElementById("proj_id").parentElement.parentElement.append(errorMsg);
        }
    }

    if (valid) {
        addButton.disabled = false;
        addButton.style.backgroundColor = "";
    } else {
        addButton.disabled = true;
        addButton.style.backgroundColor = "grey";
    }
}

function isInputValid(input) {
    return regex[input.id].test(input.value)
}


//write and overwrite local storage
const writeLocal = () => {
    if (projects.length < 1) return updateStatus("No projects to save")

    localStorage.setItem("data", JSON.stringify(projects))
    updateStatus(`Saved ${projects.length} projects`)
}

//add to local storage and keep previous
const appendLocal = () => {
    const local = JSON.parse(localStorage.getItem("data"))
    if (projects.length < 1) return updateStatus("No projects to append")
    if (!local || local.length < 1) return writeLocal()

    //write only new projects
    const toWrite = local.filter(project => !projects.find(proj => proj.proj_id === project.proj_id))
    toWrite.push(...projects)

    localStorage.setItem("data", JSON.stringify(toWrite))
    updateStatus(`Saved ${toWrite.length} projects`)
}

//clear local storage without clearing projects array
const clearLocal = () => {
    localStorage.clear()
    updateStatus("Cleared local storage")
}

//load projects from local storage and append to projects array
const loadLocal = () => {
    const local = JSON.parse(localStorage.getItem("data"))
    if (!local || local.length < 1) return updateStatus("No projects to load")

    //load only new projects
    const toLoad = local.filter(project => !projects.find(proj => proj.proj_id === project.proj_id))
    projects.push(...toLoad)

    //update table
    updateTable(projects)
    updateStatus(`Loaded ${toLoad.length} projects`)
}

const updateTable = projects => {
    //get table
    const table = document.querySelector("tbody")

    //set table to have projects rows
    table.innerHTML = projects.sort((a, b) => a.proj_id - b.proj_id).map(project => {
        return `<tr>
                    <td>${project.proj_id}</td>
                    <td>${project.owner}</td>
                    <td>${project.title}</td>
                    <td>${project.category}</td>
                    <td>${project.hours}</td>
                    <td>${project.rate}</td>
                    <td>${project.status}</td>
                    <td>${project.shortdescription}</td>
                    <td><img class="edit" src="images/edit.png" alt="edit" /></td>
                    <td><img class="trash" src="images/trash.png" alt="trash" /></td>
                </tr>`
    }).join("")

    //"clone" element to remove event listener (separate forEach because of async)
    document.querySelectorAll("img.trash, img.edit").forEach(button => {
        button.outerHTML = button.outerHTML
    })

    document.querySelectorAll("img.edit").forEach(edit => {
        edit.addEventListener("click", e => {
            //get table row matching proj_id
            const row = e.target.parentElement.parentElement

            //clone inputs from form above
            let inputs = Array.from(document.querySelectorAll(".entry>input, .entry>textarea, select")).map(input => input.cloneNode(true))

            //if row contains inputs, remove them and set td values to inputs
            if (row.children[0].children[0]) {
                //get inputs from row
                inputs = Array.from(row.children).map(td => td.children[0])

                //get updated project from inputs
                const updatedProject = Object.fromEntries(Array.from(inputs).map(input => [input.id, input.value]))

                //set row (update row)
                row.innerHTML = Array.from(row.children).filter(child => child.children[0].tagName != "IMG").map(td => {
                    return `<td>${td.children[0].value}</td>`
                }).join("") + `<td><img class="edit" src="images/edit.png" alt="edit" /></td>` + `<td><img class="trash" src="images/trash.png" alt="trash" /></td>`

                //get index of original project
                const index = projects.findIndex(project => project.proj_id == row.children[0].textContent)

                //set save icon to edit icon
                e.target.src = "images/edit.png"

                //update project
                return projects[index] = updatedProject
            }

            //set td values to inputs
            Array.from(row.children).forEach((td, i) => {
                if (!inputs[i]) return

                inputs[i].className = "edit"
                inputs[i].value = td.textContent

                td.textContent = ""
                td.appendChild(inputs[i])
            })

            //set edit icon to save icon
            e.target.src = "images/save.png"
        })
    })

    //add event listeners to remove the row from the table
    document.querySelectorAll("img.trash").forEach(trash => {
        trash.addEventListener("click", e => {
            if (!confirm("Are you sure you want to delete this project?")) return

            //get table row matching proj_id
            const row = e.target.parentElement.parentElement

            //remove project from projects array matching proj_id
            let index = projects.findIndex(project => project.proj_id == row.children[0].textContent)
            projects.splice(index, 1)

            //remove project from localstorage by proj_id and save
            const local = JSON.parse(localStorage.getItem("data"))
            index = local.findIndex(project => project.proj_id == row.children[0].textContent)
            local.splice(index, 1)
            localStorage.setItem("data", JSON.stringify(local))

            //remove row
            row.remove()
        })
    })
}

const getProjects = query => {
    //return all if query is empty
    if (!query) return projects

    //return projects from projects array that one of their properties contains query
    const queried = projects.filter(p => Object.values(p).find(v => v.toString().toLowerCase().includes(query)))
    updateStatus(`Query returned ${queried.length} projects for "${query}"`)
    return queried
}

const add = document.querySelector("#Add")

const write = document.querySelector("#write")
const append = document.querySelector("#append")
const clear = document.querySelector("#clear")
const load = document.querySelector("#load")

const query = document.querySelector("#query")

const status = document.querySelector(".status")

add.addEventListener("click", e => {
    //construct object from form inputs
    const project = Object.fromEntries(Array.from(inputs).map(input => [input.id, input.value]))

    //add to projects array
    projects.push(project)

    //update table
    updateTable(projects)
})

write.addEventListener("click", writeLocal)
append.addEventListener("click", appendLocal)
clear.addEventListener("click", clearLocal)
load.addEventListener("click", loadLocal)

query.addEventListener("input", () => {
    updateTable(getProjects(query.value))
})

const updateStatus = (msg) => {
    status.textContent = msg
}