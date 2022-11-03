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
