const urlParams = new URLSearchParams(window.location.search);

let job_items=document.querySelector('#job-items')
let job_pane=document.querySelector('.right-job-pane')

let jobs={}

function change(id, key){
  let value=prompt("hi");
  jobs[id][key]=value
  display_job(id);
}

function save(){
  (async () => {
    const rawResponse = await fetch('/save', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobs)
    });
    const content = await rawResponse.text();

    console.log(content);
  })();
}

function display_job(id){
  window.history.pushState("", "", `/?job=${id}`);
  let job=jobs[id];
  let html=`
  <h1 onclick='change("${id}", "title")'>${job.title}</h1>
  <h2 onclick='change("${id}", "company")'>${job.company}</h2>
  <h3 onclick='change("${id}", "date_submitted")'>${job.date_submitted}</h3>
  <h3 onclick='change("${id}", "status")'>${job.status}</h3>
  <p  onclick='change("${id}", "notes")'>${job.notes}</p>
  <p  onclick='change("${id}", "description")'>${job.description}</p>
  <p  onclick='change("${id}", "some_other_attribute")'>${job.some_other_attribute}</p>
  <button onclick='save()'>Save</button>
  `
  job_pane.innerHTML=html;
}

function addApplication(){
  let id=btoa(Math.random()).substring(0,12)
  jobs[id]={
    'title':'Default Title',
    'company':'Default Company',
    'date_submitted':'Default Date',
    'status':'Default Status'
  }
  refresh()
}

function refresh(){
  job_items.innerHTML='';
  for(let job_id in jobs){
    job=jobs[job_id]
    let d=document.createElement("div");
    let html=`
<div class=job-items-row onclick='display_job("${job_id}")'>
  <div>${job.title}</div>
  <div>${job.company}</div>
  <div>${job.date_submitted}</div>
  <div>${job.status}</div>
</div>`
    d.innerHTML=html;
    job_items.appendChild(d);
  }

  let d=document.createElement("div");
  d.innerHTML=`<button>Add Application</button>`
  d.onclick=addApplication
  job_items.appendChild(d);
  display_job(urlParams.get('job'))
}

fetch('/jobs.json')
  .then(x => x.json())
  .then(y => {
    jobs=y;
    refresh()
  });
