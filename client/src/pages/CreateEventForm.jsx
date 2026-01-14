import { useState } from 'react';
import api from "../api.js"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dt27lgrjo/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'my_unsigned_preset'; 

export default function CreateEventForm() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        venue: '',
        description: '',
        banner: null, 
        notify: false
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, banner: e.target.files[0] }));
    };

    const uploadImageToCloudinary = async (file) => {
        if (!file) return null;

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        try {
            const response = await api.post(
                CLOUDINARY_UPLOAD_URL, 
                data,
                {
                    withCredentials: false, 
                    headers: {
                        'Content-Type': 'multipart/form-data', 
                    }
                }
            );
            return response.data.secure_url; 
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            alert("Image upload failed.");
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !formData.banner) {
            alert("Please fill in all required fields and upload a banner.");
            return;
        }

        setLoading(true);
        
        try {
            const bannerUrl = await uploadImageToCloudinary(formData.banner);

            if (!bannerUrl) {
                setLoading(false);
                return;
            }

            const eventDataToPass = {
                title: formData.title,
                date: formData.date,
                venue: formData.venue,
                description: formData.description,
                banner: bannerUrl,
                notify: formData.notify,
            };

            // const response = await api.post('/api/events/create', finalEventData);

            // const newEventId = response.data.event._id
            console.log("Passing data to form builder:", eventDataToPass)

            alert('Event created successfully! Redirecting to Form Builder...');

            setFormData({ title: '', date: '', venue: '', description: '', banner: null }); 
            navigate('/create-event/form', { state: { eventData: eventDataToPass } })

        } catch (error) {
            console.error("Error preparing event data:", error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl mt-10">
            <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">Create New Event</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-blue-200">Event Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-600  shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-blue-200">Date</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-600  shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="venue" className="block text-sm font-medium text-blue-200">Venue</label>
                        <input
                            type="text"
                            name="venue"
                            id="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-600  shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-blue-200">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-600  shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="banner" className="block text-sm font-medium text-blue-200">Event Banner (Image)</label>
                    <input
                        type="file"
                        name="banner"
                        id="banner"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                        className="mt-1 block w-full text-sm text-blue-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                    />
                </div>

                <div className='flex items-center mb-4'>
                    <input
                        id="notify"
                        name="notify"
                        type="checkbox"
                        checked={formData.notify}
                        onChange={(e) => setFormData(prev => ({ ...prev, notify: e.target.checked}))}
                        className='h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700'
                    />
                    <label htmlFor='notify' className="ml-3 block text-sm font-medium text-blue-200">
                        Notify students on creation?(You can do this later from the dashboard)
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition duration-150 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                >
                    {loading ? 'Processing...' : 'Create Event'}
                </button>
            </form>
        </div>
    );
}