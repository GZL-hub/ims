import React, {useState} from 'react';
import {Mic, MicOff, Volume, Volume2} from 'lucide-react';
import { useTTS } from '../hooks/useTTS';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { useNavigate, useLocation } from 'react-router-dom';

const VoiceControlButton: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {speak, stop, isSpeaking} = useTTS();
    const [showCommands, setShowCommands] = useState(false);

    //Define commands
    const commands = [
        {//navigation commands
            command:/(?:go to|open|navigate to|show me|take me to) (?:the )?(dashboard|home)/i,
            action:()=> {
                navigate('/dashboard');
                speak('Opening dashboard');
            },
        },
        
        {
            command: /(?:go to|open|navigate to|show me) (?:the )?(reports?|analytics?)/i,
            action: () => {
                navigate('/reports');
                speak('Opening reports and analytics');
            },
        },

        {
            command: /(?:go to|open|navigate to|show me) (?:the )?alerts?/i,
            action: () => {
                navigate('/alerts');
                speak('Opening alerts page');
            },
        },

        {
            command: /(?:go to|open|navigate to|show me) (?:the )?(inventory|stock)/i,
            action: () => {
                navigate('/inventory');
                speak('Opening orders');
            },
        },

        {
            command: /(?:go to|open|navigate to|show me) (?:the )?orders?/i,
            action: () => {
                navigate('/orders');
                speak('Opening orders');
            },
        },

        {
            command: /(?:go to|open|navigate to|show me) (?:the )?(users?|people)/i,
            action: () => {
                navigate('/users');
                speak('Opening users');
            },
        },

        {
            command: /(?:go to|open|navigate to|show me) (?:the )?(settings?|preferences?)/i,
            action: () => {
                navigate('/settings');
                speak('Opening settings');
            },
        },

        {
            command: /(?:go to|open|navigate to|show me) (?:the )?barcode scanner/i,
            action: () => {
                navigate('/barcode-scanner');
                speak('Opening barcode scanner');
            },
        },

        {
            command: /(?:go to|open| navigate to|show me) (?:the )?roles?/i,
            action: () => {
                navigate('/roles');
                speak('Opening roles and access');
            },
        },

        //Read currnet page
        {
            command: /read (?:this )?page|what(?:'s| is') on (?:this )?page/i,
            action: () => readCurrentPage(),
        },

        //Controls
        {
            command: /stop|quiet|silence|shut up/i,
            action: () => stop(),
        },

        {
            command: /help|what can(?:i|you) (?:say|do)/i,
            action: () => {
                speak('You can say: go to dashboard, read page, open settings, or stop to stop speaking');
                setShowCommands(true);
                setTimeout(() => setShowCommands(false), 5000);
            },
        },

        //Page specific commands
        {
            command: /generate (?:a )?(pdf|csv) report/i,
            action: (matches) => {
                const format = matches?.[1]?.toLowerCase();
                speak(`Generating ${format} report. This feature will be implemented soon.`);
                //call report generation API
            },
        },
    ];

    const {isListening, startListening, stopListening, isSupported} = useVoiceCommands(commands);

    //read content on page
    const readCurrentPage = () => {
        const path = location.pathname;

        switch(path) {
            case '/dashboard':
                case '/':
                    speak('You are on the dashboard page. This is your main overview of the inventory system.');
                    break;
                case '/alerts':
                    speak('You are on the alerts page. Here you can view critical alerts, warning, and low stock notifications.');
                    break;
                case '/inventory':
                    speak('You are on the inventory page. Manage your stock items here.');
                    break;
                case '/reports':
                    speak('You are on the reports and analytics page. generate and view inventory reports.');
                    break;
                case '/orders':
                    speak('You are on the orders page. view and manage inventory orders.');
                    break;
                case '/users':
                    speak('You are on the users page. Manage system users.');
                    break;
                case '/roles':
                    speak('You are on the roles and access page. Configure user permissions.');
                    break;
                case '/settings':
                    speak('You are on the settings page. Customize your system preferences.');
                    break;
                case '/barcode-scanner':
                    speak('You are on the barcode scanner page. Scan items to quickly access or update inventory.');
                    break;
                default:
                    speak('Page information not availabile');
        }
    };

    const handleClick = () => {
        if(isSpeaking) {
            stop();
        }
        else if(isListening){
            stopListening();
        }
        else{
            startListening();
        }
    };

    if(!isSupported){
        return null //won't show button if browser doesn't support voice
    }

    return(
        <>
            <button
                onClick={handleClick}
                className="p-2 hover:bg-background-200 rounded-lg transition-colors flex items-center justify-center relative"
                aria-label={
                    isSpeaking ? 'Stop speaking' : isListening ? 'Stop listening' : 'Start voice control'
                }
                title = {
                    isSpeaking? 'Stop speaking' : isListening? 'Listening...' : 'Voice Control'
                }
            >
                {isSpeaking ? (
                    <Volume2 className ="h-5 w-5 text-accent-600 animate-bounce"/>
                ) : isListening ? (
                    <Mic className="h-5 w-5 text-primary-600 animate-pulse" />
                ) : (
                    <Mic className="h-5 w-5 text-text-700" />
                )}

                {(isListening || isSpeaking) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse"/>
                )}
            </button>

            {showCommands && (
                <div className="fixed top-20 right-6 z-50 w-80 bg-background-50 border border-background-200 rounded-lg shadow-lg p-4 animate-slideIn">
                    <h3 className = "text-sm font-semibold text-text-950 mb-2">Voice Commands</h3>
                    <div className="space-y-1 text-xs text-text-700">
                        <p>• "Go to dashboard/alerts/inventory"</p>
                        <p>• "Read Page"</p>
                        <p>• "Open settings"</p>
                        <p>• "Generate PDF report"</p>
                        <p>• "Stop" - Stop speaking</p>
                        <p>• "Help" - Show this menu</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default VoiceControlButton;