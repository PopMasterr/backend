import { Storage } from '@google-cloud/storage';
import path from 'path';

const serviceAccountPath = path.join(__dirname, './../../googleCloudStorageKey.json');

const storage = new Storage({
  keyFilename: serviceAccountPath,
  projectId: 'data-audio-439714-d9',
});

const bucketName = 'university_project_computer_organisation';
const bucket = storage.bucket(bucketName);

export { bucket };
