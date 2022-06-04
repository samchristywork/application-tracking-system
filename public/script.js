const urlParams = new URLSearchParams(window.location.search)

const jobItems = document.querySelector('#job-items')
const jobPane = document.querySelector('.right-job-pane')

let jobs = {}

let prefix="/application-tracking-system/";

function change (id, key) {
  const value = prompt('hi')
  jobs[id][key] = value
  displayJob(id)
}

function save () {
  let currentJobId = urlParams.get('job')
  jobs[currentJobId].notes = document.querySelector("#notes").value
  jobs[currentJobId].description = document.querySelector("#description").value

  fetch(prefix+'save', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobs)
    })
    .then(x => x.text())
    .then(y => {
      console.log(y);
    });
}

function add_cover_letter (id) {
}

function add_resume (id) {
}

function displayJob (id) {
  window.history.pushState('', '', prefix+`?job=${id}`)
  const job = jobs[id]
  const html = `
  <h1 onclick='change("${id}", "title")'>${job.title}</h1>
  <h2 onclick='change("${id}", "company")'>${job.company}</h2>
  <h3 onclick='change("${id}", "date_submitted")'>${job.date_submitted}</h3>
  <h3 onclick='change("${id}", "status")'>${job.status}</h3>
  <p>Notes:      <br><textarea id=notes rows=10 cols=20></textarea></p>
  <p>Description:<br><textarea id=description rows=10 cols=20></textarea></p>
  <p  onclick='change("${id}", "some_other_attribute")'>${job.some_other_attribute}</p>
  <button onclick='add_cover_letter("${id}")'>Add Cover Letter</button>
  <button onclick='add_resume("${id}")'>Add Résumé</button>
  <br>
  <button onclick='save()'>Save</button>
  `
  jobPane.innerHTML = html
  let notes = document.querySelector("#notes");
  let description = document.querySelector("#description");

  if(job.notes){
    notes.value=job.notes;
  }
  if(job.description){
    description.value=job.description;
  }
}

function addApplication () {
  const id = btoa(Math.random()).substring(0, 12)
  jobs[id] = {
    title: 'Default Title',
    company: 'Default Company',
    date_submitted: 'Default Date',
    status: 'Default Status'
  }
  refresh()
}

function refresh () {
  jobItems.innerHTML = ''
  for (const jobId in jobs) {
    const job = jobs[jobId]
    const d = document.createElement('div')
    const html = `
<div class=job-items-row onclick='displayJob("${jobId}")'>
  <div>${job.title}</div>
  <div>${job.company}</div>
  <div>${job.date_submitted}</div>
  <div>${job.status}</div>
</div>`
    d.innerHTML = html
    jobItems.appendChild(d)
  }

  const d = document.createElement('div')
  d.innerHTML = '<button>Add Application</button>'
  d.onclick = addApplication
  jobItems.appendChild(d)
  displayJob(urlParams.get('job'))
}

fetch(prefix+'jobs.json')
  .then(x => x.json())
  .then(y => {
    jobs = y
    refresh()
  })
