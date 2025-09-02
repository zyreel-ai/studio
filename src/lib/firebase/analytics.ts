'use client';

import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { app } from './config';

class AnalyticsService {
  private analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

  logEvent = async (eventName: string, eventParams?: { [key: string]: any }) => {
    const analyticsInstance = await this.analytics;
    if (analyticsInstance) {
      logEvent(analyticsInstance, eventName, eventParams);
    } else {
      console.log(`Analytics not supported, but event fired: ${eventName}`, eventParams);
    }
  };
}

export const analyticsService = new AnalyticsService();
