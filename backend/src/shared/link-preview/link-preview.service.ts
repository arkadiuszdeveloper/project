import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class LinkPreviewService {
  async getPreviewData(url: string): Promise<any> {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const title =
        $('meta[property="og:title"]').attr('content') || $('title').text();
      const description =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');

      return { title, description, image };
    } catch (error) {
      // console.error('Error fetching URL data:', error);
      return null;
    }
  }
}
