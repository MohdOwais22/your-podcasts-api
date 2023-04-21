import { Podcast } from '../models/podcast.js';
import cloudinary from 'cloudinary';
import { asyncError } from '../middlewares/error.js';

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
    // Get the file details from Cloudinary
    const filePath = req.file.path;
    const options = {
      resource_type: req.body.resource_type,
      public_id: req.body.public_id,
    };

    const result = await cloudinary.v2.uploader.upload(filePath, options);

    // Return the public_id and url of the uploaded file
    const { public_id, secure_url: url, resource_type } = result;

    // Create a new Podcast instance with the uploaded file details
    const podcast = new Podcast({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      type: resource_type,
      speaker: req.body.speaker,
      file: {
        public_id,
        url,
      },
    });

    // Save the Podcast instance to the database
    await podcast.save();

    // Send a success response with the Podcast data
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
      $limit: 10,
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
