const express = require('express')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const fs = require('fs')
const app = express()

let prefix="/application-tracking-system/";

/*
 * Middleware for file upload and to parse JSON POST requests.
 */
app.use(fileUpload())
app.use(express.json())

/*
 * 'morgan' is used to log the HTTP requests that this server gets. When used
 * this way, it will log to both a file and standard output.
 */
app.use(morgan('common', {
  stream: fs.createWriteStream('./access.log', { flags: 'a' })
}))
app.use(morgan('dev'))

/*
 * Placeholder data for testing.
 */
let jobs = {
  1: {
    title: 'Title A',
    company: 'Company A',
    date_submitted: '2022-01-01',
    status: 'Dead'
  },
  2: {
    title: 'Title B',
    company: 'Company B',
    date_submitted: '2222-01-02',
    status: 'Alive'
  }
}

/*
 * Create a static route. Everything in the 'public' directory will be sent
 * as-is. That includes the index, CSS styling, script files, and images.
 */
app.use(prefix, express.static('public'))

/*
 * Return the complete list of jobs in JSON format.
 */
app.get(prefix+'getJobs', function (req, res) {
  res.json(jobs)
})

/*
 * Saves a file that was uploaded with a unique identifier based on the MD5 of
 * the file contents. Files are placed in the "uploads" directory, so it is
 * important that that directory exists.
 */
app.post(prefix+'uploadFile', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.doc) {
    return res.status(400).send('No files were uploaded.')
  }

  const file = req.files.doc
  const uploadPath = __dirname + '/uploads/' + file.md5 + '.' + file.name

  file.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send('Upload failed.')
    }

    res.status(200).send('File uploaded.')
  })
})

/*
 * Overwrite the "jobs" object with the contents of the POST. This could be
 * done more efficiently and with less risk of data loss by updating only parts
 * of the "jobs" object.
 */
app.post(prefix+'saveJobs', function (req, res) {
  if (req.body) {
    jobs = req.body
    res.status(200).send('OK.')
    return
  }
  res.status(400).send('Save Failed.')
})

/*
 * Redirect all traffic from root to the path specified by the prefix.
 */
app.get('/', function (req, res) {
  res.redirect(prefix);
})

/*
 * Start the server on localhost port 8081.
 */
app.listen(8081)
console.log('Listening on port 8081...')
