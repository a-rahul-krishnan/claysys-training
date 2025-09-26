let students = [];

function addStudent() {
  let name = document.getElementById("name").value.trim();
  let grade = parseFloat(document.getElementById("grade").value);

  if (name === "" || isNaN(grade)) {
    alert("Please enter a valid student name and numeric grade.");
    return;
  }
  if (grade < 0 || grade > 100) {
    alert("Grade must be between 0 and 100.");
    return;
  }

  students.push({ name: name, grade: grade });

  document.getElementById("name").value = "";
  document.getElementById("grade").value = "";

  alert("Student added successfully!");
}

function displayGrades() {
  let output = "";
  students.forEach((student, index) => {
    output += `${index + 1}. ${student.name} - ${student.grade}<br>`;
  });
  document.getElementById("list").innerHTML = output;
}

function calculateAvg() {
  if (students.length === 0) {
    alert("No students available to calculate average.");
    return;
  }

  let total = 0;
  students.forEach((student) => {
    total += student.grade;
  });

  let avg = total / students.length;

  document.getElementById("avg").innerHTML = avg;
}
