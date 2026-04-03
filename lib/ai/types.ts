export type AiFeature = 'tarot' | 'partnerStory' | 'aspectAnalysis' | 'eventLog';

export interface TarotPayload {
  feature: 'tarot';
  deck: string;
  spread: 'three-card' | 'celtic-cross';
  spreadLabels: string[];
  question: string;
  cards: string[];
  partnerName: string;
  partnerChart: Record<string, string>;
  partnerMbti: string;
  partnerCompatibility: Record<string, number>;
}

export interface PartnerStoryPayload {
  feature: 'partnerStory';
  partnerName: string;
  partnerMbti: string;
  partnerChart: Record<string, string>;
  partnerCompatibility: Record<string, number>;
  partnerNotes: string[];
  recentEvents: { date: string; tag: string; text: string }[];
}

export interface AspectAnalysisPayload {
  feature: 'aspectAnalysis';
  partnerName: string;
  partnerChart: Record<string, string>;
  partnerNotes: string[];
}

export interface EventLogPayload {
  feature: 'eventLog';
  eventText: string;
  eventTag: string;
  partnerName: string;
  partnerChart: Record<string, string>;
  partnerCompatibility: Record<string, number>;
}

export type AiRequestPayload =
  | TarotPayload
  | PartnerStoryPayload
  | AspectAnalysisPayload
  | EventLogPayload;
