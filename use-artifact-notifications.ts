import { useEffect } from 'react';
import { Message, Fragment } from '~/types/chat.types';
import { NotificationService, ArtifactNotificationData } from '~/utils/notification-service';

// Types of artifacts that should trigger notifications
const ARTIFACT_TYPES = [
  'audio_upload_complete',
  'quantization_complete',
  'mixing_complete',
  'stem_separation_complete',
  'song_rendering_complete',
  'song_composition_complete',
  'lyrics_writing'
];

// Function to get a user-friendly message for each artifact type
const getArtifactMessage = (fragmentType: string, fragment: Fragment): string => {
  switch (fragmentType) {
    case 'audio_upload_complete':
      return 'Audio upload completed';
    case 'quantization_complete':
      return 'Audio quantization completed';
    case 'mixing_complete':
      return 'Audio mixing completed';
    case 'stem_separation_complete':
      return 'Stem separation completed';
    case 'song_rendering_complete':
      return 'Song rendering completed';
    case 'song_composition_complete':
      return 'Song composition completed';
    case 'lyrics_writing':
      return `Lyrics for "${(fragment as any).songName}" are ready`;
    default:
      return 'New artifact generated';
  }
};

// Hook to detect artifact generation and send notifications
export const useArtifactNotifications = (messages: Message[]) => {
  useEffect(() => {
    // Get the last message
    const lastMessage = messages[messages.length - 1];
    
    // Skip if no messages or if the last message is from the user
    if (!lastMessage || lastMessage.role !== 'assistant') return;
    
    // Check each fragment in the last message
    lastMessage.content.forEach(fragment => {
      // Check if this is an artifact type we want to notify about
      if (ARTIFACT_TYPES.includes(fragment.type)) {
        // Get artifact ID if available
        let artifactId;
        if ('audioId' in fragment) {
          artifactId = fragment.audioId;
        } else if ('butcherId' in fragment) {
          artifactId = fragment.butcherId;
        }
        
        // Create notification data
        const notificationData: ArtifactNotificationData = {
          type: fragment.type,
          message: getArtifactMessage(fragment.type, fragment),
          artifactId
        };
        
        // Send notification through our service
        NotificationService.sendNotification(notificationData);
      }
    });
  }, [messages]);
};
