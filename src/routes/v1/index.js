const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const studentRoute = require('./student.route');
const teacherRoute = require('./teacher.route');
const announcementRoute = require('./announcement.route');
const classRoute = require('./class.route');
const quizRoute = require('./quiz.route');
const bigFiveRoute = require('./bigFive.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/students',
    route: studentRoute,
  },
  {
    path: '/teachers',
    route: teacherRoute,
  },
  {
    path: '/announcements',
    route: announcementRoute,
  },
  {
    path: '/quiz',
    route: quizRoute,
  },
  {
    path: '/class',
    route: classRoute,
  },
  {
    path: '/bigFive',
    route: bigFiveRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
