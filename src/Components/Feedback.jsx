import {useState} from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import toast from 'react-hot-toast';

const FeedbackTypes = {
    "Bug Report": 1,
    "General" : 0,
    "Feature Request": 2,
    "Other" : 3
};

const Feedback = () => {
    const [feedbackType , setFeedbackType] = useState(FeedbackTypes["Bug Report"]);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");


    const handleSubmit = async () => {
        try{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedbacks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                subject, 
                type: feedbackType,
                message}),
        });
        if(res.ok){
            const response = await res.json();
            toast.success("Feedback sent successfully:", response);
        } else {
            const response = await res.json();
            toast.error("Error sending feedback: " + response.message || 'An error occurred');
        }
        } catch (error) {
            console.error("Error sending feedback:", error);
        }
    };

    // Helper to count all characters including whitespace
    const countChars = (text) => text.length;

    // State for char count error
    const [charError, setCharError] = useState(false);

    const handleMessageChange = (e) => {
        const value = e.target.value;
        if (countChars(value) <= 1500) {
            setMessage(value);
            setCharError(false);
        } else {
            setCharError(true);
        }
    };

    return ( 
        <div className='min-h-full bg-gray-100'>
            <Card className='p-4 max-w-3xl mx-auto'>
                <p className='text-2xl pb-4'>
                    <strong>
                        Feel free to send us a feedback
                    </strong>
                </p>
                <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <input
                        type="text"
                        name='subject'
                        placeholder='Enter Subject'
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)} 
                        className='w-full p-2 border rounded mb-4'
                        required
                    />
                    
                    <select
                        name='feedbackType'
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(Number(e.target.value))}
                        className='w-full p-2 border rounded mb-4'
                        required
                    >
                        {Object.entries(FeedbackTypes).map(([type, value]) => (
                            <option key={value} value={value}>{type}</option>
                        ))}
                    </select>

                    <textarea
                        name='message'
                        placeholder='Enter message (max 1,500 characters)'
                        value={message}
                        onChange={handleMessageChange}
                        className='w-full p-2 h-32 border rounded mb-1 resize-y'
                        required
                    />
                    <div className='mb-3 text-sm text-gray-600 flex justify-between'>
                        <span>
                            {countChars(message)} / 1,500 characters
                        </span>
                        {charError && (
                            <span className='text-red-500'>Character limit exceeded!</span>
                        )}
                    </div>

                    <Button 
                        variant='primary' 
                        disabled={charError}
                    >
                        Send Feedback
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default Feedback;
