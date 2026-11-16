import siteJson from './site.json';
import { parseSite } from '../mirror/site.js';

export const site = parseSite(siteJson);
