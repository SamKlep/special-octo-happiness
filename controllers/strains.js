const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Strain = require('../models/Strain');

// @desc        Get all strains
// @route       GET /api/v1/strains
// @access      Public
exports.getStrains = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get single strain
// @route       GET /api/v1/strains/:id
// @access      Public
exports.getStrain = asyncHandler(async (req, res, next) => {
  const strain = await Strain.findById(req.params.id);

  if (!strain) {
    return next(
      new ErrorResponse(`Strain not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: strain });
});

// @desc        Create new strains
// @route       POST /api/v1/strains
// @access      Private
exports.createStrain = asyncHandler(async (req, res, next) => {
  const strain = await Strain.create(req.body);

  res.status(201).json({
    success: true,
    data: strain,
  });
});

// @desc        Update strain
// @route       PUT /api/v1/strains/:id
// @access      Private
exports.updateStrain = asyncHandler(async (req, res, next) => {
  const strain = await Strain.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!strain) {
    return next(
      new ErrorResponse(`Strain not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: strain });
});

// @desc        Delete strain
// @route       DELETE /api/v1/strains/:id
// @access      Private
exports.deleteStrain = asyncHandler(async (req, res, next) => {
  const strain = await Strain.findById(req.params.id);

  if (!strain) {
    return next(
      new ErrorResponse(`Strain not found with id of ${req.params.id}`, 404)
    );
  }

  strain.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc        Get bootcamps within a radius
// @route       GET /api/v1/bootcamps//radius/:zipcode/:distance
// @access      Private
// exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
//   const { zipcode, distance } = req.params;

// Get lat/lng from geocoder
// const loc = await geocoder.geocode(zipcode);
// const lat = loc[0].latitude;
// const lng = loc[0].longitude;

// Calc radius using radius
// Divide distance by radius of earthrs

// Earth Radius = 3,963 mi / 6,378 km
//   const radius = distance / 3963;

//   const bootcamps = await Bootcamp.find({
//     location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
//   });

//   res.status(200).json({
//     success: true,
//     count: bootcamps.length,
//     data: bootcamps,
//   });
// });

// @desc      Upload photo for strain
// @route     PUT /api/v1/strains/:id/photo
// @access    Private
exports.strainPhotoUpload = asyncHandler(async (req, res, next) => {
  const strain = await Strain.findById(req.params.id);

  if (!strain) {
    return next(
      new ErrorResponse(`Strain not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.File;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${strain._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Strain.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
