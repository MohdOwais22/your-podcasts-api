import { Podcast } from '../models/podcast.js';
import cloudinary from 'cloudinary';
import { asyncError } from '../middlewares/error.js';
import fs from 'fs';

export const getAllPodcasts = asyncError(async (req, res, next) => {
  const { keyword, category } = req.query;
  const podcasts = await Podcast.find({
    name: {
      $regex: keyword ? keyword : '',
      $options: 'i',
    },
    category: category ? category : undefined,
  });

  res.status(200).json({
    success: true,
    podcasts,
  });
});

export const uploadFile = asyncError(async (req, res, next) => {
  try {
    const { path } = req.file;
    console.log(req.file);
    console.log(req.file.originalname);
    const filename = req.file.originalname.split('.')[0];

    const result = await cloudinary.v2.uploader.upload(path, {
      resource_type: 'video',
      public_id: filename,
      chunk_size: 6000000,
      eager: [
        { width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
        {
          width: 160,
          height: 100,
          crop: 'crop',
          gravity: 'south',
          audio_codec: 'none',
        },
      ],
    });

    // Delete the file from the server
    fs.unlinkSync(path);

    // Create a new Podcast
    const podcast = await Podcast.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      speaker: req.body.speaker,
      file: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });

    await podcast.save();

    res.status(200).json(podcast);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export const popularPodcasts = asyncError(async (req, res, next) => {
  const popularPodcasts = await Podcast.aggregate([
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        description: { $first: '$description' },
        category: { $first: '$category' },
        type: { $first: '$type' },
        speaker: { $first: '$speaker' },
        file: { $first: '$file' },
        popularity: { $sum: '$views' },
      },
    },
    {
      $sort: { popularity: -1 },
    },
    {
      $limit: 5,
    },
  ]);
  res.json(popularPodcasts);
});

// Update podcast views count
export const updatePodcastViews = asyncError(async (req, res, next) => {
  const { podcastId } = req.params;

  // Find the podcast in the database and increment its views count
  const podcast = await Podcast.findByIdAndUpdate(
    podcastId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!podcast) {
    return res.status(404).json({ message: 'Podcast not found' });
  }

  res.status(200).json({ success: true, podcast });
});

export const getPodcast = asyncError(async (req, res, next) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    res.status(200).json({ success: true, podcast });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export const getPodcasts = asyncError(async (req, res) => {
  try {
    const podcasts = await Podcast.find();
    res.status(200).json({ success: true, podcasts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
