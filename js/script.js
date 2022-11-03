let form = document.getElementsByTagName("form")[0]
let addButton = document.getElementById("Add");
let inputs = document.querySelectorAll(".entry>input, .entry>textarea, select" );
alert(inputs.length);   
inputs.forEach(input => {
        console.log(input)
    input.addEventListener("change", formValidation);
})

function formValidation(){
    if(!form.valid)
    {
        addButton.disabled =true;
        addButton.style.backgroundColor = "grey";
    }
}
//______________________________________________

//sample project array
const projects = [{
    proj_id: 1,
    name: "John",
    age: 30,
    city: "New York"
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

    //load only new projects
    let toLoad = local.filter(project => !projects.find(proj => proj.proj_id === project.proj_id))
    projects.push(...toLoad)

    console.log("loaded", projects)
}

const write = document.querySelector("#write")
const append = document.querySelector("#append")
const clear = document.querySelector("#clear")
const load = document.querySelector("#load")

write.addEventListener("click", writeLocal)
append.addEventListener("click", appendLocal)
clear.addEventListener("click", clearLocal)
load.addEventListener("click", loadLocal)
