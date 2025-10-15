const resultTable=document.getElementById("result-table");

function add(){
    let userName=document.getElementById("name").value;
    let dob=document.getElementById("dob").value;
    let gender=document.getElementById("gender").value;

    let row = document.createElement("tr");
    let userShell=document.createElement("td");
    userShell.textContent=userName;
    
    let dobShell=document.createElement("td");
    dobShell.textContent=dob;

    let genderShell=document.createElement("td");
    genderShell.textContent=gender;

    let actionShell=document.createElement("td");
    let editBtn=document.createElement("button");
    editBtn.textContent="Edit";
    editBtn.classList="edit-btn";
    let deleteBtn=document.createElement("button");
    deleteBtn.textContent="Delete";
    deleteBtn.classList="delete-btn";
    actionShell.appendChild(editBtn);
    actionShell.appendChild(deleteBtn);

    row.appendChild(userShell);
    row.appendChild(dobShell);
    row.appendChild(genderShell);
    row.appendChild(actionShell);

    resultTable.appendChild(row);

    document.getElementById("name").value="";
    document.getElementById("dob").value="";
    document.getElementById("gender").value="";


}

document.addEventListener("click",(e) => {
    if(e.target.className=="delete-btn"){
        e.target.closest("tr").remove();
        
    }

    if(e.target.className=="edit-btn"){
        let ctarget=e.target.closest("tr");
        document.getElementById("name").value=ctarget.cells[0].textContent;
        document.getElementById("dob").value=ctarget.cells[1].textContent;
        document.getElementById("gender").value=ctarget.cells[2].textContent;

        e.target.closest("tr").remove();


    }


});