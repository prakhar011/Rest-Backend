const roles = ['student', 'parent', 'teacher', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getAnnouncements', 'getStudents', 'getAcademics']);
roleRights.set(roles[1], ['getAnnouncements', 'getStudents', 'getAcademics']);
roleRights.set(roles[2], [
  'getUsers',
  'getAnnouncements',
  'manageStudents',
  'manageAnnouncements',
  'getStudents',
  'getAcademics',
  'manageAcademics',
]);
roleRights.set(roles[3], [
  'getUsers',
  'getAnnouncements',
  'manageUsers',
  'getStudents',
  'manageStudents',
  'manageAnnouncements',
  'getAcademics',
  'manageAcademics',
  'manageTeachers',
]);

module.exports = {
  roles,
  roleRights,
};
