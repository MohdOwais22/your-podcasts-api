import express from "express";
import {
    upload 
} from "../middlewares/multer.js";
import { getAllPodcasts, getPodcast, updatePodcastViews, uploadFile } from "../controller/podcast.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/upload",isAuthenticated,isAdmin, upload.single('file'), uploadFile);

router.get("/getPodcasts", getAllPodcasts);

router.get("/updatePodcastViews/:podcastId", updatePodcastViews)

router.get("/getPodcast/:id", getPodcast);



export default router;