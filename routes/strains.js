const express = require('express');

const {
  getStrains,
  getStrain,
  createStrain,
  updateStrain,
  deleteStrain,
  strainPhotoUpload,
} = require('../controllers/strains');

const Strain = require('../models/Strain');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router.route('/:id/photo').put(strainPhotoUpload);

router.route('/').get(advancedResults(Strain), getStrains).post(createStrain);

router.route('/:id').get(getStrain).put(updateStrain).delete(deleteStrain);

module.exports = router;
