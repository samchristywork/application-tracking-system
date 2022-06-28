/*
 * Save the parameters defined in the query string
 */
const urlParams = new URLSearchParams(window.location.search)

/*
 * Select the DOM elements
 */
const jobItems = document.querySelector('#job-items')
const jobPane = document.querySelector('.right-job-pane')

/*
 * This variable is a JSON object that holds information about every job being
 * tracked. The server holds a copy as well, and in fact that's how this
 * variable gets populated.
 */
let jobs = {}

/*
 * This is the "URL prefix" that the user has to go to to access the system. I
 * am using a proxy to host projects like this, so the user would go to a URL
 * like:
 *
 * https://some.url/application-tracking-system/
 */
let prefix="/application-tracking-system/";

/*
 * An onclick callback that changes some value in the jobs struct, and
 * refreshes the right pane.
 */
function change (id, key) {
  const value = prompt('Change Value:')
  jobs[id][key] = value
  displayJob(id)
}

/*
 * This sends the job struct back to the server to take the place of the old
 * version.
 */
function save () {
  let currentJobId = urlParams.get('job')
  let job = jobs[currentJobId]
  if(job){
    job.notes = document.querySelector("#notes").value
    job.description = document.querySelector("#description").value
  }

  /*
   * Send the POST request
   */
  fetch(prefix+'saveJobs', {
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

/*
 * onclick callback for a button that uploads a cover letter to the server.
 */
function add_cover_letter (id) {
}

/*
 * onclick callback for a button that uploads a resume to the server.
 */
function add_resume (id) {
}

/*
 * Populates the right hand pane with data from the job struct.
 */
function displayJob (id) {
  window.history.pushState('', '', prefix+`?job=${id}`)
  const job = jobs[id]
  if(job){
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

    /*
     * Populate the text boxes with the correct data.
     */
    let notes = document.querySelector("#notes");
    let description = document.querySelector("#description");
    if(job.notes){
      notes.value=job.notes;
    }
    if(job.description){
      description.value=job.description;
    }
  }
}

/*
 * Create a new job application entry with a random ID and some default data
 * entered in.
 */
function addApplication () {
  letters="abcdefghijklmnopqrstuvwxyz"
  const id = [...Array(20).keys()].
    map(x => letters[Math.floor(Math.random()*(letters.length-.000001))]).join("")
  jobs[id] = {
    title: 'Default Title',
    company: 'Default Company',
    date_submitted: 'Default Date',
    status: 'Default Status'
  }
  refresh()
}

/*
 * Called on page load and when a new application is added. This populates the
 * left pane with the extant job applications to be browsed and clicked on.
 */
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

  /*
   * Add the "Add Application" button at the bottom.
   */
  const d = document.createElement('div')
  d.innerHTML = '<button>Add Application</button>'
  d.onclick = addApplication
  jobItems.appendChild(d)

  /*
   * Show the job that is being referred to by the URL query parameters.
   */
  displayJob(urlParams.get('job'))
}

/*
 * Get the list of jobs from the server and display them.
 */
fetch(prefix+'getJobs')
  .then(x => x.json())
  .then(y => {
    jobs = y
    refresh()
  })
