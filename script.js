
let applications = JSON.parse(
  localStorage.getItem("applications") || "[]"
);

let skills = JSON.parse(
  localStorage.getItem("skills") || "[]"
);

let interviews = JSON.parse(
  localStorage.getItem("interviews") || "[]"
);

function updateDashboard() {
  document.getElementById("applications").textContent =
    applications.length;

  document.getElementById("skills").textContent =
    skills.length;

  document.getElementById("interviews").textContent =
    interviews.length;

  document.getElementById("status").textContent =
    applications.length === 0
      ? "Your placement journey starts here!"
      : `You are tracking ${applications.length} job application(s). Keep going!`;

  const averageProgress = skills.length === 0
    ? 0
    : Math.round(
        skills.reduce((total, skill) => total + skill.progress, 0)
        / skills.length
      );

  const progressElement = document.getElementById("averageProgress");

  if (progressElement) {
    progressElement.textContent = averageProgress + "%";
  }
}


function saveData() {
  localStorage.setItem("applications", JSON.stringify(applications));
  localStorage.setItem("skills", JSON.stringify(skills));
  localStorage.setItem("interviews", JSON.stringify(interviews));

  updateDashboard();
}

updateDashboard();

const applicationForm = document.getElementById("applicationForm");
const applicationList = document.getElementById("applicationList");


function displayApplications() {
  const searchText = document.getElementById("applicationSearch").value.trim().toLowerCase();
  const selectedStatus = document.getElementById("applicationFilter").value;
  applicationList.replaceChildren();

  const filteredApplications = applications.filter(function (app) {
    const matchesSearch =
      app.company.toLowerCase().includes(searchText) ||
      app.role.toLowerCase().includes(searchText);

    const matchesStatus =
      selectedStatus === "All" || app.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  if (filteredApplications.length === 0) {
    applicationList.textContent = "No matching applications found.";
    return;
  }

  filteredApplications.forEach(function (app) {
    const item = document.createElement("div");
    item.style.padding = "12px";
    item.style.margin = "10px 0";
    item.style.background = "#f4f6fb";
    item.style.borderRadius = "8px";

    const title = document.createElement("strong");
    title.textContent = app.company + " — " + app.role;

    const status = document.createElement("p");
    status.textContent = "Status: " + app.status;
    

// Add the new code below
const deadlineText = document.createElement("p");

if (app.deadline) {
  deadlineText.textContent = "Deadline: " + app.deadline;
} else {
  deadlineText.textContent = "Deadline: Not set";
}

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      const index = applications.indexOf(app);
      if (index !== -1) {
        applications.splice(index, 1);
        saveData();
        displayApplications();
      }
    });

    
item.append(title, status, deadlineText, deleteButton);

    applicationList.appendChild(item);
  });
}


applicationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const company = document.getElementById("company").value.trim();
  const role = document.getElementById("role").value.trim();
  const status = document.getElementById("appStatus").value;

const deadline = document.getElementById("appDeadline").value;

  if (!company || !role) {
    alert("Please enter the company name and job role.");
    return;
  }

  applications.push({
    company: company,
    role: role,
    status: status,
    deadline: deadline
  });

  saveData();
  displayApplications();

  applicationForm.reset();

  alert("Job application added successfully!");
});

function deleteApplication(index) {
  applications.splice(index, 1);
  saveData();
  displayApplications();
}

displayApplications();

document.getElementById("applicationSearch").addEventListener("input", displayApplications);

document.getElementById("applicationFilter").addEventListener("change", displayApplications);

const eligibilityForm = document.getElementById("eligibilityForm");

eligibilityForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const percentage = Number(
    document.getElementById("percentage").value
  );

  const minPercentage = Number(
    document.getElementById("minPercentage").value
  );

  const backlogs = Number(
    document.getElementById("backlogs").value
  );

  const maxBacklogs = Number(
    document.getElementById("maxBacklogs").value
  );

  const result = document.getElementById("eligibilityResult");

  if (
    percentage < 0 || percentage > 100 ||
    minPercentage < 0 || minPercentage > 100 ||
    backlogs < 0 || !Number.isInteger(backlogs) ||
    maxBacklogs < 0 || !Number.isInteger(maxBacklogs)
  ) {
    result.textContent = "Please enter valid values.";
    result.style.color = "red";
    return;
  }

  if (
    percentage >= minPercentage &&
    backlogs <= maxBacklogs
  ) {
    result.textContent =
      "Congratulations! You meet these eligibility criteria.";
    result.style.color = "green";
  } else {
    result.textContent =
      "You do not meet these eligibility criteria yet.";
    result.style.color = "red";
  }
});

const skillForm = document.getElementById("skillForm");
const skillList = document.getElementById("skillList");


function displaySkills() {
  const skillList = document.getElementById("skillList");
  skillList.replaceChildren();

  skills.forEach(function (skill, index) {
    const item = document.createElement("div");
    item.style.padding = "12px";
    item.style.margin = "10px 0";
    item.style.background = "#f4f6fb";
    item.style.borderRadius = "8px";

    const title = document.createElement("strong");
    title.textContent = skill.name + " - " + skill.progress + "%";

    const progressBar = document.createElement("progress");
    progressBar.value = skill.progress;
    progressBar.max = 100;
    progressBar.style.width = "100%";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.style.marginTop = "8px";

    deleteButton.addEventListener("click", function () {
      skills.splice(index, 1);
      saveData();
      displaySkills();
    });

    item.append(title, progressBar, deleteButton);
    skillList.appendChild(item);
  });
}

skillForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("skillName").value;
  const progress = Number(
    document.getElementById("skillProgress").value
  );

  if (!name || progress < 0 || progress > 100) {
    alert("Please enter a valid skill and progress.");
    return;
  }

  const existingSkill = skills.find(function (skill) {
    return skill.name === name;
  });

  if (existingSkill) {
    existingSkill.progress = progress;
  } else {
    skills.push({
      name: name,
      progress: progress
    });
  }

  saveData();
  displaySkills();
  skillForm.reset();
});

displaySkills();

function displayInterviews() {
  interviewList.innerHTML = "";

  interviews.forEach(function (interview, index) {
    const item = document.createElement("div");

    item.style.padding = "12px";
    item.style.margin = "10px 0";
    item.style.background = "#f4f6fb";
    item.style.borderRadius = "8px";

    const title = document.createElement("strong");
    title.textContent = interview.company;

    const date = document.createElement("p");
    date.textContent = "Date: " + interview.date;

    const status = document.createElement("p");
    status.textContent = "Status: " + interview.status;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      interviews.splice(index, 1);
      saveData();
      displayInterviews();
    });

    item.appendChild(title);
    item.appendChild(date);
    item.appendChild(status);
    item.appendChild(deleteButton);

    interviewList.appendChild(item);
  });
}

interviewForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const company = document
    .getElementById("interviewCompany").value.trim();

  const date = document.getElementById("interviewDate").value;

  const status = document.getElementById("interviewStatus").value;

  if (!company || !date) {
    alert("Please enter the company name and interview date.");
    return;
  }

  interviews.push({
    company: company,
    date: date,
    status: status
  });

  saveData();
  displayInterviews();
  interviewForm.reset();
});

displayInterviews();


const resumeForm = document.getElementById("resumeForm");
const resumeFile = document.getElementById("resumeFile");
const resumeTitle = document.getElementById("resumeTitle");
const resumeList = document.getElementById("resumeList");
const resumeMessage = document.getElementById("resumeMessage");

let resumeDB;

const dbRequest = indexedDB.open("PlacementManagementDB", 1);

dbRequest.onupgradeneeded = function (event) {
  const db = event.target.result;

  if (!db.objectStoreNames.contains("resumes")) {
    db.createObjectStore("resumes", {
      keyPath: "id",
      autoIncrement: true
    });
  }
};

dbRequest.onsuccess = function (event) {
  resumeDB = event.target.result;
  displayResumes();
};

dbRequest.onerror = function () {
  resumeMessage.textContent =
    "Could not open resume storage. Please try again.";
};

function displayResumes() {
  if (!resumeDB) return;

  resumeList.replaceChildren();

  const transaction = resumeDB.transaction("resumes", "readonly");
  const store = transaction.objectStore("resumes");
  const request = store.getAll();

  request.onsuccess = function () {
    request.result.forEach(function (resume) {
      const item = document.createElement("div");
      item.style.padding = "12px";
      item.style.margin = "10px 0";
      item.style.background = "#f4f6fb";
      item.style.borderRadius = "8px";

      const title = document.createElement("strong");
      title.textContent = resume.title;

      const fileName = document.createElement("p");
      fileName.textContent = resume.fileName;

      const openButton = document.createElement("button");
      openButton.type = "button";
      openButton.textContent = "Open PDF";

      openButton.addEventListener("click", function () {
        const blob = new Blob([resume.file], {
          type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);
        const tab = window.open(url, "_blank");

        if (!tab) {
          URL.revokeObjectURL(url);
          alert("Allow pop-ups to open your resume.");
          return;
        }

        setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 60000);
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.style.marginLeft = "8px";

      deleteButton.addEventListener("click", function () {
        const tx = resumeDB.transaction("resumes", "readwrite");
        tx.objectStore("resumes").delete(resume.id);

        tx.oncomplete = function () {
          resumeMessage.textContent = "Resume deleted.";
          displayResumes();
        };
      });

      item.append(title, fileName, openButton, deleteButton);
      resumeList.appendChild(item);
    });
  };
}

resumeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!resumeDB) {
    resumeMessage.textContent = "Resume storage is still loading.";
    return;
  }

  const file = resumeFile.files[0];

  if (!file) {
    resumeMessage.textContent = "Please choose a PDF file.";
    return;
  }

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    resumeMessage.textContent = "Please select a PDF file.";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    resumeMessage.textContent = "Please select a PDF smaller than 5 MB.";
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const transaction = resumeDB.transaction("resumes", "readwrite");

    transaction.objectStore("resumes").add({
      title: resumeTitle.value.trim(),
      fileName: file.name,
      file: reader.result
    });

    transaction.oncomplete = function () {
      resumeMessage.textContent = "Resume uploaded successfully!";
      resumeForm.reset();
      displayResumes();
    };

    transaction.onerror = function () {
      resumeMessage.textContent =
        "Upload failed. Browser storage may be full.";
    };
  };

  reader.onerror = function () {
    resumeMessage.textContent = "Could not read the selected file.";
  };

  reader.readAsArrayBuffer(file);
});

const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("placementTheme") === "light") {
  document.body.classList.add("light-theme");
}

function updateThemeButton() {
  const isLight = document.body.classList.contains("light-theme");

  themeToggle.textContent = isLight
    ? "🌙 Switch to Dark Mode"
    : "☀️ Switch to Light Mode";
}

updateThemeButton();

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("light-theme");

  const theme = document.body.classList.contains("light-theme")
    ? "light"
    : "dark";

  localStorage.setItem("placementTheme", theme);
  updateThemeButton();
});
