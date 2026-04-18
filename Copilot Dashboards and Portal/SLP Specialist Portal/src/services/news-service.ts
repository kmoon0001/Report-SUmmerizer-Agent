import axios from 'axios';
import { NewsItem } from '../types';

export const newsService = {
  getLatestNews: async (): Promise<NewsItem[]> => {
    try {
      const response = await axios.get('/api/news');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      console.warn('Expected array of news, got:', response.data);
      return [];
    } catch (error) {
      console.warn('Failed to fetch news from backend:', error);
      return [];
    }
  }
};
