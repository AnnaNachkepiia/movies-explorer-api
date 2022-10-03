const Movie = require('../models/movie');
const { BadRequest } = require('../errors/BadRequest');
const { NotFound } = require('../errors/NotFound');
const { Forbidden } = require('../errors/Forbidden');
const {
  BAD_REQ_MOVIE_CREATE,
  MOVIEID_NOT_FOUND,
  FORBIDDEN_DEL,
  MOVIE_NOT_FOUND,
} = require('../consts/errorMessages');

const getMovie = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQ_MOVIE_CREATE));
        return;
      }
      next(err);
    });
};

const deleteMoviebyId = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound(MOVIEID_NOT_FOUND);
      } else if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden(FORBIDDEN_DEL);
      } else {
        Movie.deleteOne({ _id: req.params.movieId })
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(MOVIE_NOT_FOUND));
        return;
      }
      next(err);
    });
};

module.exports = {
  getMovie,
  createMovie,
  deleteMoviebyId,
};
