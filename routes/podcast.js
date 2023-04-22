import express from "express";
import {
    upload 
} from "../middlewares/multer.js";
import { getAllPodcasts, getPodcast, getPodcasts, updatePodcastViews, uploadFile } from "../controller/podcast.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/upload",isAuthenticated,isAdmin, upload.single('file'), uploadFile);

router.get("/getPodcasts", getAllPodcasts);

router.put("/updatePodcastViews/:podcastId", updatePodcastViews);

router.get("/getPodcast/:id", getPodcast);

router.get("/getEveryPodcasts", getPodcasts)


export default router;