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

document.querySelectorAll(".edit").forEach(edit => {
    console.log(edit)

})

//sample project array
const projects = []

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

    document.querySelector("img.edit:last-child").addEventListener("click", e => {
        console.log("edit")

        //get table row matching proj_id
        const row = e.target.parentElement.parentElement

        //get project from projects array matching proj_id
        // const project = projects.find(project => project.proj_id === row.children[0].textContent)

        //clone inputs from form above
        let inputs = Array.from(document.querySelectorAll(".entry>input, .entry>textarea, select")).map(input => input.cloneNode(true))

        console.log(inputs)

        //set td values to inputs
        // console.log(row.children)

        //if row contains inputs, remove them and set td values to inputs
        if (row.children[0].children[0]) {
            inputs = Array.from(row.children).map(td => td.children[0])

            const updatedProject = Object.fromEntries(Array.from(inputs).map(input => [input.id, input.value]))

            inputs.forEach(input => {
                console.log(input)
            })

            row.innerHTML = Array.from(row.children).filter(child => child.children[0].tagName != "IMG").map((td, i) => {
                return `<td>${td.children[0].value}</td>`
            }).join("") + `<td><img class="edit" src="images/edit.png" alt="edit" /></td>` + `<td><img class="trash" src="images/trash.png" alt="trash" /></td>`

            //update project in projects
            const index = projects.findIndex(project => project.proj_id == row.children[0].textContent)

            projects.forEach(proj => {
                console.log(row.children[0])
                console.log(proj.proj_id, row.children[0].textContent)
                console.log(proj.proj_id == row.children[0].textContent)
            })

            console.log(projects[index])

            // projects[index] = Object.fromEntries(Array.from(row.children).map(td => {
            //     console.log(td.children[0])
            //         // console.log([td.children[0].id, td.children[0].value])

            // }))

            // projects[index] = Array.from(row.children).forEach(td => {
            //     console.log(td)
            //         // console.log([td.children[0].id, td.children[0].value])

            // })

            projects[index] = updatedProject

            return
        }

        Array.from(row.children).forEach((td, i) => {
            if (!inputs[i]) return

            inputs[i].className = "edit"
            inputs[i].value = td.textContent

            td.textContent = ""
            td.appendChild(inputs[i])
        })
    })
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