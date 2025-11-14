import { useState, useCallback, useEffect } from 'react';

interface TTSOptions{
    rate?: number; //0.1 to 10, default 1
    pitch?: number; //0.1 to 10, default 1
    volume?: number; //0.1 to 10, default 1
    voice?: SpeechSynthesisVoice | null;
}

interface UseTTSReturn {
    speak: (test: string, options?: TTSOptions) => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
    isSpeaking: boolean;
    isPaused: boolean;
    isSupported: boolean;
    voices: SpeechSynthesisVoice[];
}

export const UseTTS = (): UseTTSReturn =>{
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [isSupported] = useState(() => 'speechSynthesis' in Window);

    //Load available voices
    useEffect(() => {
        if(!isSupported) return;

        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();

        //loads voices asynchronously
        if(window.speechSynthesis.onvoiceschanged !== undefined){
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () =>{
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, [isSupported]);

    const speak = useCallback(
        (text: string, options: TTSOptions = {}) => {
            if(!isSupported){
                console.warn('Text-to-Speech is not supported in this browser');
                return;
            }

            //cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            //Apply options
            utterance.rate = options.rate ?? 1;
            utterance.pitch = options.pitch ?? 1;
            utterance.volume = options.volume ?? 1;

            if(options.voice){
                utterance.voice = options.voice;
            }

            //Event handlers
            utterance.onstart = () => {
                setIsSpeaking(true);
                setIsPaused(false);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };

            utterance.onerror = (event) => {
                console.error('Speech systhesis error:', event.error);
                setIsSpeaking(false);
                setIsPaused(false);
            };

            utterance.onpause = () => {
                setIsPaused(true);
            };

            utterance.onresume = () => {
                setIsPaused(false);
            };

            window.speechSynthesis.speak(utterance);
        },
        [isSupported]
    );

    const stop = useCallback(() =>{
        if(!isSupported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    }, [isSupported]);

    const pause = useCallback(() =>{
        if(!isSupported) return;
        window.speechSynthesis.pause();
        setIsPaused(true);
    }, [isSupported]);

    const resume = useCallback(() =>{
        if(!isSupported) return;
        window.speechSynthesis.resume();
        setIsPaused(false);
    }, [isSupported]);

    return {
        speak,
        stop,
        pause,
        resume,
        isSpeaking,
        isPaused,
        isSupported,
        voices,
    };
};