const router = require('express').Router();
const { getMovie, deleteMoviebyId, createMovie } = require('../controllers/movies');
const { deleteMoviebyIdValidate, createMovieValidate } = require('../middlewares/validation');

router.get('/movies', getMovie);

router.delete(
  '/movies/:movieId',
  deleteMoviebyIdValidate,
  deleteMoviebyId,
);

router.post(
  '/movies',
  createMovieValidate,
  createMovie,
);

module.exports = router;
