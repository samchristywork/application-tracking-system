const urlParams = new URLSearchParams(window.location.search)

const jobItems = document.querySelector('#job-items')
const jobPane = document.querySelector('.right-job-pane')

let jobs = {}

function change (id, key) {
  const value = prompt('hi')
  jobs[id][key] = value
  displayJob(id)
}

function save () {
  (async () => {
    const rawResponse = await fetch('/save', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobs)
    })
    const content = await rawResponse.text()

    console.log(content)
  })()
}

function displayJob (id) {
  window.history.pushState('', '', `/?job=${id}`)
  const job = jobs[id]
  const html = `
  <h1 onclick='change("${id}", "title")'>${job.title}</h1>
  <h2 onclick='change("${id}", "company")'>${job.company}</h2>
  <h3 onclick='change("${id}", "date_submitted")'>${job.date_submitted}</h3>
  <h3 onclick='change("${id}", "status")'>${job.status}</h3>
  <p  onclick='change("${id}", "notes")'>${job.notes}</p>
  <p  onclick='change("${id}", "description")'>${job.description}</p>
  <p  onclick='change("${id}", "some_other_attribute")'>${job.some_other_attribute}</p>
  <button onclick='save()'>Save</button>
  `
  jobPane.innerHTML = html
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

fetch('/jobs.json')
  .then(x => x.json())
  .then(y => {
    jobs = y
    refresh()
  })
