//______________________________________________

//sample project array
const projects = [{
    proj_id: 1,
    name: "John",
    age: 30,
    city: "New York"
}]

const writeLocal = () => {
    localStorage.setItem("data", JSON.stringify(projects))
    console.log("written", projects)
}

const appendLocal = () => {
    const local = JSON.parse(localStorage.getItem("data"))

    let toWrite = local.filter(project => !projects.find(proj => proj.proj_id === project.proj_id))
    toWrite.push(...projects)

    localStorage.setItem("data", JSON.stringify(toWrite))
    console.log("appended", toWrite)
}

const clearLocal = () => {
    localStorage.clear()
    console.log("cleared")
}

const loadLocal = () => {
    const local = JSON.parse(localStorage.getItem("data"))

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