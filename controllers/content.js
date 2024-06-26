const express = require("express");
const jwt = require("jsonwebtoken");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const multer = require("multer");
const firebaseConfig = require("../utils/firebase.config");
const ApiError = require("../utils/apiError");
const asyncHandeller = require("express-async-handlr");
const Course = require("../models/course");
const Session = require("../models/session");
const Content = require("../models/content");
const { protect, authorizedTo } = require("./auth");
const { where } = require("sequelize");

const router = express.Router();

//Initialize a firebase application
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

//creat content
router.post(
  "/:courseId/sessions/:sessionId/content",
  protect,
  authorizedTo("instructor"),
  upload.single("filename"),
  asyncHandeller(async (req, res, next) => {
    const { courseId, sessionId } = req.params;
    const name = req.body.name;

    let cId;
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
      cId = decodedToken.data.id;
    });

    const course = await Course.findOne({
      where: {
        id: courseId,
      },
    });

    console.log(`${cId}     :  ${course.instructorId}`);

    if (course.instructorId != cId) {
      return next(new ApiError(`No access to dd content in this course`, 404));
    }

    const session = await Session.findOne({
        where: {
          id: sessionId,
          courseId: courseId,
        },
      });
      
    if (!session) {
      return next(new ApiError(`No session for this id ${sessionId}`, 404));
    }
    const dateTime = giveCurrentDateTime();

    const safeOriginalName = encodeURIComponent(name);
    console.log(safeOriginalName);
    const safeDateTime = encodeURIComponent(dateTime);
    const storageRef = ref(
      storage,
      `files/${safeOriginalName} ${safeDateTime}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };
    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    const content = await Content.create({
      name: name,
      url: downloadURL,
      sessionId: sessionId,
      courseId: courseId,
      type: `${req.file.mimetype}`,
    });
    res.status(201).json({ data: content });
  })
);
//get all content
router.get(
  "/:courseId/sessions/:sessionId/content",
  protect,
  asyncHandeller(async (req, res, next) => {
    const { courseId, sessionId } = req.params;
    const course = await Course.findByPk(courseId);
    if (!course) {
      return next(new ApiError(`No course for this id ${courseId}`, 404));
    }
    const session = await Session.findOne({
      where: {
        id: sessionId,
        courseId: courseId,
      },
    });
    if (!session) {
      return next(new ApiError(`No session for this id ${sessionId}`, 404));
    }
    const content = await Content.findAll({
      where: { sessionId: sessionId, courseId: courseId },
    });
    if (!content) {
      return next(new ApiError(`No content for this id ${sessionId}`, 404));
    }
    res.status(200).json({ data: content, results: content.length });
  })
);

//get content
router.get(
  "/:courseId/sessions/:sessionId/content/:contentId",
  protect,
  asyncHandeller(async (req, res, next) => {
    const { courseId, sessionId, contentId } = req.params;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return next(new ApiError(`No course for this id ${courseId}`, 404));
    }
    const session = await Session.findOne({
      where: {
        id: sessionId,
        courseId: courseId,
      },
    });
    if (!session) {
      return next(new ApiError(`No session for this id ${sessionId}`, 404));
    }
    const content = await Content.findOne({
      where: {
        id: contentId,
        courseId: courseId,
        sessionId: sessionId,
      },
    });
    if (!content) {
      return next(new ApiError(`No content for this id ${contentId}`, 404));
    }
    res.status(200).json({ data: content });
  })
);

// update content
const updateContent = asyncHandeller(async (req, res, next) => {
  const { courseId, sessionId, contentId } = req.params;
  const { name } = req.body;

  let cId;
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
    cId = decodedToken.data.id;
  });
  const course = await Course.findOne({
    where: {
      id: courseId,
    },
  });

  if (course.instructorId != cId) {
    return next(
      new ApiError(`No access to update content in this course`, 404)
    );
  }

  const session = await Session.findOne({
    where: {
      id: sessionId,
      courseId: courseId,
    },
  });

  if (!session) {
    return next(new ApiError(`No session for this id ${sessionId}`, 404));
  }
  const cont = await Content.findOne({
    where: {
      id: contentId,
      courseId: courseId,
      sessionId: sessionId,
    },
  });
  if (!cont) {
    return next(new ApiError(`No content for this id ${contentId}`, 404));
  }
  const content = await Content.update(
    { name },
    { where: { id: contentId, courseId: courseId, sessionId: sessionId } }
  );
  res.status(200).json({ data: content });
});
router.put(
  "/:courseId/sessions/:sessionId/content/:contentId",
  protect,
  authorizedTo("instructor"),
  updateContent
);
// router.patch('/courseId/sessions/:sessionId/content/:contentId', updateContent);

//delete content
router.delete(
  "/:courseId/sessions/:sessionId/content/:contentId",
  protect,
  authorizedTo("instructor"),
  asyncHandeller(async (req, res, next) => {
    const { courseId, sessionId, contentId } = req.params;

    let cId;
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
      cId = decodedToken.data.id;
    });

    const course = await Course.findOne({
      where: {
        id: courseId,
      },
    });

    if (course.instructorId != cId) {
      return next(
        new ApiError(`No access to delete content from this course`, 404)
      );
    }
    const session = await Session.findOne({
      where: {
        id: sessionId,
        courseId: courseId,
      },
    });
    if (!session) {
      return next(new ApiError(`No session for this id ${sessionId}`, 404));
    }

    const content = await Content.findOne({
      where: {
        id: contentId,
        courseId: courseId,
        sessionId: sessionId,
      },
    });
    if (!content) {
      return next(new ApiError(`No content for this id ${contentId}`, 404));
    }
    await Content.destroy({
      where: { id: contentId, courseId: courseId, sessionId: sessionId },
    });
    res.status(204).json({ mss: "deleted" });
  })
);

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

module.exports = router;
