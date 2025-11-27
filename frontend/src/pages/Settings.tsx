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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-950 dark:text-white mb-2">Settings</h1>
      <p className="text-text-600 dark:text-text-400 mb-8">Manage your preferences and application settings.</p>

      {/* Voice Settings Section */}
      <div className="bg-background-50 border border-background-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Volume2 className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-text-950">Text-to-Speech Settings</h2>
        </div>

        {/* TTS Enable/Disable */}
        <div className="mb-6">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-text-900 font-medium">Enable Text-to-Speech</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.ttsEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, ttsEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-background-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-background-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </div>
          </label>
        </div>

        {/* Voice Selection */}
        <div className="mb-6">
          <label className="block text-text-900 font-medium mb-2">Voice</label>
          <select
            value={settings.selectedVoice}
            onChange={(e) => setSettings(prev => ({ ...prev, selectedVoice: e.target.value }))}
            className="w-full px-4 py-2 border border-background-300 rounded-lg bg-background-50 text-text-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={!settings.ttsEnabled}
          >
            <option value="">Default Voice</option>
            {voices.map((voice, index) => (
              <option key={index} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Speech Rate */}
        <div className="mb-6">
          <label className="block text-text-900 font-medium mb-2">
            Speech Rate: {settings.rate.toFixed(2)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.rate}
            onChange={(e) => setSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
            className="w-full h-2 bg-background-300 rounded-lg appearance-none cursor-pointer accent-primary-600"
            disabled={!settings.ttsEnabled}
          />
          <div className="flex justify-between text-xs text-text-600 mt-1">
            <span>Slower</span>
            <span>Normal</span>
            <span>Faster</span>
          </div>
        </div>

        {/* Pitch */}
        <div className="mb-6">
          <label className="block text-text-900 font-medium mb-2">
            Pitch: {settings.pitch.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.pitch}
            onChange={(e) => setSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
            className="w-full h-2 bg-background-300 rounded-lg appearance-none cursor-pointer accent-primary-600"
            disabled={!settings.ttsEnabled}
          />
          <div className="flex justify-between text-xs text-text-600 mt-1">
            <span>Lower</span>
            <span>Normal</span>
            <span>Higher</span>
          </div>
        </div>

        {/* Volume */}
        <div className="mb-6">
          <label className="block text-text-900 font-medium mb-2">
            Volume: {Math.round(settings.volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.volume}
            onChange={(e) => setSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
            className="w-full h-2 bg-background-300 rounded-lg appearance-none cursor-pointer accent-primary-600"
            disabled={!settings.ttsEnabled}
          />
          <div className="flex justify-between text-xs text-text-600 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Test Button */}
        <button
          onClick={handleTestVoice}
          disabled={!settings.ttsEnabled}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-background-300 disabled:text-text-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Zap className="h-5 w-5" />
          Test Voice Settings
        </button>
      </div>

      {/* Voice Commands Section */}
      <div className="bg-background-50 border border-background-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mic className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-text-950">Voice Commands</h2>
        </div>

        {/* Voice Commands Enable/Disable */}
        <div className="mb-6">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-text-900 font-medium">Enable Voice Commands</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.voiceCommandsEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, voiceCommandsEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-background-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-background-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </div>
          </label>
        </div>

        {/* Voice Commands Help */}
        <div className="bg-background-100 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text-950 mb-3">Available Commands</h3>
          <div className="space-y-2 text-sm text-text-700">
            <p><span className="font-medium">Navigation:</span> "Go to dashboard", "Open inventory", "Show settings"</p>
            <p><span className="font-medium">Page Info:</span> "Read page", "What's on this page"</p>
            <p><span className="font-medium">Speech Control:</span> "Speak faster/slower", "Make it louder/quieter"</p>
            <p><span className="font-medium">TTS Control:</span> "Turn on/off voice", "Test voice"</p>
            <p><span className="font-medium">General:</span> "Help", "Stop"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
