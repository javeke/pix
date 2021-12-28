import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SANITY_PROJECT_ID, SANITY_TOKEN_ALL_ACCESS} from '../config';

export const client = sanityClient({
  projectId: SANITY_PROJECT_ID,
  dataset:'production',
  apiVersion: '2021-11-16',
  useCdn:true,
  token: SANITY_TOKEN_ALL_ACCESS
});


const builder = imageUrlBuilder(client);

export const urlFor = source => builder(source);