import { useState, useEffect, useCallback, useRef } from 'react';

declare global{
    interface Window{
        SpeechRecognition: new() => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

interface SpeechRecognition extends EventTarget{
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
    start(): void;
    stop(): void;
}

interface SpeechRecognitionEvent extends Event{
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList{
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult{
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative{
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface VoiceCommand {
    command: string | RegExp;
    action: (matches?: string[]) => void;
    description?: string;
}

interface UseVoiceCommandsOptions {
    continuous?: boolean; //Continuous listening
    lang?: string; //language
    autoStart?: boolean;
}

interface UseVoiceCommandsReturn {
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    startListening: () => void;
    stopListening: () => void;
    isSupported: boolean;
    error: string | null;
}

export const useVoiceCommands = (
    commands: VoiceCommand[],
    options: UseVoiceCommandsOptions = {}
): UseVoiceCommandsReturn => {
    const {
        continuous = false,
        lang = 'en-US',
        autoStart = false,
    } = options;

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported] = useState(() => {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    });

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const commandsRef = useRef(commands);

    //Update commands ref when commands change
    useEffect(() => {
        commandsRef.current = commands;
    }, [commands]);

    //Initialize speech recognition
    useEffect(() => {
        if(!isSupported) return;

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();

        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript('');
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = '';
            let final = '';

            for(let i = event.resultIndex; i < event.results.length; i++){
                const result = event.results[i];
                const transcriptPart = result[0].transcript;

                if(result.isFinal){
                    final += transcriptPart + ' ';
                } else{
                    interim += transcriptPart;
                }
            }

            setInterimTranscript(interim);

            if(final) {
                const fullTranscript = final.trim().toLowerCase();
                setTranscript(fullTranscript);

                commandsRef.current.forEach((cmd) => {
                    if(typeof cmd.command === 'string'){
                        const cmdLower = cmd.command.toLowerCase();
                        if(fullTranscript.includes(cmdLower)) {
                            cmd.action();
                        }
                    } else if (cmd.command instanceof RegExp){
                        const matches = fullTranscript.match(cmd.command);
                        if(matches){
                            cmd.action(Array.from(matches));
                        }
                    }
                });
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setError(event.error);
            setIsListening(false);
            console.error('Speech recognition error:', event.error);
        };

        recognitionRef.current = recognition;

        if(autoStart){
            recognition.start();
        }

        return() =>{
            if(recognitionRef.current){
                recognitionRef.current.stop();
            }
        };
    }, [isSupported, continuous, lang, autoStart]);

    const startListening = useCallback(() => {
        if(!isSupported){
            setError('Speech recognition is not supported in this browser');
            return;
        }

        if(recognitionRef.current && !isListening){
            try{
                recognitionRef.current.start();
            } catch(err){
                console.error('Error starting recognition:', err);
            }
        }
    }, [isSupported, isListening]);

    const stopListening = useCallback(() =>{
        if(recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    return{
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        isSupported,
        error,
    };
};