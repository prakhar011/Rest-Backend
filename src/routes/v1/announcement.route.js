const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const upload = require('../../middlewares/upload');
const announcementValidation = require('../../validations/announcement.validation');
const announcementController = require('../../controllers/announcement.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageAnnouncements'),
    validate(announcementValidation.createAnnouncement),
    upload.array('file', 5),
    announcementController.createAnnouncement
  )
  .get(auth('getAnnouncements'), validate(announcementValidation.getAnnoucements), announcementController.getAnnouncements);

router
  .route('/:announcementId')
  .get(auth('getAnnouncements'), validate(announcementValidation.getAnnoucement), announcementController.getAnnouncement)
  .patch(
    auth('manageAnnouncements'),
    validate(announcementValidation.updateAnnouncement),
    announcementController.updateAnnouncement
  )
  .delete(
    auth('manageAnnouncements'),
    validate(announcementValidation.deleteAnnouncement),
    announcementController.deleteAnnouncement
  );

module.exports = router;
