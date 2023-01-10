/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
const httpStatus = require('http-status');
const { Student, Academics, Class } = require('../models');
const ApiError = require('../utils/ApiError');
// const catchAsync = require('../utils/catchAsync');

/**
 * Create a student
 * @param {Object} studentBody
 * @returns {Promise<Student>}
 */
const createStudent = async (studentBody) => {
  if (await Student.isAdmissionNoTaken(studentBody.admissionNo)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admission no. already taken');
  }

  const academics = await Academics.create({ user: studentBody.user });
  const student = await Student.create({
    academics: academics._id,
    currentSection: studentBody.initialSection,
    currentClass: studentBody.initialClass,
    ...studentBody,
  });

  // eslint-disable-next-line no-use-before-define
  const studentClass = await getClassByStdAndSection(studentBody.initialClass, studentBody.initialSection);
  if (!studentClass) {
    Class.create({
      standard: studentBody.initialClass,
      section: studentBody.initialSection,
      studentList: [
        {
          user: student.user,
          name: student.fullName,
          optedSubjects: student.optedSubjects,
        },
      ],
      subjects: { curricular: [], cocurricular: [] },
      exams: { curricular: [], cocurricular: [] },
      academics: {
        curricular: [],
        cocurricular: [],
        attendance: {
          average: 0,
          averageOf: 0,
        },
      },
      session: studentBody.session,
      timetable: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      },
    });
  } else {
    studentClass.studentList.push({
      user: student.user,
      name: student.fullName,
    });
    await studentClass.save();
  }

  return student;
};

/**
 * Query for students
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryStudents = async (filter, options) => {
  // console.log(filter, options);
  const students = await Student.paginate(filter, options);
  return students;
};

/**
 * Get student by id
 * @param {ObjectId} id
 * @returns {Promise<Student>}
 */
const getStudentById = async (id) => {
  return Student.findById(id);
};

/**
 *
 * @param {Objectid} userId
 * @returns {Promise<Student>}
 */
const getStudentByUserId = async (userId) => {
  return Student.findOne({ user: userId }).populate('academics');
};

/**
 * Get student by admission number
 * @param {string} admissionNo
 * @returns {Promise<Student>}
 */
const getStudentByAdmissionNo = async (admissionNo) => {
  return Student.findOne({ admissionNo });
};

/**
 * Update student by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Student>}
 */
const updateStudentByUserId = async (userId, updateBody) => {
  const student = await getStudentByUserId(userId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  Object.assign(student, updateBody);
  await student.save();
  return student;
};

/**
 * Delete student by id
 * @param {ObjectId} id
 * @returns {Promise<Student>}
 */
const deleteStudentByUserId = async (userId) => {
  const student = await getStudentByUserId(userId);
  if (!student) throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  // eslint-disable-next-line no-use-before-define
  const studentClass = await getClassByStdAndSection(student.currentClass, student.currentSection);
  if (!studentClass) throw new ApiError(httpStatus.NOT_FOUND, 'StudentClass not found');
  studentClass.studentList.splice(
    studentClass.studentList.findIndex((a) => a.user === userId),
    1
  );
  await studentClass.save();
  // eslint-disable-next-line no-use-before-define
  const academics = await getAcademicsById(student.academics);
  if (academics) {
    await academics.remove();
  }
  await student.remove();
  return student;
};

const getAllAcademics = async (filter, options) => {
  const allAcademics = await Academics.paginate(filter, options);
  return allAcademics;
};

const getAcademicsById = async (id) => {
  return Academics.findById(id);
};

const getAcademicsByUserId = async (userId) => {
  return Academics.findOne({ user: userId });
};

const getClassByStdAndSection = async (std, sec) => {
  return Class.findOne({ standard: std, section: sec });
};

const updateAcademicsByUserId = async (userId, updateBody) => {
  const academics = await getAcademicsByUserId(userId);
  if (!academics) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Academics not found');
  }
  const student = await getStudentByUserId(userId);

  const studentClass = await getClassByStdAndSection(student.currentClass, student.currentSection);

  const date = new Date();
  const ISToffSet = 330;
  const currentDate = new Date(date.getTime() + ISToffSet);

  if (updateBody.attendance) {
    const presentN = updateBody.attendance.filter((a) => a.present).length;
    const totalN = updateBody.attendance.length;
    if (!studentClass.academics.attendance.average) {
      studentClass.academics.attendance.average = presentN / totalN;
      studentClass.academics.attendance.averageOf = totalN;

      studentClass.academics.attendance.date = new Date().toISOString();
    } else {
      const averageO = studentClass.academics.attendance.average;
      const totalO = studentClass.academics.attendance.averageOf;

      studentClass.academics.attendance.average = (averageO * totalO + presentN) / (totalO + totalN);
      studentClass.academics.attendance.averageOf = totalO + totalN;

      studentClass.academics.attendance.date = new Date().toISOString();
    }

    Object.assign(academics.attendance, updateBody.attendance);
  }

  if (updateBody.curricular) {
    updateBody.curricular.forEach((obj) => {
      const indexClass = studentClass.academics.curricular.findIndex(
        (e) => e.subject === obj.subject && e.unit === obj.unit
      );
      const indexCurricular = academics.curricular.findIndex((e) => e.subject === obj.subject && e.unit === obj.unit);
      if (indexClass !== -1) {
        if (indexCurricular !== -1) {
          const prevAvg = studentClass.academics.curricular[indexClass].average;
          const prevAvgOf = studentClass.academics.curricular[indexClass].averageOf;
          studentClass.academics.curricular[indexClass].average =
            (prevAvg * prevAvgOf + obj.score - academics.curricular[indexCurricular].score) / prevAvgOf;
          academics.curricular[indexCurricular].score = obj.score;
        } else {
          academics.curricular.push({
            subject: obj.subject,
            score: obj.score,
            date: currentDate,
            unit: obj.unit,
          });
          const prevAvg = studentClass.academics.curricular[indexClass].average;
          const prevAvgOf = studentClass.academics.curricular[indexClass].averageOf;
          studentClass.academics.curricular[indexClass].average = (prevAvg * prevAvgOf + obj.score) / (prevAvgOf + 1);
          studentClass.academics.curricular[indexClass].averageOf = prevAvgOf + 1;
        }
      } else {
        academics.curricular.push({
          subject: obj.subject,
          score: obj.score,
          date: currentDate,
          unit: obj.unit,
        });
        studentClass.academics.curricular.push({
          subject: obj.subject,
          average: obj.score,
          averageOf: 1,
          unit: obj.unit,
        });
      }
    });
  }

  if (updateBody.cocurricular) {
    updateBody.cocurricular.forEach((obj) => {
      const indexClass = studentClass.academics.cocurricular.findIndex(
        (e) => e.subject === obj.subject && e.unit === obj.unit
      );
      const indexCoCurricular = academics.cocurricular.findIndex((e) => e.subject === obj.subject && e.unit === obj.unit);
      if (indexClass !== -1) {
        if (indexCoCurricular !== -1) {
          const prevAvg = studentClass.academics.cocurricular[indexClass].average;
          const prevAvgOf = studentClass.academics.cocurricular[indexClass].averageOf;
          studentClass.academics.cocurricular[indexClass].average =
            (prevAvg * prevAvgOf + obj.score - academics.cocurricular[indexCoCurricular].score) / prevAvgOf;
          academics.cocurricular[indexCoCurricular].score = obj.score;
        } else {
          academics.cocurricular.push({
            subject: obj.subject,
            score: obj.score,
            date: currentDate,
            unit: obj.unit,
          });
          const prevAvg = studentClass.academics.cocurricular[indexClass].average;
          const prevAvgOf = studentClass.academics.cocurricular[indexClass].averageOf;
          studentClass.academics.cocurricular[indexClass].average = (prevAvg * prevAvgOf + obj.score) / (prevAvgOf + 1);
          studentClass.academics.cocurricular[indexClass].averageOf = prevAvgOf + 1;
        }
      } else {
        academics.cocurricular.push({
          subject: obj.subject,
          score: obj.score,
          date: currentDate,
          unit: obj.unit,
        });
        studentClass.academics.cocurricular.push({
          subject: obj.subject,
          average: obj.score,
          averageOf: 1,
          unit: obj.unit,
        });
      }
    });
  }

  await studentClass.save();
  await academics.save();
  return academics;
};

const updateMultiAcademicsByUserId = async (academicsList) => {
  var updatedAcademics = [];

  for (var i = 0; i < academicsList.length; i += 1) {
    var { userId } = academicsList[i];

    var updateBody = academicsList[i];
    delete updateBody.userId;

    const academics = await getAcademicsByUserId(userId);
    if (!academics) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Academics not found');
    }
    const student = await getStudentByUserId(userId);

    const studentClass = await getClassByStdAndSection(student.currentClass, student.currentSection);

    const date = new Date();
    const ISToffSet = 330;
    const currentDate = new Date(date.getTime() + ISToffSet);
    if (updateBody.attendance) {
      const presentN = updateBody.attendance.filter((a) => a.present).length;
      const totalN = updateBody.attendance.length;
      if (!studentClass.academics.attendance.average) {
        studentClass.academics.attendance.average = presentN / totalN;
        studentClass.academics.attendance.averageOf = totalN;

        studentClass.academics.attendance.date = new Date().toISOString();
      } else {
        const averageO = studentClass.academics.attendance.average;
        const totalO = studentClass.academics.attendance.averageOf;

        studentClass.academics.attendance.average = (averageO * totalO + presentN) / (totalO + totalN);
        studentClass.academics.attendance.averageOf = totalO + totalN;

        studentClass.academics.attendance.date = new Date().toISOString();
      }
      Object.assign(academics.attendance, updateBody.attendance);
    }
    if (updateBody.curricular) {
      updateBody.curricular.forEach((obj) => {
        const indexClass = studentClass.academics.curricular.findIndex(
          (e) => e.subject === obj.subject && e.unit === obj.unit
        );
        const indexCurricular = academics.curricular.findIndex((e) => e.subject === obj.subject && e.unit === obj.unit);
        if (indexClass !== -1) {
          if (indexCurricular !== -1) {
            const prevAvg = studentClass.academics.curricular[indexClass].average;
            const prevAvgOf = studentClass.academics.curricular[indexClass].averageOf;
            studentClass.academics.curricular[indexClass].average =
              (prevAvg * prevAvgOf + obj.score - academics.curricular[indexCurricular].score) / prevAvgOf;
            academics.curricular[indexCurricular].score = obj.score;
          } else {
            academics.curricular.push({
              subject: obj.subject,
              score: obj.score,
              date: currentDate,
              unit: obj.unit,
            });
            const prevAvg = studentClass.academics.curricular[indexClass].average;
            const prevAvgOf = studentClass.academics.curricular[indexClass].averageOf;
            studentClass.academics.curricular[indexClass].average = (prevAvg * prevAvgOf + obj.score) / (prevAvgOf + 1);
            studentClass.academics.curricular[indexClass].averageOf = prevAvgOf + 1;
          }
        } else {
          academics.curricular.push({
            subject: obj.subject,
            score: obj.score,
            date: currentDate,
            unit: obj.unit,
          });
          studentClass.academics.curricular.push({
            subject: obj.subject,
            average: obj.score,
            averageOf: 1,
            unit: obj.unit,
          });
        }
      });
    }
    if (updateBody.cocurricular) {
      updateBody.cocurricular.forEach((obj) => {
        const indexClass = studentClass.academics.cocurricular.findIndex(
          (e) => e.subject === obj.subject && e.unit === obj.unit
        );
        const indexCoCurricular = academics.cocurricular.findIndex((e) => e.subject === obj.subject && e.unit === obj.unit);
        if (indexClass !== -1) {
          if (indexCoCurricular !== -1) {
            const prevAvg = studentClass.academics.cocurricular[indexClass].average;
            const prevAvgOf = studentClass.academics.cocurricular[indexClass].averageOf;
            studentClass.academics.cocurricular[indexClass].average =
              (prevAvg * prevAvgOf + obj.score - academics.cocurricular[indexCoCurricular].score) / prevAvgOf;
            academics.cocurricular[indexCoCurricular].score = obj.score;
          } else {
            academics.cocurricular.push({
              subject: obj.subject,
              score: obj.score,
              date: currentDate,
              unit: obj.unit,
            });
            const prevAvg = studentClass.academics.cocurricular[indexClass].average;
            const prevAvgOf = studentClass.academics.cocurricular[indexClass].averageOf;
            studentClass.academics.cocurricular[indexClass].average = (prevAvg * prevAvgOf + obj.score) / (prevAvgOf + 1);
            studentClass.academics.cocurricular[indexClass].averageOf = prevAvgOf + 1;
          }
        } else {
          academics.cocurricular.push({
            subject: obj.subject,
            score: obj.score,
            date: currentDate,
            unit: obj.unit,
          });
          studentClass.academics.cocurricular.push({
            subject: obj.subject,
            average: obj.score,
            averageOf: 1,
            unit: obj.unit,
          });
        }
      });
    }
    // console.log('printing assing');
    // console.log(updateBody);

    await studentClass.save();
    await academics.save();

    updatedAcademics.push(updateBody);
  }

  return updatedAcademics;
};
const getStats = async (userId, isAcademics) => {
  const studentData = await Student.findOne({ user: userId }).populate('academics');
  if (!studentData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student Data not found');
  }
  const classData = await getClassByStdAndSection(studentData.currentClass, studentData.currentSection);
  if (!classData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class Data not found');
  }
  // Response Object
  var resp = {};
  // eslint-disable-next-line no-array-constructor
  resp.stats = new Array();
  //
  if (isAcademics === 'true') {
    if (classData.academics.curricular.length !== 0) {
      // creating set of Subjects present in Student's Records
      const subjectsAvailableSet = new Set();
      for (const x of studentData.academics.curricular) {
        subjectsAvailableSet.add(x.subject);
      }
      // destructuring set into an array of subjects
      const subjectsAvailable = [...subjectsAvailableSet];
      for (const x of subjectsAvailable) {
        const subObj = {};
        subObj.subject = x;
        /* Creating a term set to get the term who's records are present in student Data
      , we did similar process for getting subjects */
        const termSet = new Set();
        for (const z of studentData.academics.curricular) {
          if (z.subject === x) termSet.add(z.unit);
        }
        const availableTerm = [...termSet];
        // Declaring Feilds to be included in subject
        let classDataTotalAvgPercentage = 0;
        let studentDataAvgPercentage = 0;
        let studentDataOverallScore = 0;
        let cumulativeWeightage = 0;
        const termwiseData = [];
        let classDataScore = 0;
        //
        for (const y of availableTerm) {
          const termObj = {};
          const term = y;
          const termIndex = studentData.academics.curricular.findIndex((o) => o.unit === y && o.subject === x);
          const yourScore = studentData.academics.curricular[termIndex].score;
          const examIndex = classData.exams.curricular.findIndex((o) => o.examName === y);
          const { maxMarks } = classData.exams.curricular[examIndex];
          const yourPercentage = parseFloat(((yourScore / maxMarks) * 100).toFixed(2));
          const avgIndex = classData.academics.curricular.findIndex((o) => o.unit === y && o.subject === x);
          const classTotal = classData.academics.curricular[avgIndex].average;
          const classAvgPercentage = parseFloat(((classTotal / maxMarks) * 100).toFixed(2));
          /* cumulative weightage to calculate the final percentage of Class
        ( Considering the case the marks for all terms migh not be present ) */
          cumulativeWeightage += classData.exams.curricular[examIndex].weightage;
          studentDataOverallScore += parseFloat(
            ((yourPercentage / 100) * classData.exams.curricular[examIndex].weightage).toFixed(2)
          );
          classDataScore += parseFloat(
            ((classAvgPercentage / 100) * classData.exams.curricular[examIndex].weightage).toFixed(2)
          );
          termObj.term = term;
          termObj.yourPercentage = yourPercentage;
          termObj.classAvgPercentage = classAvgPercentage;
          termObj.yourPercentage = yourPercentage;
          termObj.yourScore = yourScore;
          termObj.maxMarks = maxMarks;
          termObj.date = studentData.academics.curricular[examIndex].date;
          termwiseData.push(termObj);
        }
        classDataTotalAvgPercentage = parseFloat(classDataScore.toFixed(2));
        studentDataAvgPercentage = parseFloat(((studentDataOverallScore / cumulativeWeightage) * 100).toFixed(2));
        subObj.overallClassAvgPercentage = classDataTotalAvgPercentage;
        subObj.yourOverallPercentage = studentDataAvgPercentage;
        subObj.overallScore = studentDataOverallScore;
        subObj.termWise = termwiseData;
        resp.stats.push(subObj);
      }
    }
  } else if (isAcademics === 'false' && studentData.academics.cocurricular.length !== 0) {
    if (classData.academics.cocurricular.length !== 0) {
      // creating set of Subjects present in Student's Records
      const subjectsAvailableSet = new Set();
      for (const x of studentData.academics.cocurricular) {
        subjectsAvailableSet.add(x.subject);
      }
      // destructuring set into an array of subjects
      const subjectsAvailable = [...subjectsAvailableSet];
      for (const x of subjectsAvailable) {
        const subObj = {};
        subObj.subject = x;
        /* Creating a term set to get the term who's records are present in student Data
      , we did similar process for getting subjects */
        const termSet = new Set();
        for (const z of studentData.academics.cocurricular) {
          if (z.subject === x) termSet.add(z.unit);
        }
        const availableTerm = [...termSet];
        // Declaring Feilds to be included in subject
        let classDataTotalAvgPercentage = 0;
        let studentDataAvgPercentage = 0;
        let studentDataOverallScore = 0;
        let cumulativeWeightage = 0;
        const termwiseData = [];
        let classDataScore = 0;
        //
        for (const y of availableTerm) {
          const termObj = {};
          const term = y;
          const termIndex = studentData.academics.cocurricular.findIndex((o) => o.unit === y && o.subject === x);
          const yourScore = studentData.academics.cocurricular[termIndex].score;
          const examIndex = classData.exams.cocurricular.findIndex((o) => o.examName === y);
          const { maxMarks } = classData.exams.cocurricular[examIndex];
          const yourPercentage = parseFloat(((yourScore / maxMarks) * 100).toFixed(2));
          const avgIndex = classData.academics.cocurricular.findIndex((o) => o.unit === y && o.subject === x);
          const classTotal = classData.academics.cocurricular[avgIndex].average;
          const classAvgPercentage = parseFloat(((classTotal / maxMarks) * 100).toFixed(2));
          /* cumulative weightage to calculate the final percentage of Class
        ( Considering the case the marks for all terms migh not be present ) */
          cumulativeWeightage += classData.exams.cocurricular[examIndex].weightage;
          studentDataOverallScore += parseFloat(
            ((yourPercentage / 100) * classData.exams.cocurricular[examIndex].weightage).toFixed(2)
          );
          classDataScore += parseFloat(
            ((classAvgPercentage / 100) * classData.exams.cocurricular[examIndex].weightage).toFixed(2)
          );
          termObj.term = term;
          termObj.yourPercentage = yourPercentage;
          termObj.classAvgPercentage = classAvgPercentage;
          termObj.yourPercentage = yourPercentage;
          termObj.yourScore = yourScore;
          termObj.maxMarks = maxMarks;
          termObj.date = studentData.academics.cocurricular[examIndex].date;
          termwiseData.push(termObj);
        }
        classDataTotalAvgPercentage = parseFloat(classDataScore.toFixed(2));
        studentDataAvgPercentage = parseFloat(((studentDataOverallScore / cumulativeWeightage) * 100).toFixed(2));
        subObj.overallClassAvgPercentage = classDataTotalAvgPercentage;
        subObj.yourOverallPercentage = studentDataAvgPercentage;
        subObj.overallScore = studentDataOverallScore;
        subObj.termWise = termwiseData;
        resp.stats.push(subObj);
      }
    }
  }
  // console.log(resp);
  return resp;
};
module.exports = {
  getStats,
  createStudent,
  queryStudents,
  getStudentById,
  getStudentByUserId,
  getStudentByAdmissionNo,
  getClassByStdAndSection,
  updateStudentByUserId,
  deleteStudentByUserId,
  getAllAcademics,
  getAcademicsByUserId,
  getAcademicsById,
  updateAcademicsByUserId,
  updateMultiAcademicsByUserId,
};
