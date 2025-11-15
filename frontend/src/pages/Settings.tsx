import React, {useState, useEffect} from 'react';
import { Volume2, Mic, Globe, Zap } from 'lucide-react';
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

// const Settings: React.FC = () => {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Settings</h1>
//       <p>Manage your settings here.</p>
//     </div>
//   );
// };

const Settings: React.FC = () => {
  const {speak, voices} = useTTS();
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    //load settings from local storage
    const saved = localStorage.getItem('voiceSettings');
    const saved ? JSON.parse(saved) : {
      ttsEnabled: true,
      rate: 1,
      pitch: 1,
      volume: 1,
      useVoiceCommandsEnabled: true,
      selectedVoice: '',
    };
  });

  //save settings to local storagee
  useEffect(() => {
    localStorage.setItem('voiceSettings', JSON.stringify(settings));
  }, 
  [settings]);

  //voice commands to change settings
  const commands = [
    { //rate
      command: /speak (faster/slower)/i,
      action:(matches) => {
        const direction = matches?.[1]?.toLowerCase();
        const newRate = direction ==='faster' 
          ? Math.min(settings.rate + 0.25, 2)
          : Math.max(settings.rate - 0.25, 2);
        setSettings(prev => ({...prev, rate: newRate}));
        speak(`Speech rate set to ${newRate.toFixed(2)}`, {rate: newRate});
      },
    },

    { //volume
      command: /(?:set|make it) (louder|quieter)/i,
      action: (matches) => {
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
      action: (matches) => {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-950">Settings</h1>
        <p className="text-text-600 mt-1">Customize your voice control preferences</p>
      </div>

      {/*TTS settings*/}
      <div className="bg-background-50 border border-background-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Volume2 className="h-6 w-6 text-primary-600" />
          <div>
            <h2 className="text-xl font-semibold text-text-950">Text-to-Speech</h2>
            <p className="text-sm text-text-600">Configure audio narration settings</p>
          </div>
        </div>

        <div className="space-y-6">
          {/*Enable and Disable*/}
          <div className="flex item-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-900">Enable Text-to-Speech</label>
              <p className="text-xs text-text-600">Allow the system to speak information alound</p>
            </div>
            
            <button onClick ={() => {
              const newState = !settings.ttsEnabled;
              setSettings(prev => ({...prev, ttsEnabled: newState}));
              if(newState) speak('Text to speech enabled');
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.ttsEnabled ? 'bg-primary-60' : 'bg-background-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.ttsEnabled ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
          </div>

          {/*Speech Rate*/}
          <div>
            <label className="block text-sm font-medium text-text-900 mb-2">
              Speech Rate: {settings.rate.toFixed(2)}x
            </label>

            <input
              type = "range"
              min = "0.5"
              max ="2"
              step="0.1"
              value={settings.rate}
              onChange={(e) => setSettings(prev =>({...prev, rate: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-background-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />

            <div className="flex justify-between text-xs text-text-600 mt-1">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          {/*Pitch */}
          <div>
            <label className="black text-sm font-medium text-text-900 mb-2">
              Pitch: {settings.pitch.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.pitch}
              onChange={(e) => setSettings(prev => ({...prev,pitch:parseFloat(e.target.value) }))}
              className="w-full h-2 bg-background-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />

            <div className="flex justify-between txt-xs text-text-600 mt-1">
              <span>Lower</span>
              <span>Higher</span>
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="block text-sm font-medium text-text-900 mb-2">
              Volume: {Math.round(settings.volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={(e) => setSettings(prev => ({...prev, volume:parseFloat(e.target.value) }))}
              className="w-full h-2 bg-background-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            
            <div className="flex justify-between text-ts text-text-600 mt-1">
              <span>Quiet</span>
              <span>Loud</span>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default Settings;
