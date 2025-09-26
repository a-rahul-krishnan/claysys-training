// Array to store student objects
let students = [];

// Function to add student
function addStudent() {
    let name = document.getElementById("p").value.trim();
    let grade = parseFloat(document.getElementById("n").value);

    // Validation
    if (name === "" || isNaN(grade)) {
        alert("Please enter a valid student name and numeric grade.");
        return;
    }
    if (grade < 0 || grade > 100) {
        alert("Grade must be between 0 and 100.");
        return;
    }

    // Add to array
    students.push({ name: name, grade: grade });

    // Clear input fields
    document.getElementById("p").value = "";
    document.getElementById("n").value = "";

    alert("Student added successfully!");
}

// Function to display all grades
function displayGrades() {
    let output = "";
    students.forEach((student, index) => {
        output += `${index + 1}. ${student.name} - ${student.grade}<br>`;
    });
    document.getElementById("list").innerHTML = output;
}

// Function to calculate average grade
function calculateAvg() {
    if (students.length === 0) {
        alert("No students available to calculate average.");
        return;
    }

    let total = students.reduce((sum, student) => sum + student.grade, 0);
    let avg = (total / students.length).toFixed(2);

    document.getElementById("avg").innerText = avg;
}
