/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  userService,
  tokenService,
  emailService,
  studentService,
  parentService,
  teacherService,
  adminService,
} = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  switch (req.body.role) {
    case 'student':
      const student = await studentService.createStudent({ user: user.id, email: req.body.email, ...req.body.details });
      return res.status(httpStatus.CREATED).send({ user, details: student });

    case 'parent':
      const parent = await parentService.createParent({ user: user.id, ...req.body.details });
      return res.status(httpStatus.CREATED).send({ user, details: parent });

    case 'teacher':
      const teacher = await teacherService.createTeacher({ user: user.id, ...req.body.details });
      return res.status(httpStatus.CREATED).send({ user, details: teacher });

    case 'admin':
      const admin = await adminService.createAdmin({ user: user.id, ...req.body.details });
      return res.status(httpStatus.CREATED).send({ user, details: admin });
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
