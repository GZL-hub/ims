import React, {useState, useEffect} from 'react';
import { Volume2, Mic, Zap } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';
import { useVoiceCommands } from '../hooks/useVoiceCommands';

interface VoiceSettings{
  ttsEnabled:boolean;
  rate: number;
  pitch: number;
  volume: number;
  voiceCommandsEnabled: boolean;
  selectedVoice: string;
}

const Settings: React.FC = () => {
  const {speak, voices} = useTTS();
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    //load settings from local storage
    const saved = localStorage.getItem('voiceSettings');
    return saved ? JSON.parse(saved) : {
      ttsEnabled: true,
      rate: 1,
      pitch: 1,
      volume: 1,
      voiceCommandsEnabled: true,
      selectedVoice: '',
    };
  });

  {/*save settings to local storage */}
  useEffect(() => {
    localStorage.setItem('voiceSettings', JSON.stringify(settings));
  }, 
  [settings]);

  //voice commands to change settings
  const commands = [
    { //rate
      command: /speak (faster|slower)/i,
      action:(matches?: string[]) => {
        const direction = matches?.[1]?.toLowerCase();
        const newRate = direction ==='faster' 
          ? Math.min(settings.rate + 0.25, 2)
          : Math.max(settings.rate - 0.25, 0.5);
        setSettings(prev => ({...prev, rate: newRate}));
        speak(`Speech rate set to ${newRate.toFixed(2)}`, {rate: newRate});
      },
    },

    { //volume
      command: /(?:set|make it) (louder|quieter)/i,
      action: (matches?: string[]) => {
        const direction = matches?.[1]?.toLowerCase();
        const newVolume = direction === 'louder'
          ? Math.min(settings.volume + 0.1, 1)
          : Math.max(settings.volume - 0.1, 0);
        setSettings (prev => ({...prev, volume: newVolume}));
        speak(`Volume set to ${Math.round(newVolume * 100)} percent`, {volume: newVolume});
      },
    },

    { //turn on or off tts
      command: /(?:turn|switch) (on|off) (?:voice|speech)/i,
      action: (matches?: string[]) => {
        const state = matches?.[1]?.toLowerCase() === 'on';
        setSettings(prev => ({...prev, ttsEnabled:state}));
        if(state){
          speak('Text to speech enabled');
        }
      },
    },

    {
      command: /test (?:voice|speech)/i,
      action: () => {
        speak('This is a test of the text to speech system. How does it sound?', {
          rate: settings.rate,
          pitch: settings.pitch,
          volume: settings.volume,
        });
      },
    },
  ];

  useVoiceCommands(commands);

  const handleTestVoice = () => {
    speak('This is a test of your current voice settings.',{
      rate: settings.rate,
      pitch: settings.pitch,
      volume: settings.volume,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-950 dark:text-white">Settings</h1>
      <p className="text-text-600 dark:text-text-400 mt-2">Manage your preferences and application settings.</p>
    </div>
  );
};

export default Settings;
