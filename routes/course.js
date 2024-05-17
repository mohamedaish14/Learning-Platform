const express = require("express");

const {
  creatCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course");
const { protect, authorizedTo } = require("../controllers/auth");
const router = express.Router();

router.post(
  "/",

 protect,
authorizedTo('instructor'),
  creatCourse
);
router.get("/",protect ,getAllCourses);
router.get("/:courseId", getCourse);
router.put("/:courseId", protect, authorizedTo("instructor"), updateCourse);
router.patch("/:courseId", protect, authorizedTo("instructor"), updateCourse);
router.delete("/:courseId", protect, authorizedTo("instructor"), deleteCourse);

module.exports = router;
