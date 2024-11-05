import { Storage } from '@google-cloud/storage';

const serviceAccount = JSON.parse(process.env.GOOGLE_CLOUD_STORAGE_KEY as string);

const storage = new Storage({
  credentials: serviceAccount,
  projectId: serviceAccount.project_id,
});

const bucketName = 'university_project_computer_organisation';
const bucket = storage.bucket(bucketName);

export { bucket };
