const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const datapath = path.join(__dirname, 'moviesData.db')
let db = null
app.use(express.json())
let initialization = async () => {
  try {
    db = await open({
      filename: datapath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('success')
    })
  } catch (e) {
    console.log(`${e.message}`)
  }
}
initialization()
let k = database => {
  return {
    movieName: database.movie_name,
  }
}
let o = dub => {
  return {
    movieId: dub.movie_id,
    directorId: dub.director_id,
    movieName: dub.movie_name,
    leadActor: dub.lead_actor,
  }
}
let y = don => {
  return {
    directorId: don.director_id,
    directorName: don.director_name,
  }
}
app.get('/movies/', async (request, response) => {
  const l = `SELECT *
             FROM movie`
  const movies = await db.all(l)
  response.send(movies.map(eachMovie => k(eachMovie)))
})
app.get('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const j = `SELECT *
           FROM movie
           WHERE movie_id=${movieId}`
  const x = await db.get(j)
  response.send(o(x))
})
app.post('/movies/', async (request, response) => {
  const p = request.body
  const {directorId, movieName, leadActor} = p
  const s = `INSERT INTO movie (director_id,movie_name,lead_actor)
  VALUES (${directorId},"${movieName}","${leadActor}");`
  const v = await db.run(s)
  response.send('Movie Successfully Added')
})
app.put('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const p = request.body
  let {directorId, movieName, leadActor} = p

  const updated = `UPDATE movie
                  SET 
                  director_id=${directorId},
                  movie_name="${movieName}",
                  lead_actor="${leadActor}"
                  WHERE movie_id=${movieId}`
  const g = await db.run(updated)
  response.send('Movie Details Updated')
})
app.delete('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const v = `SELECT *
          FROM movie
          WHERE movie_id =${movieId}`
  const n = await db.run(v)
  response.send('Movie Removed')
})
app.get('/directors/', async (request, response) => {
  const div = `SELECT *
             FROM director`
  const z = await db.all(div)
  response.send(z.map(eachDirector => y(eachDirector)))
})
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const r = `SELECT *
            FROM movie
            WHERE director_id=${directorId}`
  const f = await db.all(r)
  response.send(f.map(eachMovie => k(eachMovie)))
})
module.exports = app
