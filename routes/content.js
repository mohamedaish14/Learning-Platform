import express from "express";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import multer from "multer";
import config from "../utils/firebase.config"

const router = express.Router();
 
//Initialize a firebase application
initializeApp(config.firebaseConfig);