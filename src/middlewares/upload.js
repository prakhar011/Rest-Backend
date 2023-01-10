/* eslint-disable object-shorthand */
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/config');

const BUCKET = config.aws.bucket;
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: BUCKET,
    key: function (req, file, cb) {
      // let name = file.originalname;
      // let temp = name.split('.');
      // const allowed=['.txt','']
      // console.log(temp);
      cb(null, file.originalname);
    },
  }),
});

module.exports = upload;
