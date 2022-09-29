const Movie = require('../models/movie');
const { BadRequest } = require('../errors/BadRequest');
const { NotFound } = require('../errors/NotFound');
const { Forbidden } = require('../errors/Forbidden');

const getMovie = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при создании фильма'),
        );
        return;
      }
      next(err);
    });
};

const deleteMoviebyId = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Фильм с указанным _id не найден');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Этот фильм удалить невозможно');
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
        next(new BadRequest('Запрашиваемая карточка не найдена'));
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
